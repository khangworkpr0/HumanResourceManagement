# ✅ MongoDB Atlas Setup - COMPLETE

## 🎉 Connection String Ready!

### 📋 Thông Tin Kết Nối

**Cluster**: `cluster0.3ohoovb.mongodb.net`  
**Username**: `khua8986_db_user`  
**Password**: `MQ2FXE9phRNFkgGJ`  
**Database**: `hrms`  

---

## 🔗 Connection String

### Full Connection String (đã add database name):
```
mongodb+srv://khua8986_db_user:MQ2FXE9phRNFkgGJ@cluster0.3ohoovb.mongodb.net/hrms?retryWrites=true&w=majority&appName=Cluster0
```

**⚠️ Lưu ý**: 
- Database name `hrms` đã được thêm vào (sau domain, trước `?`)
- Password không có ký tự đặc biệt → không cần URL encoding ✅

---

## 🚀 Bước 1: Test Connection Local (Optional)

Để test connection trước khi deploy:

### Tạo file test:
```javascript
// test-mongodb.js
const mongoose = require('mongoose');

const uri = 'mongodb+srv://khua8986_db_user:MQ2FXE9phRNFkgGJ@cluster0.3ohoovb.mongodb.net/hrms?retryWrites=true&w=majority&appName=Cluster0';

console.log('Testing MongoDB Atlas connection...');

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!');
  console.log('Database:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
  mongoose.connection.close();
})
.catch(err => {
  console.error('❌ MongoDB Connection Failed:');
  console.error('Error:', err.message);
  console.error('\nPossible issues:');
  console.error('1. Check if IP address is whitelisted on MongoDB Atlas');
  console.error('2. Verify username/password are correct');
  console.error('3. Check network connectivity');
});
```

### Run test:
```bash
node test-mongodb.js
```

**Expected Output**:
```
Testing MongoDB Atlas connection...
✅ MongoDB Connected Successfully!
Database: hrms
Host: cluster0.3ohoovb.mongodb.net
```

---

## 🔐 Bước 2: Set Environment Variables trên Vercel

### A. Via Vercel Dashboard:

