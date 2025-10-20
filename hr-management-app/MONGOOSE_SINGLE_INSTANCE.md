# 🔧 Mongoose Single Instance Pattern

## 🎯 Vấn đề: Buffering Timeout

```
"Operation `users.findOne()` buffering timed out after 10000ms"
```

### Nguyên nhân GỐC:

**Models phải được define trên CÙNG mongoose instance với connection!**

Theo Mongoose documentation:
> "Each model has exactly one connection to MongoDB. The buffering timeout typically happens because you registered a model on a newly created connection but are using `mongoose.connect()`."

---

## 📚 Cách Mongoose hoạt động

### **1. Mongoose Singleton**

```javascript
// Node.js caches require()
const mongoose1 = require('mongoose');
const mongoose2 = require('mongoose');

console.log(mongoose1 === mongoose2);  // true - SAME instance!
```

Node.js **caches** modules, nên mỗi lần `require('mongoose')` đều return **CÙNG instance**.

### **2. Default Connection**

```javascript
const mongoose = require('mongoose');

// Khi bạn gọi:
mongoose.connect('mongodb://...');

// Nó tạo connection trên DEFAULT mongoose instance
// mongoose.connection <- default connection
```

### **3. Models use Default Connection**

```javascript
const mongoose = require('mongoose');

// Model được define trên DEFAULT instance
const User = mongoose.model('User', userSchema);

// Model này sẽ dùng mongoose.connection
// (connection được tạo bởi mongoose.connect())
```

---

## ❌ Cách GÂY LỖI

### **Anti-pattern 1: Define models BEFORE connect**

```javascript
// ❌ WRONG ORDER
const User = require('./models/User');  // Models defined here
                                         // mongoose.model() is called
                                         // But NO connection yet!

await mongoose.connect(uri);             // Connection AFTER models
                                         // TOO LATE!

// When you call User.findOne():
// → Model tries to use connection
// → Connection not ready
// → Mongoose buffers query
// → After 10 seconds → TIMEOUT!
```

### **Anti-pattern 2: Multiple mongoose instances (rare)**

```javascript
// ❌ WRONG - Creating separate instances
const mongoose1 = require('mongoose');
const mongoose2 = new (require('mongoose').Mongoose)();

mongoose1.connect(uri);                  // Connect on instance 1

const schema = new mongoose2.Schema(...);
const User = mongoose2.model('User', schema);  // Model on instance 2

// User is on instance 2
// But connection is on instance 1
// → THEY DON'T SHARE CONNECTION!
```

---

## ✅ Giải pháp ĐÚNG

### **Pattern 1: Connect BEFORE defining models**

```javascript
// ✅ CORRECT ORDER
await mongoose.connect(uri);             // Connect FIRST

const User = require('./models/User');  // Models defined AFTER
                                         // mongoose.model() is called
                                         // Connection already exists!

User.findOne();                          // ✅ Works!
```

### **Pattern 2: Dynamic route loading (our solution)**

```javascript
// api/db.js - Import FIRST
const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);  // Set BEFORE connection

// api/index.js
const connectDB = require('./db');      // Import db.js FIRST

async function initializeApp() {
  // STEP 1: Connect
  await connectDB();
  
  // STEP 2: Load routes (which import models)
  loadRoutes();  // Models defined AFTER connection exists
}
```

---

## 🔍 Our Implementation

### **File Import Order (CRITICAL!):**

```
1. api/index.js starts
   ↓
2. const connectDB = require('./db')  ← Import FIRST!
   ↓
3. db.js loads:
   - const mongoose = require('mongoose')
   - mongoose.set('bufferCommands', false)  ← Set globally
   ↓
4. First request arrives
   ↓
5. ensureInitialized middleware runs
   ↓
6. await connectDB()  ← Connect to MongoDB
   ↓
7. loadRoutes()  ← Load routes NOW
   ↓
8. Routes import controllers
   ↓
9. Controllers import models
   ↓
10. Models call mongoose.model()  ← Models defined NOW
    ↓
    ✅ Connection already exists!
    ✅ Models use that connection!
```

### **Key Points:**

