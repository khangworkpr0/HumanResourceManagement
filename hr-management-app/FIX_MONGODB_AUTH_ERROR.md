# 🔐 FIX: MongoDB Authentication Failed Error

## ❌ Lỗi hiện tại:
```json
{
  "success": false,
  "message": "Service initialization failed",
  "error": "bad auth : authentication failed"
}
```

## 🎯 Nguyên nhân

Lỗi này xảy ra khi:
1. ❌ Username/Password trong `MONGODB_URI` **SAI**
2. ❌ `MONGODB_URI` không được set trên Vercel
3. ❌ Database user không có quyền truy cập
4. ❌ Password chứa ký tự đặc biệt chưa được encode

---

## ✅ CÁCH SỬA - TỪNG BƯỚC

### **Bước 1: Kiểm tra MONGODB_URI local**

Mở file `backend/config.env` và kiểm tra:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/humandb?retryWrites=true&w=majority
```

**Chú ý:**
- ✅ Phải bắt đầu bằng `mongodb+srv://`
- ✅ Format: `mongodb+srv://USERNAME:PASSWORD@CLUSTER/DATABASE`
- ✅ Không có khoảng trắng
- ✅ Database name (thường là `humandb` hoặc `test`)

### **Bước 2: Test local trước**

```bash
cd hr-management-app
node test-mongodb-connection.js
```

**Nếu local OK → Vấn đề ở Vercel Environment Variables**  
**Nếu local FAIL → Vấn đề ở MongoDB credentials**

---

## 🔑 OPTION A: Fix MongoDB Credentials (Nếu local test FAIL)

### **1. Tạo Database User mới trên MongoDB Atlas**

1. Đăng nhập: **https://cloud.mongodb.com/**
2. Chọn cluster của bạn
3. Click **"Database Access"** (thanh bên trái)
4. Click **"+ ADD NEW DATABASE USER"**

5. **Điền thông tin:**
   ```
   Authentication Method: Password
   Username: hrapp_user
   Password: <Click "Autogenerate Secure Password">
   ```

6. **Database User Privileges:**
   - Chọn: **"Built-in Role"**
   - Chọn: **"Read and write to any database"**
   - Hoặc chỉ định database: `humandb`

7. Click **"Add User"**

8. **Copy password ngay** (không thể xem lại!)

### **2. Cập nhật MONGODB_URI**

#### **A. Nếu password có ký tự đặc biệt, phải URL encode:**

| Ký tự | Encode thành |
|-------|--------------|
| `@`   | `%40`       |
| `:`   | `%3A`       |
| `/`   | `%2F`       |
| `?`   | `%3F`       |
| `#`   | `%23`       |
| `&`   | `%26`       |
| `=`   | `%3D`       |

**Ví dụ:**
- Password gốc: `P@ssw0rd!123`
- Password encoded: `P%40ssw0rd!123`

#### **B. Format đúng:**

```
mongodb+srv://hrapp_user:YOUR_ENCODED_PASSWORD@cluster0.xxxxx.mongodb.net/humandb?retryWrites=true&w=majority
```

**Thay thế:**
- `hrapp_user` → Username vừa tạo
- `YOUR_ENCODED_PASSWORD` → Password đã encode
- `cluster0.xxxxx.mongodb.net` → Cluster của bạn
- `humandb` → Database name

### **3. Update file `backend/config.env`**

```env
MONGODB_URI=mongodb+srv://hrapp_user:YOUR_ENCODED_PASSWORD@cluster0.xxxxx.mongodb.net/humandb?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here_at_least_32_characters_long
NODE_ENV=development
```

### **4. Test local lại**

```bash
node test-mongodb-connection.js
```

**Phải thấy:**
```
✅ MONGODB_URI found: mongodb+srv://hrapp_user:****@...
✅ Connected in XXXms
✅ 🎉 ALL TESTS PASSED!
```

---

## 🌐 OPTION B: Fix Vercel Environment Variables (Nếu local test OK)

Nếu local test OK nhưng Vercel vẫn lỗi → Environment variables trên Vercel sai hoặc chưa set.

### **1. Kiểm tra Vercel Environment Variables**

1. Vào: **https://vercel.com/dashboard**
2. Chọn project **HR Management**
3. Click **"Settings"** (thanh trên)
4. Click **"Environment Variables"** (thanh bên trái)

### **2. Xóa và tạo lại MONGODB_URI**

**Xóa biến cũ:**
1. Tìm `MONGODB_URI`
2. Click **"..."** → **"Remove"**

**Tạo biến mới:**
1. Click **"Add New"**
2. **Name:** `MONGODB_URI`
3. **Value:** Copy **CHÍNH XÁC** từ file `backend/config.env` local
   ```
   mongodb+srv://hrapp_user:YOUR_PASSWORD@cluster.mongodb.net/humandb?retryWrites=true&w=majority
   ```
