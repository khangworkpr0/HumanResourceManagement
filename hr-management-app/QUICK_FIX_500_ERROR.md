# ⚡ QUICK FIX: LỖI 500 INTERNAL SERVER ERROR

## 🚨 Vấn đề
```
POST /api/auth/login 500 (Internal Server Error)
```

**Nguyên nhân:** Backend không kết nối được MongoDB

---

## ✅ GIẢI PHÁP NHANH (5 PHÚT)

### 1️⃣ Tạo MongoDB Atlas (MIỄN PHÍ)

**Link:** https://www.mongodb.com/cloud/atlas/register

1. Đăng ký → Create Cluster
2. Chọn **M0 FREE** → Region: Singapore/Tokyo
3. Wait 3 phút để tạo

### 2️⃣ Tạo User & Whitelist IP

**Database Access:**
- Username: `hruser`
- Password: Click **"Autogenerate"** (lưu lại!)
- Role: Read & Write to any database

**Network Access:**
- Add IP: `0.0.0.0/0` (Allow from anywhere)

### 3️⃣ Lấy Connection String

1. Database → Connect → Connect your application
2. Copy string:
```
mongodb+srv://hruser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

3. **Quan trọng:** 
   - Thay `<password>` → password thật
   - Thêm `/hrdb` sau `.net`:
```
mongodb+srv://hruser:abc123@cluster0.xxxxx.mongodb.net/hrdb?retryWrites=true&w=majority
```

### 4️⃣ Set Environment Variables Trên Vercel

Vào: https://vercel.com → Project → Settings → Environment Variables

**Thêm 4 biến này:**

```env
MONGODB_URI=mongodb+srv://hruser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hrdb?retryWrites=true&w=majority

JWT_SECRET=my-super-secret-jwt-key-32-characters-minimum-length-required

NODE_ENV=production

CLIENT_URL=https://your-app.vercel.app
```

**✅ Check tất cả 3 môi trường:** Production, Preview, Development

### 5️⃣ Redeploy

1. Deployments tab
2. Latest deployment → **"..."** → **Redeploy**
3. Chờ 2 phút

### 6️⃣ Test

```bash
curl https://your-app.vercel.app/api/health
```

**Nếu thấy:**
```json
{
  "success": true,
  "dbStatus": "connected"
}
```

→ **THÀNH CÔNG!** ✅

---

## 🌱 Tạo Dữ Liệu Mẫu (SEED)

### Local Seed (Khuyến nghị):

1. Update `backend/config.env`:
```env
MONGODB_URI=mongodb+srv://hruser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hrdb?retryWrites=true&w=majority
```

2. Run:
```bash
cd hr-management-app/backend
node seed.js
```

### Hoặc Register thủ công:

```bash
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@hr.com",
    "password": "Admin123",
    "role": "admin"
  }'
```

---

## 🎯 Login Credentials (Sau Seed)

**Email:** `admin@hr.com`  
**Password:** `Admin123`

---

## 🐛 Vẫn Lỗi?

### Check 1: Environment Variables
```bash
# Vào Vercel → Settings → Environment Variables
# Đảm bảo MONGODB_URI có:
# - Password đúng (không có <password>)
# - /hrdb sau .mongodb.net
# - Không có space thừa
```

### Check 2: MongoDB Atlas
```bash
# Network Access phải có: 0.0.0.0/0
# Database Access phải có user với password đúng
```

### Check 3: Logs
```bash
# Vercel → Functions → View Logs
# Tìm lỗi MongoDB connection
```

---

## 📚 Chi Tiết Đầy Đủ

Xem file: `SETUP_MONGODB_ATLAS.md`

---

**Thời gian:** 5-10 phút  
**Chi phí:** $0 FREE

✅ Done!