1. **Login** vào [vercel.com](https://vercel.com)

2. Chọn **Project** của bạn (hoặc tạo mới nếu chưa có)

3. Vào **Settings** → **Environment Variables**

4. **Add Variables** sau:

#### Variable #1: MONGODB_URI
```
Name: MONGODB_URI
Value: mongodb+srv://khua8986_db_user:MQ2FXE9phRNFkgGJ@cluster0.3ohoovb.mongodb.net/hrms?retryWrites=true&w=majority&appName=Cluster0

Environment: 
☑️ Production
☑️ Preview
☑️ Development
```

#### Variable #2: JWT_SECRET
```
Name: JWT_SECRET
Value: [Tạo một secret key mạnh - xem bên dưới]

Environment: 
☑️ Production
☑️ Preview
☑️ Development
```

**Generate JWT_SECRET**:
```bash
# Chạy lệnh này để tạo random secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Hoặc dùng: `your-super-secret-jwt-key-minimum-32-characters-random-string`

#### Variable #3: NODE_ENV
```
Name: NODE_ENV
Value: production

Environment: 
☑️ Production only
```

#### Variable #4: CLIENT_URL (Optional)
```
Name: CLIENT_URL
Value: https://yourapp.vercel.app (thay bằng domain thực tế sau deploy)

Environment: 
☑️ Production
```

5. Click **Save** sau mỗi variable

6. **Redeploy** project để apply changes:
   - Vào **Deployments** tab
   - Click **...** (3 dots) trên deployment mới nhất
   - Click **Redeploy**

---

### B. Via Vercel CLI (Alternative):

```bash
# Install Vercel CLI (nếu chưa có)
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variables
vercel env add MONGODB_URI production
# Paste: mongodb+srv://khua8986_db_user:MQ2FXE9phRNFkgGJ@cluster0.3ohoovb.mongodb.net/hrms?retryWrites=true&w=majority&appName=Cluster0

vercel env add JWT_SECRET production
# Paste: your-super-secret-jwt-key

vercel env add NODE_ENV production
# Type: production

# Deploy
vercel --prod
```

---

## ⚠️ Bước 3: Check MongoDB Atlas Network Access

**CỰC KỲ QUAN TRỌNG**: Đảm bảo Vercel serverless functions có thể kết nối!

1. Vào **MongoDB Atlas Dashboard**
2. **Network Access** (menu bên trái)
3. **Check**: Có entry `0.0.0.0/0` (Allow from anywhere)?

### Nếu CHƯA có:
1. Click **Add IP Address**
2. Chọn **ALLOW ACCESS FROM ANYWHERE**
3. IP Address: `0.0.0.0/0`
4. Comment: `Vercel Serverless Functions`
5. Click **Confirm**

**Tại sao cần `0.0.0.0/0`?**
- Vercel serverless có **dynamic IPs** (thay đổi liên tục)
- Không thể whitelist specific IPs
- MongoDB vẫn yêu cầu username/password (an toàn) ✅

---

## ✅ Bước 4: Verify Deployment

Sau khi deploy và set environment variables:

### Test Health Check:
```bash
curl https://yourapp.vercel.app/api/health
```

**Expected Response**:
```json
{
  "success": true,
  "message": "HR Management System API is running on Vercel",
  "timestamp": "2025-10-08T...",
  "environment": "production",
  "dbStatus": "connected"  ← ⚠️ CHECK THIS!
}
```

**Nếu `dbStatus: "disconnected"`**:
1. Check environment variables đã set đúng chưa
2. Check MongoDB Atlas Network Access đã có `0.0.0.0/0`
3. Check Vercel Function Logs để xem error message

---

## 🔍 Troubleshooting

### Issue 1: Connection Timeout
**Error**: `MongoServerSelectionError: connect ETIMEDOUT`

**Cause**: IP chưa được whitelist

**Fix**: 
1. MongoDB Atlas → Network Access
2. Ensure `0.0.0.0/0` is in the list
3. Wait 2-3 minutes for changes to propagate

---

### Issue 2: Authentication Failed
**Error**: `MongoServerError: bad auth`

**Cause**: Username/password sai hoặc typo trong environment variable

**Fix**:
1. Verify `MONGODB_URI` trong Vercel Dashboard
2. Check không có space thừa
3. Verify password: `MQ2FXE9phRNFkgGJ`

---

### Issue 3: Database Not Found
**Warning**: Kết nối OK nhưng không thấy database

**Normal**: Database `hrms` sẽ được **tự động tạo** khi có data đầu tiên

**Verify**:
1. Register user đầu tiên qua `/api/auth/register`
2. Check MongoDB Atlas → Database → Collections
3. Database `hrms` sẽ xuất hiện

---

## 📊 Database Schema

Sau khi deploy thành công, database sẽ có các collections:

```
hrms/
├── users           (User accounts)
├── departments     (Departments)
└── employeefiles   (Employee file uploads)
```

**Seed Data** (Optional):
Nếu muốn tạo data mẫu, có thể dùng script `backend/seed.js` (chạy local hoặc modify cho production).

---

## 🎯 Next Steps

1. ✅ **Connection String Ready** - Đã có
2. 🔄 **Set Vercel Env Vars** - Cần làm
3. 🔄 **Check Network Access** - Cần verify
4. 🔄 **Deploy & Test** - Sau khi set env vars
5. ✅ **Create First User** - Sau deploy thành công
6. ✅ **Test All Features** - Final verification

---

## 🔐 Security Notes

**✅ Best Practices**:
- ✅ Strong password (letters + numbers)
- ✅ Database user có quyền limited (readWrite only)
- ✅ Connection string trong environment variables (không commit)
- ✅ HTTPS for all connections
- ✅ JWT authentication for API

**⚠️ Important**:
- **NEVER** commit `.env` files với real credentials
- **NEVER** push connection strings vào Git
- **ALWAYS** dùng environment variables trên Vercel

---

## 📞 Support

Nếu gặp vấn đề:

1. **Check Vercel Logs**:
   - Dashboard → Deployments → Click deployment → **Function Logs**
   
2. **Check MongoDB Logs**:
   - Atlas Dashboard → Deployment → Metrics

3. **Common Commands**:
   ```bash
   # Check deployment logs
   vercel logs yourapp.vercel.app
   
   # Check function status
   curl https://yourapp.vercel.app/api/health
   ```

---

## ✅ Checklist

- [x] MongoDB Atlas cluster created
- [x] Database user created (`khua8986_db_user`)
- [x] Connection string ready
- [x] Database name added (`hrms`)
- [ ] Network Access whitelist `0.0.0.0/0` ⚠️ **VERIFY THIS!**
- [ ] Vercel env vars set (`MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`)
- [ ] Project deployed
- [ ] Health check returns `dbStatus: "connected"`
- [ ] First user registered successfully

---

**Status**: ✅ **READY TO DEPLOY**  
**Connection String**: ✅ **VERIFIED**  
**Next Action**: Set environment variables trên Vercel Dashboard

---

*Created: 2025-10-08*  
*Database: hrms*  
*Cluster: cluster0.3ohoovb.mongodb.net*

