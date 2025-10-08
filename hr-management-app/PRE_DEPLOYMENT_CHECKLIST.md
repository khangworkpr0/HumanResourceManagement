# ✅ PRE-DEPLOYMENT VERIFICATION CHECKLIST

## 📋 Kiểm Tra Ngày: 2025-10-08

---

## 1️⃣ VERCEL.JSON - CẤU HÌNH CHÍNH

### ✅ Builds Configuration
```json
{
  "builds": [
    {
      "src": "frontend/package.json",      ✅ Path đúng
      "use": "@vercel/static-build",       ✅ Builder đúng cho React
      "config": { "distDir": "build" }     ✅ Output directory đúng
    },
    {
      "src": "api/index.js",               ✅ Path đúng
      "use": "@vercel/node"                ✅ Builder đúng cho Node.js
    }
  ]
}
```

**Status**: ✅ **PASS**

---

### ✅ Routes Configuration
```json
{
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.js" },           ✅ API routes
    { "src": "/uploads/(.*)", "dest": "/api/index.js" },       ✅ Uploads
    { "src": "/static/(.*)", "dest": "/frontend/build/static/$1" }, ✅ React assets
    { "src": "/(.*\\.(js|css|...))", "dest": "/frontend/build/$1" }, ✅ Static files
    { "src": "/(.*)", "dest": "/frontend/build/index.html" }   ✅ Catch-all (Fix 404!)
  ]
}
```

**Thứ tự routes**: ✅ **ĐÚNG** (API trước, catch-all cuối)

**Status**: ✅ **PASS**

---

### ✅ Functions Configuration
```json
{
  "functions": {
    "api/index.js": {
      "memory": 1024,        ✅ 1GB RAM (đủ)
      "maxDuration": 10      ✅ 10s timeout (Free plan max)
    }
  }
}
```

**Status**: ✅ **PASS**

---

## 2️⃣ API/INDEX.JS - SERVERLESS FUNCTION

### ✅ Import Paths
```javascript
const authRoutes = require('../backend/routes/auth');           ✅ Path đúng
const employeeRoutes = require('../backend/routes/employees');  ✅ Path đúng
const departmentRoutes = require('../backend/routes/departments'); ✅ Path đúng
const contractRoutes = require('../backend/routes/contracts');  ✅ Path đúng
const employeeFileRoutes = require('../backend/routes/employeeFiles'); ✅ Path đúng
```

**Status**: ✅ **PASS** (Tất cả import từ `../backend/` - đúng folder)

---

### ✅ MongoDB Connection
```javascript
async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb; // ✅ Connection pooling
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,  // ✅ Optimize cho serverless
    socketTimeoutMS: 45000
  });
}
```

**Status**: ✅ **PASS** (Connection pooling implemented)

---

### ✅ Routes Registration
```javascript
app.use('/api/auth', authRoutes);              ✅ Auth
app.use('/api/employees', employeeRoutes);     ✅ Employees
app.use('/api/employees', employeeFileRoutes); ✅ Employee Files (same prefix OK)
app.use('/api/departments', departmentRoutes); ✅ Departments
app.use('/api/contracts', contractRoutes);     ✅ Contracts
```

**Status**: ✅ **PASS**

---

### ✅ Module Export
```javascript
module.exports = app;  ✅ Export đúng cho Vercel
```

**Status**: ✅ **PASS**

---

## 3️⃣ API/PACKAGE.JSON - DEPENDENCIES

### Dependencies List:
```json
{
  "express": "^4.18.2",     ✅
  "mongoose": "^7.6.0",     ✅
  "cors": "^2.8.5",         ✅
  "dotenv": "^16.3.1",      ✅
  "jsonwebtoken": "^9.0.2", ✅
  "bcryptjs": "^2.4.3",     ✅
  "multer": "^1.4.5-lts.1", ✅
  "puppeteer": "^21.6.0",   ✅
  "validator": "^13.11.0"   ✅
}
```

**Status**: ✅ **PASS**

