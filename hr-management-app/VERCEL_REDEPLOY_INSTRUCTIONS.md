# 🚀 Hướng dẫn Redeploy Vercel - Fix lỗi "bufferMaxEntries"

## ❌ Lỗi gặp phải:
```
{
  success: false,
  message: "Service initialization failed",
  error: "option buffermaxentries is not supported"
}
```

## ✅ Đã sửa:

### 1. **Xóa option cũ không còn hỗ trợ**
- ❌ Đã xóa `bufferMaxEntries: 0` khỏi tất cả file
- ✅ Sử dụng `mongoose.set('bufferCommands', false)` (cách hiện đại)

### 2. **Update Mongoose version**
- ❌ API đang dùng Mongoose `7.6.0` (cũ)
- ✅ Đã update lên Mongoose `8.0.3` (đồng bộ với backend)

### 3. **Files đã sửa:**
- ✅ `api/package.json` - Update mongoose version
- ✅ `test-mongodb-connection.js` - Xóa bufferMaxEntries
- ✅ `TEST_INSTRUCTIONS.md` - Update documentation

---

## 📋 Các bước Deploy lại lên Vercel

### **Bước 1: Commit & Push code mới**

```bash
# Kiểm tra thay đổi
git status

# Add các file đã sửa
git add hr-management-app/api/package.json
git add hr-management-app/test-mongodb-connection.js
git add hr-management-app/TEST_INSTRUCTIONS.md

# Commit
git commit -m "fix: Update Mongoose to 8.0.3 and remove unsupported bufferMaxEntries option"

# Push lên GitHub
git push origin main
```

### **Bước 2: Xóa cache và Redeploy trên Vercel**

#### **Option A: Từ Vercel Dashboard** (Khuyến nghị)

1. Vào https://vercel.com/dashboard
2. Chọn project HR Management
3. Click tab **"Deployments"**
4. Tìm deployment mới nhất → Click **"..."** → Chọn **"Redeploy"**
5. ✅ **QUAN TRỌNG:** Tick vào **"Use existing Build Cache"** → **BỎ TICK** (để rebuild from scratch)
6. Click **"Redeploy"** để bắt đầu

#### **Option B: Force redeploy từ CLI**

```bash
cd hr-management-app

# Login Vercel (nếu chưa)
vercel login

# Link project (nếu chưa)
vercel link

# Deploy với force rebuild
vercel --prod --force
```

### **Bước 3: Kiểm tra Environment Variables**

Đảm bảo các biến môi trường đã được set đúng:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/humandb?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
```

**Kiểm tra:**
1. Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Đảm bảo áp dụng cho **Production**
3. MONGODB_URI phải bắt đầu bằng `mongodb+srv://`

---

## ✅ Kiểm tra sau khi Deploy

### 1. **Health Check**
```bash
curl https://your-app.vercel.app/api/health
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "API is running",
  "version": "2.0.0 - Fixed connection flow",
  "dbStatus": "connected",
  "dbReadyState": 1,
  "initialized": true
}
```

### 2. **Test Database Connection**
```bash
curl https://your-app.vercel.app/api/test-db
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "Database connection and query successful",
  "dbHost": "cluster.mongodb.net",
  "dbName": "humandb",
  "dbReadyState": 1,
  "userCount": 5
}
```

### 3. **Xem Logs**
```bash
vercel logs --prod
```

**Tìm các dòng:**
- ✅ `🚀 Initializing application...`
- ✅ `🔌 Connecting to MongoDB: mongodb+srv://...`
- ✅ `✅ MongoDB Connected Successfully`
- ✅ `✅ All routes loaded successfully`

**KHÔNG được thấy:**
- ❌ `option buffermaxentries is not supported`
- ❌ `buffering timed out`

---

## 🔍 Troubleshooting

### Lỗi vẫn còn sau khi redeploy?

#### **1. Clear build cache hoàn toàn**
```bash
# Xóa .vercel folder local
rm -rf .vercel

# Deploy lại từ đầu
vercel --prod
```

#### **2. Kiểm tra node_modules**
Vercel có thể cache node_modules. Để force reinstall:

```bash
# Tạo empty commit để trigger rebuild
git commit --allow-empty -m "Force Vercel rebuild"
git push origin main
```

Rồi redeploy với **"Use existing Build Cache"** = **OFF**

#### **3. Kiểm tra Mongoose version được install**

Xem build logs trong Vercel:
```
Installing dependencies...
+ mongoose@8.0.3    ← Phải là version này
```

#### **4. MongoDB Atlas connectivity**

Đảm bảo:
- ✅ IP Whitelist có `0.0.0.0/0`
- ✅ Database user có quyền read/write
- ✅ Cluster đang active (không paused)

---

## 📊 So sánh Version

| Component | Trước | Sau | Status |
|-----------|-------|-----|--------|
| **api/mongoose** | 7.6.0 | 8.0.3 | ✅ Fixed |
| **backend/mongoose** | 8.0.3 | 8.0.3 | ✅ OK |
| **bufferMaxEntries** | Có (lỗi) | Đã xóa | ✅ Fixed |
| **bufferCommands** | false | false | ✅ OK |

---

## 🎯 Checklist Deploy

- [ ] Đã commit code mới
- [ ] Đã push lên GitHub
- [ ] Đã trigger redeploy trên Vercel
- [ ] Đã **TẮT** "Use existing Build Cache"
- [ ] Kiểm tra build logs - không có lỗi
- [ ] Test `/api/health` - return success
- [ ] Test `/api/test-db` - return success
- [ ] Xem logs - không có lỗi "buffermaxentries"

---

## 🆘 Nếu vẫn lỗi

Gửi cho developer:

1. **Build logs từ Vercel:**
   - Dashboard → Deployments → Click vào deployment → View Build Logs

2. **Runtime logs:**
   ```bash
   vercel logs --prod > vercel-logs.txt
   ```

3. **Health check response:**
   ```bash
   curl https://your-app.vercel.app/api/health > health.json
   ```

4. **Mongoose version installed:**
   - Từ build logs, tìm dòng `+ mongoose@x.x.x`

---

**Ngày cập nhật:** 2024-10-20  
**Fix version:** 2.1.0  
**Mongoose version:** 8.0.3

