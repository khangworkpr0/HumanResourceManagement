# ⚡ Quick Start - Deploy Lên Vercel trong 5 Phút

## 🚀 TL;DR - Các Bước Nhanh

1. ✅ **Test Build Local**
   ```bash
   cd hr-management-app
   ./test-vercel-local.bat    # Windows
   # hoặc
   ./test-vercel-local.sh     # Mac/Linux
   ```

2. ✅ **Chuẩn Bị MongoDB**
   - Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Tạo cluster (Free tier)
   - Tạo database user
   - **Network Access**: Whitelist `0.0.0.0/0`
   - Copy Connection String

3. ✅ **Push Code**
   ```bash
   git add .
   git commit -m "Add Vercel deployment config"
   git push origin main
   ```

4. ✅ **Deploy Trên Vercel**
   - Truy cập [vercel.com](https://vercel.com)
   - Login → **"Add New Project"**
   - Import repository
   - **Root Directory**: `hr-management-app` ⚠️
   - **Framework**: Other
   - Click **"Deploy"**

5. ✅ **Set Environment Variables**
   - Project Settings → Environment Variables
   - Thêm:
     - `MONGODB_URI` = `mongodb+srv://...`
     - `JWT_SECRET` = `your-secret-key-min-32-chars`
     - `NODE_ENV` = `production`
   - Click **"Redeploy"**

6. ✅ **Test**
   ```bash
   curl https://yourapp.vercel.app/api/health
   ```

---

## 📋 Các File Đã Tạo

| File | Mô Tả |
|------|-------|
| `vercel.json` | Cấu hình chính (builds + routes) |
| `api/index.js` | Serverless function wrapper cho backend |
| `api/package.json` | Dependencies cho API |
| `.vercelignore` | Loại trừ files không cần thiết |
| `VERCEL_DEPLOYMENT_GUIDE.md` | Hướng dẫn chi tiết + troubleshooting |
| `VERCEL_CONFIG_EXPLAINED.md` | Giải thích từng dòng `vercel.json` |
| `DEPLOYMENT_CHECKLIST.md` | Checklist đầy đủ |
| `test-vercel-local.bat/.sh` | Script test build local |

---

## 🔑 Environment Variables Cần Thiết

```env
# MongoDB (Bắt buộc)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms?retryWrites=true&w=majority

# JWT Secret (Bắt buộc)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-random-string

# Node Environment
NODE_ENV=production

# Client URL (Optional - auto-detect)
CLIENT_URL=https://yourapp.vercel.app
```

---

## ✅ Test Sau Deploy

### 1. Health Check
```bash
curl https://yourapp.vercel.app/api/health
```

Kết quả mong đợi:
```json
{
  "success": true,
  "message": "HR Management System API is running on Vercel",
  "dbStatus": "connected"
}
```

### 2. React Router (Không Bị 404)
- ✅ `https://yourapp.vercel.app/`
- ✅ `https://yourapp.vercel.app/login`
- ✅ `https://yourapp.vercel.app/dashboard`
- ✅ `https://yourapp.vercel.app/employees`

### 3. API Endpoints
```bash
# Register
curl -X POST https://yourapp.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!","name":"Test User"}'

# Login
curl -X POST https://yourapp.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'
```

---

## 🐛 Troubleshooting Nhanh

### ❌ Build Failed
→ Check: Root Directory đã set `hr-management-app` chưa?

### ❌ API 404
→ Check: `api/index.js` có export `module.exports = app` không?

### ❌ Database Connection Error
→ Check: MongoDB Atlas Network Access đã whitelist `0.0.0.0/0` chưa?

### ❌ React Router 404
→ Check: Route `"src": "/(.*)", "dest": "/frontend/build/index.html"` có trong `vercel.json` không?

**Chi tiết troubleshooting**: Xem `VERCEL_DEPLOYMENT_GUIDE.md`

---

## 📚 Đọc Thêm

- **Hướng dẫn đầy đủ**: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
- **Giải thích config**: [VERCEL_CONFIG_EXPLAINED.md](./VERCEL_CONFIG_EXPLAINED.md)
- **Checklist chi tiết**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 🎉 Hoàn Thành!

Sau khi deploy xong:
- ✅ Frontend: `https://yourapp.vercel.app`
- ✅ API: `https://yourapp.vercel.app/api/*`
- ✅ Auto-deploy khi push code
- ✅ SSL/HTTPS miễn phí
- ✅ Global CDN

**Enjoy your deployed app! 🚀**

---

*Nếu gặp vấn đề, check logs trên Vercel Dashboard → Deployments → View Logs*