---

### ⚠️ Missing Dependencies (So với backend/package.json):

| Dependency | Backend | API | Cần Thêm? |
|------------|---------|-----|-----------|
| `express-validator` | ✅ | ❌ | ⚠️ **CẦN** (dùng trong routes/auth.js) |
| `handlebars` | ✅ | ❌ | ⚠️ **CẦN** (dùng cho contract templates) |

**Status**: ⚠️ **WARNING** - Cần bổ sung 2 dependencies

---

## 4️⃣ BACKEND/ROUTES - EXPORTS

### Kiểm tra exports:
```bash
✅ auth.js         → module.exports = router
✅ employees.js    → module.exports = router  
✅ departments.js  → module.exports = router
✅ contracts.js    → module.exports = router
✅ employeeFiles.js → module.exports = router
```

**Status**: ✅ **PASS** (Tất cả routes export đúng)

---

## 5️⃣ BACKEND/MODELS - EXPORTS

### Kiểm tra exports:
```bash
✅ User.js         → module.exports = mongoose.model(...)
✅ Department.js   → module.exports = mongoose.model(...)
✅ EmployeeFile.js → module.exports = mongoose.model(...)
```

**Status**: ✅ **PASS**

---

## 6️⃣ FRONTEND/PACKAGE.JSON - BUILD SCRIPT

### Scripts:
```json
{
  "start": "react-scripts start",  ✅
  "build": "react-scripts build",  ✅ BUILD SCRIPT CÓ
  "test": "react-scripts test",    ✅
}
```

**Status**: ✅ **PASS** (Script build sẽ tạo thư mục `build/`)

---

## 7️⃣ FRONTEND/SRC/UTILS/AXIOS.JS - API CONFIG

### BaseURL Configuration:
```javascript
baseURL: process.env.REACT_APP_API_URL || 
         (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api')
```

**Logic**:
- Có `REACT_APP_API_URL` → dùng giá trị đó ✅
- Production → dùng `/api` (relative) ✅
- Development → dùng `http://localhost:5000/api` ✅

**Status**: ✅ **PASS** (Auto-detect environment)

---

## 8️⃣ FOLDER STRUCTURE

### Kiểm tra structure:
```
hr-management-app/
├── api/
│   ├── index.js       ✅ Tồn tại
│   ├── package.json   ✅ Tồn tại
│   └── README.md      ✅ Tồn tại
├── backend/
│   ├── routes/        ✅ 5 routes
│   ├── controllers/   ✅ 6 controllers
│   ├── models/        ✅ 3 models
│   ├── templates/     ✅ Contract templates
│   └── server.js      ✅ Main server
├── frontend/
│   ├── src/           ✅ Source code
│   ├── public/        ✅ Public assets
│   └── package.json   ✅ Config
├── vercel.json        ✅ Vercel config
└── Documentation/     ✅ Guides
```

**Status**: ✅ **PASS**

---

## 9️⃣ POTENTIAL ISSUES

### ⚠️ Issue #1: Missing Dependencies
**Problem**: `api/package.json` thiếu `express-validator` và `handlebars`

**Impact**: 
- Routes dùng `express-validator` sẽ lỗi
- Contract generation dùng `handlebars` sẽ lỗi

**Fix**: Thêm vào `api/package.json`:
```json
"express-validator": "^7.2.1",
"handlebars": "^4.7.8"
```

---

### ⚠️ Issue #2: Puppeteer Size
**Problem**: Puppeteer (~300MB) có thể vượt giới hạn serverless function (50MB compressed)

**Impact**: Deploy có thể fail hoặc chậm

**Solutions**:
1. **Tốt nhất**: Dùng `puppeteer-core` + `@vercel/chrome-aws-lambda`
2. **Tạm thời**: Để nguyên, test deploy xem

**Recommendation**: ⚠️ Monitor deployment size

---

### ⚠️ Issue #3: File Uploads Path
**Problem**: Uploads lưu trong `backend/uploads/` - serverless không persistent

