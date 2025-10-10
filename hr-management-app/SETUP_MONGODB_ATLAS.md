# 🗄️ HƯỚNG DẪN SETUP MONGODB ATLAS CHO VERCEL

## 📋 Bước 1: Tạo MongoDB Atlas Account (MIỄN PHÍ)

1. Truy cập: https://www.mongodb.com/cloud/atlas/register
2. Đăng ký tài khoản (hoặc đăng nhập bằng Google)
3. Click **"Create"** để tạo cluster mới

---

## 🌟 Bước 2: Tạo FREE Cluster

1. Chọn **"M0 Sandbox"** (FREE Forever)
   - Storage: 512 MB (đủ cho demo/testing)
   - RAM: Shared
   - Price: **FREE** ✅

2. Chọn **Provider & Region**:
   - Provider: AWS hoặc Google Cloud
   - Region: Chọn gần Việt Nam nhất (Singapore, Tokyo, Mumbai)

3. **Cluster Name**: Đặt tên (vd: `hr-cluster`)

4. Click **"Create Cluster"** (chờ 3-5 phút để tạo)

---

## 🔐 Bước 3: Tạo Database User

1. Vào tab **"Database Access"** (menu bên trái)
2. Click **"Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `hruser` (hoặc tên bạn thích)
5. **Password**: Click **"Autogenerate Secure Password"** 
   - ⚠️ **LƯU LẠI PASSWORD NÀY!** (copy vào notepad)
6. **Database User Privileges**: 
   - Chọn **"Read and write to any database"**
7. Click **"Add User"**

**Ví dụ:**
```
Username: hruser
Password: abc123XYZ789 (password bạn vừa gen)
```

---

## 🌐 Bước 4: Whitelist IP (CHO PHÉP VERCEL TRUY CẬP)

1. Vào tab **"Network Access"** (menu bên trái)
2. Click **"Add IP Address"**
3. **QUAN TRỌNG**: Click **"ALLOW ACCESS FROM ANYWHERE"**
   - IP Address: `0.0.0.0/0`
   - Reason: Cho phép Vercel serverless functions
4. Click **"Confirm"**

**⚠️ Lưu ý:** 
- Vercel serverless functions không có fixed IP
- Phải whitelist `0.0.0.0/0` để Vercel kết nối được
- Đây là cách duy nhất cho Vercel Free Plan

---

## 🔗 Bước 5: Lấy Connection String

1. Vào tab **"Database"** (menu bên trái)
2. Tìm cluster của bạn → Click nút **"Connect"**
3. Chọn **"Connect your application"**
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. Copy **Connection String**:

```
mongodb+srv://hruser:<password>@hr-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

7. **QUAN TRỌNG**: Thay `<password>` bằng password thật (ở Bước 3)

**Ví dụ Connection String đầy đủ:**
```
mongodb+srv://hruser:abc123XYZ789@hr-cluster.xxxxx.mongodb.net/hrdb?retryWrites=true&w=majority
```

**Lưu ý:**
- Thay `<password>` → password thật của bạn
- Thêm `/hrdb` sau `.net` để chỉ định database name
- Giữ nguyên `?retryWrites=true&w=majority`

---

## ⚙️ Bước 6: Set Environment Variables Trên Vercel

1. Vào https://vercel.com/dashboard
2. Chọn project **hr-management-app** của bạn
3. Vào **Settings** → **Environment Variables**
4. Thêm các biến sau:

### ✅ Environment Variables Cần Set:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://hruser:abc123XYZ789@hr-cluster.xxxxx.mongodb.net/hrdb?retryWrites=true&w=majority` | Production, Preview, Development |
| `JWT_SECRET` | `your-super-secret-jwt-key-minimum-32-characters-long` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `CLIENT_URL` | `https://your-app.vercel.app` (URL của app) | Production |

**Cách thêm:**
1. Click **"Add New"**
2. **Key**: `MONGODB_URI`
3. **Value**: Paste connection string đầy đủ
4. **Environment**: Check tất cả (Production, Preview, Development)
5. Click **"Save"**
6. Lặp lại cho các biến còn lại

**⚠️ LƯU Ý QUAN TRỌNG:**
- `MONGODB_URI`: Phải có password thật (không có `<password>`)
- `MONGODB_URI`: Phải có `/hrdb` để chỉ định database name
- `JWT_SECRET`: Tối thiểu 32 ký tự, random string
- `CLIENT_URL`: Thay bằng URL thật của app Vercel

**Ví dụ JWT_SECRET:**
```
JWT_SECRET=my-super-secret-hr-app-key-2024-production-use-only-xyz123
```

---

## 🔄 Bước 7: Redeploy Vercel

Sau khi set environment variables:

1. Vào **Deployments** tab
2. Tìm deployment mới nhất
3. Click **"..."** (3 dots) → **"Redeploy"**
4. Click **"Redeploy"** để xác nhận
5. Chờ 2-3 phút để Vercel build lại

---

## 🌱 Bước 8: Seed Database (TẠO DỮ LIỆU MẪU)

Sau khi deploy xong, database vẫn còn trống. Bạn cần seed data.

### **Option 1: Seed qua Script Local**