4. **Environment:** Tick cả 3:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **"Save"**

### **3. Kiểm tra các biến khác**

Đảm bảo có đủ:

| Variable | Value | Required |
|----------|-------|----------|
| `MONGODB_URI` | mongodb+srv://... | ✅ YES |
| `JWT_SECRET` | (32+ characters) | ✅ YES |
| `NODE_ENV` | production | ⚠️ Optional |

### **4. Redeploy Vercel**

**Environment variables chỉ apply cho deployment mới!**

1. Click **"Deployments"** (thanh trên)
2. Latest deployment → **"..."** → **"Redeploy"**
3. ⚠️ **KHÔNG CẦN** bỏ tick "Use existing Build Cache" (chỉ cần redeploy)
4. Click **"Redeploy"**

---

## 🔍 DEBUG - Kiểm tra chi tiết

### **Check 1: Xem Vercel Logs**

```bash
vercel logs --prod
```

Hoặc từ Dashboard → Deployments → Click deployment → View Function Logs

**Tìm dòng:**
```
🔌 Connecting to MongoDB: mongodb+srv://USERNAME:****@...
```

**Kiểm tra:**
- ✅ Username có đúng?
- ✅ Cluster address có đúng?
- ✅ Database name có đúng?

### **Check 2: Test endpoint**

```bash
curl https://your-app.vercel.app/api/health
```

Xem response:
```json
{
  "envCheck": {
    "mongodbUri": true,          // ← Phải là true
    "jwtSecret": true,            // ← Phải là true
    "mongodbUriFormat": "valid"   // ← Phải là "valid"
  }
}
```

**Nếu `mongodbUri: false`** → Vercel không nhận được env var!

---

## 🛠️ Troubleshooting Checklist

### **MongoDB Atlas:**
- [ ] Database user đã được tạo?
- [ ] User có quyền "Read and Write"?
- [ ] Password không có ký tự đặc biệt chưa encode?
- [ ] IP Whitelist có `0.0.0.0/0`?
- [ ] Cluster đang active (không paused)?

### **Local:**
- [ ] `backend/config.env` có MONGODB_URI?
- [ ] `node test-mongodb-connection.js` pass?
- [ ] Format URI đúng?

### **Vercel:**
- [ ] Environment Variables có MONGODB_URI?
- [ ] Value copy chính xác từ local?
- [ ] Applied to "Production"?
- [ ] Đã redeploy sau khi set env vars?
- [ ] Logs không có lỗi?

---

## 📋 QUICK FIX SCRIPT

### **1. Get connection string từ MongoDB Atlas:**

1. MongoDB Atlas → Clusters → **"Connect"**
2. **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy connection string:
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
5. Thay `<password>` bằng password thật
6. Thêm database name: `/humandb` trước dấu `?`
   ```
   mongodb+srv://username:realpassword@cluster.mongodb.net/humandb?retryWrites=true&w=majority
   ```

### **2. Update local config:**

```bash
# Edit backend/config.env
notepad backend\config.env
```

Paste URI vừa tạo:
```env
MONGODB_URI=mongodb+srv://...
```

### **3. Test local:**

```bash
node test-mongodb-connection.js
```

### **4. Copy to Vercel:**

```bash
# Show your URI (for copying)
type backend\config.env | findstr MONGODB_URI
```

Copy giá trị và paste vào Vercel Dashboard.

### **5. Redeploy:**

```bash
vercel --prod
```

---

## ✅ Sau khi fix xong

### **Test 1: Health check**
```bash
curl https://your-app.vercel.app/api/health
```

Expect:
```json
{
  "success": true,
  "dbStatus": "connected"  // ← MUST be "connected"
}
```

### **Test 2: Database test**
```bash
curl https://your-app.vercel.app/api/test-db
```

Expect:
```json
{
  "success": true,
  "message": "Database connection and query successful",
  "userCount": 5
}
```

---

## 🆘 Nếu vẫn lỗi

Gửi cho developer:

1. **Local test result:**
   ```bash
   node test-mongodb-connection.js > local-test.txt 2>&1
   ```

2. **Health check response:**
   ```bash
   curl https://your-app.vercel.app/api/health > health.json
   ```

3. **Vercel logs:**
   ```bash
   vercel logs --prod > vercel-logs.txt
   ```

4. **Environment variables:**
   - Screenshot từ Vercel Dashboard → Settings → Environment Variables
   - Che password!

---

**Fix date:** 2024-10-20  
**Error:** bad auth : authentication failed  
**Solution:** Check MongoDB credentials & Vercel env vars