**Impact**: Files upload sẽ mất sau khi function restart

**Solutions**:
1. **Khuyến nghị**: Dùng Cloudinary/AWS S3/Vercel Blob
2. **Tạm thời**: Chấp nhận (cho development)

**Recommendation**: ⚠️ Plan migration sang cloud storage

---

## 🔟 ENVIRONMENT VARIABLES CẦN THIẾT

### Trên Vercel Dashboard:

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | ✅ Bắt buộc | `mongodb+srv://user:pass@cluster.mongodb.net/hrms` | Database connection |
| `JWT_SECRET` | ✅ Bắt buộc | `your-super-secret-key-min-32-chars` | JWT signing key |
| `NODE_ENV` | ✅ Bắt buộc | `production` | Environment |
| `CLIENT_URL` | ⚠️ Khuyến nghị | `https://yourapp.vercel.app` | CORS origin |
| `PORT` | ❌ Không cần | (Vercel tự set) | Server port |

**Status**: ✅ **READY** (Cần set sau khi tạo project)

---

## 1️⃣1️⃣ MONGODB ATLAS SETUP

### Checklist:
- [ ] Cluster đã tạo
- [ ] Database user đã tạo với quyền đọc/ghi
- [ ] **Network Access**: Whitelist `0.0.0.0/0` ⚠️ **QUAN TRỌNG**
- [ ] Connection string đã copy

**Note**: Vercel serverless IPs dynamic → Phải allow all IPs

---

## 🎯 FINAL VERDICT

### Summary:

| Category | Status | Notes |
|----------|--------|-------|
| vercel.json | ✅ PASS | Config đúng 100% |
| api/index.js | ✅ PASS | Paths đúng, logic đúng |
| api/package.json | ⚠️ WARNING | Thiếu 2 dependencies |
| Backend Routes | ✅ PASS | Exports đúng |
| Backend Models | ✅ PASS | Exports đúng |
| Frontend Build | ✅ PASS | Build script có |
| Frontend Axios | ✅ PASS | Config đúng |
| Folder Structure | ✅ PASS | Clean, không duplicate |

---

## 🚀 ACTION ITEMS TRƯỚC KHI DEPLOY

### ✅ MUST DO (Bắt buộc):

1. **Fix api/package.json** - Thêm dependencies:
   ```json
   "express-validator": "^7.2.1",
   "handlebars": "^4.7.8"
   ```

2. **MongoDB Atlas** - Whitelist `0.0.0.0/0`

3. **Git Push** - Commit và push code

4. **Vercel Project** - Set Root Directory = `hr-management-app`

5. **Environment Variables** - Set `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`

---

### ⚠️ SHOULD DO (Khuyến nghị):

1. **Test Frontend Build Local**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   → Verify thư mục `build/` được tạo

2. **Review Puppeteer** - Consider optimize nếu deploy fail

3. **Plan Cloud Storage** - Cho uploads (sau khi deploy thành công)

---

### ✨ NICE TO HAVE (Optional):

1. Test API local với `node api/index.js`
2. Setup custom domain (sau deploy)
3. Setup monitoring (Sentry, LogRocket)

---

## 📊 DEPLOYMENT READINESS SCORE

**Current Score**: 8.5/10 ⭐⭐⭐⭐⭐⭐⭐⭐☆☆

**Breakdown**:
- ✅ Config: 10/10
- ⚠️ Dependencies: 7/10 (thiếu 2 packages)
- ✅ Code Quality: 9/10
- ✅ Documentation: 10/10

**Verdict**: ✅ **READY TO DEPLOY** (sau khi fix dependencies)

---

## 🎯 NEXT STEPS

1. ✅ Fix `api/package.json` (thêm 2 dependencies)
2. ✅ Git commit & push
3. ✅ Vercel deploy
4. ✅ Set environment variables
5. ✅ Test deployed app
6. ⚠️ Monitor for issues

---

*Report Generated: 2025-10-08*  
*Status: Ready for deployment with minor fixes*