1. Cập nhật `backend/config.env` với MongoDB URI:
```env
MONGODB_URI=mongodb+srv://hruser:abc123XYZ789@hr-cluster.xxxxx.mongodb.net/hrdb?retryWrites=true&w=majority
JWT_SECRET=my-secret-key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

2. Chạy seed script:
```bash
cd hr-management-app/backend
node seed.js
```

3. Nếu thành công, bạn sẽ thấy:
```
✅ Connected to MongoDB successfully
✅ 10 employees seeded
✅ 5 candidates seeded
✅ 3 users seeded
✅ 5 onboarding tasks seeded

🔑 Login credentials:
   Admin: admin@hr.com / Admin123
   Employee: john.smith@company.com / Employee123
```

### **Option 2: Seed qua MongoDB Compass (GUI)**

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Mở Compass → Connect với connection string của bạn
3. Tạo database `hrdb`
4. Import data từ file JSON (nếu có)

### **Option 3: Tạo Admin User Thủ Công**

Nếu không seed được, tạo admin bằng API:

1. Test API health:
```bash
curl https://your-app.vercel.app/api/health
```

2. Register admin user:
```bash
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HR Admin",
    "email": "admin@hr.com",
    "password": "Admin123",
    "role": "admin"
  }'
```

---

## ✅ Bước 9: Test Kết Nối

### Test 1: API Health Check
```bash
curl https://your-app.vercel.app/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "HR Management System API is running on Vercel",
  "dbStatus": "connected"
}
```

### Test 2: Login
Truy cập: `https://your-app.vercel.app/login`

**Credentials:**
- Email: `admin@hr.com`
- Password: `Admin123`

Nếu login thành công → **HOÀN TẤT!** ✅

---

## 🐛 Troubleshooting

### ❌ Lỗi: "MongoServerError: bad auth"
**Nguyên nhân:** Password sai hoặc user chưa được tạo

**Giải pháp:**
1. Kiểm tra password trong connection string
2. Vào MongoDB Atlas → Database Access → Reset password
3. Update `MONGODB_URI` trên Vercel với password mới
4. Redeploy

### ❌ Lỗi: "MongoServerError: IP address is not whitelisted"
**Nguyên nhân:** Chưa whitelist IP `0.0.0.0/0`

**Giải pháp:**
1. Vào MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0`
3. Chờ 2-3 phút để apply
4. Test lại

### ❌ Lỗi: "connection timed out"
**Nguyên nhân:** Network issues hoặc cluster đang starting

**Giải pháp:**
1. Kiểm tra cluster status trên MongoDB Atlas (phải là "Active")
2. Đợi vài phút nếu cluster mới tạo
3. Test connection string bằng MongoDB Compass local

### ❌ Lỗi: 500 Internal Server Error
**Nguyên nhân:** Environment variables chưa set hoặc sai

**Giải pháp:**
1. Check logs: Vercel Dashboard → Functions → View Logs
2. Kiểm tra tất cả env vars đã set đúng
3. Đảm bảo `MONGODB_URI` có format đúng
4. Redeploy sau khi fix

---

## 📊 Connection String Format

**Template:**
```
mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/<DATABASE>?retryWrites=true&w=majority
```

**Ví dụ đầy đủ:**
```
mongodb+srv://hruser:MyP@ssw0rd123@hr-cluster.abc123.mongodb.net/hrdb?retryWrites=true&w=majority
```

**Breakdown:**
- `hruser`: Username tạo ở Bước 3
- `MyP@ssw0rd123`: Password (phải encode nếu có ký tự đặc biệt)
- `hr-cluster.abc123`: Cluster name + unique ID
- `hrdb`: Database name (collection sẽ tự tạo)
- `?retryWrites=true&w=majority`: Options (giữ nguyên)

**⚠️ Lưu ý về Special Characters trong Password:**

Nếu password có ký tự đặc biệt như `@`, `#`, `$`, `/`, etc., cần encode:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `/` | `%2F` |
| `:` | `%3A` |

**Ví dụ:**
- Password: `P@ss/123` 
- Encoded: `P%40ss%2F123`

---

## 📝 Checklist

- [ ] Tạo MongoDB Atlas account (FREE)
- [ ] Tạo cluster (M0 Sandbox - FREE)
- [ ] Tạo database user với password
- [ ] Whitelist IP `0.0.0.0/0` trong Network Access
- [ ] Copy connection string (thay password thật)
- [ ] Set `MONGODB_URI` trên Vercel
- [ ] Set `JWT_SECRET` trên Vercel
- [ ] Set `NODE_ENV=production` trên Vercel
- [ ] Set `CLIENT_URL` trên Vercel
- [ ] Redeploy Vercel
- [ ] Test API health check
- [ ] Seed database (chạy seed script)
- [ ] Test login với admin@hr.com / Admin123

---

## 🎉 Kết Quả

Sau khi hoàn thành:
- ✅ MongoDB Atlas đang chạy (FREE)
- ✅ Vercel kết nối được MongoDB
- ✅ Database có dữ liệu mẫu
- ✅ Login thành công
- ✅ App hoạt động hoàn hảo!

---

**Thời gian setup:** ~10-15 phút  
**Chi phí:** $0 (100% FREE)

---

*Tạo bởi: HR Management System*  
*Ngày: October 10, 2025*