1. **`db.js` imported FIRST:**
   ```javascript
   // api/index.js line 9-10
   const connectDB = require('./db');  // FIRST import!
   ```

2. **`bufferCommands = false` set EARLY:**
   ```javascript
   // api/db.js line 15
   mongoose.set('bufferCommands', false);
   ```

3. **Routes loaded AFTER connection:**
   ```javascript
   // api/index.js line 66-81
   async function initializeApp() {
     await connectDB();      // Connect FIRST
     loadRoutes();           // Load routes AFTER
   }
   ```

4. **Models imported INSIDE loadRoutes():**
   ```javascript
   // api/index.js line 32
   const authRoutes = require('../backend/routes/auth');
   // This imports controllers
   // Which import models
   // At this point, connection EXISTS!
   ```

---

## 🎯 Why This Works

### **Timeline:**

```
Time 0: App starts
  → db.js imported
  → mongoose.set('bufferCommands', false) ← GLOBAL setting
  
Time T1: First request
  → ensureInitialized middleware
  → await connectDB()
  → mongoose.connect(uri) ← CONNECTION CREATED
  → readyState = 1 (connected)
  
Time T2: Connection ready
  → loadRoutes()
  → require('../backend/routes/auth')
    → require('../controllers/authController')
      → const User = require('../models/User')
        → mongoose.model('User', schema) ← MODEL DEFINED
        → Uses mongoose.connection ← CONNECTION EXISTS! ✅
  
Time T3: Request continues
  → Controller runs
  → User.findOne() ← WORKS! ✅
```

---

## 📊 Verification

### **Logs you should see:**

```
🚀 Initializing application...
🔌 Connecting to MongoDB: mongodb+srv://user:****@...
⏳ Attempting connection...
✅ MongoDB Connected Successfully
   Host: cluster.mongodb.net
   Database: humandb
   ReadyState: 1
📊 Mongoose bufferCommands: false        ← Should be false
📊 Connection readyState: 1               ← Should be 1
📦 Loading routes (after DB connection)...
✅ All routes loaded successfully
✅ App fully initialized
```

### **Health check:**

```bash
curl https://your-app.vercel.app/api/health
```

Response:
```json
{
  "initialized": true,
  "routesLoaded": true,
  "dbStatus": "connected",
  "dbReadyState": 1
}
```

---

## ⚠️ Common Mistakes

### **Mistake 1: Importing models at top level**

```javascript
// ❌ BAD
const User = require('../models/User');  // Top level import

app.get('/users', async (req, res) => {
  const users = await User.find();  // May fail if not connected yet
});
```

```javascript
// ✅ GOOD - Dynamic route loading
function loadRoutes() {
  const authRoutes = require('../routes/auth');  // Routes import models
  app.use('/api/auth', authRoutes);
}

await connectDB();  // Connect FIRST
loadRoutes();       // Load AFTER
```

### **Mistake 2: Not setting bufferCommands early**

```javascript
// ❌ BAD
const User = require('../models/User');  // Model defined
mongoose.set('bufferCommands', false);    // TOO LATE!
```

```javascript
// ✅ GOOD
mongoose.set('bufferCommands', false);    // Set FIRST
const User = require('../models/User');  // Model defined AFTER
```

### **Mistake 3: Multiple connections**

```javascript
// ❌ BAD
const conn1 = mongoose.createConnection(uri1);
const conn2 = mongoose.createConnection(uri2);
const User = mongoose.model('User', schema);  // Which connection?
```

```javascript
// ✅ GOOD - Use default connection
await mongoose.connect(uri);
const User = mongoose.model('User', schema);  // Uses default connection
```

---

## 🎯 Summary

**Rule:** Models must use the SAME mongoose instance that has the connection.

**Our solution:**
1. Import `db.js` FIRST → Sets `bufferCommands = false`
2. Connect to DB FIRST → `mongoose.connect()`
3. Load routes AFTER → Models defined after connection exists
4. All use default mongoose instance → Same connection for all models

**Result:** ✅ No more buffering timeout!

---

**Updated:** 2024-10-20  
**Version:** 2.3.0  
**Files:** `api/index.js`, `api/db.js`  
**Impact:** Ensures single mongoose instance pattern

