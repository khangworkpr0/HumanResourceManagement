# ✅ Deployment Checklist

## Trước Khi Deploy

### 1. Files Đã Tạo
- [x] `vercel.json` - Cấu hình routing và build
- [x] `api/index.js` - Serverless function wrapper
- [x] `api/package.json` - Dependencies cho API
- [x] `.vercelignore` - Loại trừ files không cần thiết
- [x] `VERCEL_DEPLOYMENT_GUIDE.md` - Hướng dẫn chi tiết

### 2. Frontend Config
- [ ] Check `frontend/package.json` có script `"build": "react-scripts build"`
- [ ] Check `frontend/src/utils/axios.js` dùng baseURL phù hợp:
  ```javascript
  baseURL: process.env.REACT_APP_API_URL || 
           (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api')
  ```
- [ ] Test build local: `cd frontend && npm run build` ✅

### 3. Backend Config
- [ ] Check tất cả routes trong `backend/routes/` export đúng: `module.exports = router`
- [ ] Check models trong `backend/models/` dùng `mongoose.Schema`
- [ ] Check controllers không hard-code ports hoặc URLs

### 4. Database Setup
- [ ] MongoDB Atlas account đã tạo
- [ ] Database cluster đã tạo
- [ ] Database user với quyền đọc/ghi đã tạo
- [ ] **Network Access**: Whitelist IP `0.0.0.0/0` (Allow from anywhere)
- [ ] Connection string đã copy: `mongodb+srv://...`

### 5. Git Repository
- [ ] Code đã commit và push lên GitHub/GitLab/Bitbucket
- [ ] Branch main/master đã update

---

## Deploy Lên Vercel

### 1. Tạo Project
- [ ] Truy cập [vercel.com](https://vercel.com)
- [ ] Login và click "Add New Project"
- [ ] Import repository của bạn

### 2. Configure Project
- [ ] **Root Directory**: Set thành `hr-management-app` ⚠️ (Quan trọng!)
- [ ] **Framework Preset**: Chọn "Other" (không chọn Create React App)
- [ ] **Build Command**: Để trống (Vercel sẽ tự detect từ `vercel.json`)
- [ ] **Output Directory**: Để trống
- [ ] **Install Command**: Để trống

### 3. Set Environment Variables
Vào **Settings** → **Environment Variables**, thêm:

| Variable | Value | Scope |
|----------|-------|-------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/hrms?retryWrites=true&w=majority` | Production, Preview, Development |
| `JWT_SECRET` | `your-super-secret-jwt-key-min-32-chars` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `CLIENT_URL` | `https://yourapp.vercel.app` | Production |

**⚠️ Lưu ý**: 
- Thay `username`, `password`, `cluster`, `hrms` bằng thông tin thực tế
- JWT_SECRET nên >= 32 ký tự, random, bảo mật

### 4. Deploy
- [ ] Click "Deploy"
- [ ] Đợi build & deploy (khoảng 2-3 phút)

---

## Sau Khi Deploy

### 1. Test Health Check
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

### 2. Test Frontend Routes (React Router)
Truy cập trực tiếp các URL (không được bị 404):
- [ ] `https://yourapp.vercel.app/` ✅
- [ ] `https://yourapp.vercel.app/login` ✅
- [ ] `https://yourapp.vercel.app/register` ✅
- [ ] `https://yourapp.vercel.app/dashboard` ✅
- [ ] `https://yourapp.vercel.app/employees` ✅
- [ ] `https://yourapp.vercel.app/profile` ✅

**Nếu bị 404**: Kiểm tra lại `vercel.json` routing config.

### 3. Test API Endpoints
```bash
# Test Register
curl -X POST https://yourapp.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!","name":"Test User","role":"employee"}'

# Test Login
curl -X POST https://yourapp.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'

# Copy JWT token từ response, sau đó test:
curl https://yourapp.vercel.app/api/employees \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 4. Check Logs
- [ ] Vào Vercel Dashboard → Project → Deployments
- [ ] Click vào deployment mới nhất
- [ ] Check "Build Logs" - không có errors
- [ ] Check "Function Logs" - không có runtime errors

---

## Troubleshooting

### ❌ Build Failed

**Check**:
1. Build logs trong Vercel
2. Root Directory có đúng `hr-management-app` không?
3. `frontend/package.json` có script build không?

**Fix**:
```bash
# Test local
cd hr-management-app/frontend
npm install
npm run build
```

### ❌ API 404 Not Found

**Check**:
1. `api/index.js` có export app không? → `module.exports = app`
2. Routes có import đúng không?
3. `vercel.json` có route `/api/*` đến `api/index.js` không?

**Fix**: Xem file logs trong Vercel Function Logs

### ❌ Database Connection Error

**Check**:
1. MONGODB_URI có đúng format không?
2. MongoDB Atlas Network Access đã whitelist `0.0.0.0/0` chưa?
3. Database user có quyền đọc/ghi không?

**Fix**:
1. Test connection string local
2. Redeploy sau khi fix env vars

### ❌ React Router 404

**Check**:
1. `vercel.json` routing có `"src": "/(.*)", "dest": "/frontend/build/index.html"` không?
2. Route này có nằm **cuối cùng** trong mảng `routes` không?

**Fix**: Update `vercel.json` và redeploy

---

## Monitoring

### Vercel Dashboard
- **Analytics**: Xem traffic, performance
- **Logs**: Check errors real-time
- **Deployments**: History của các lần deploy

### MongoDB Atlas
- **Metrics**: Database performance
- **Network**: Số connection
- **Alerts**: Setup alerts khi có vấn đề

---

## Next Steps

- [ ] Setup custom domain (nếu có)
- [ ] Setup CDN cho file uploads (Cloudinary, AWS S3)
- [ ] Setup monitoring (Sentry, LogRocket)
- [ ] Setup backup database
- [ ] Optimize images (Next.js Image hoặc ImageKit)

---

## Support

Nếu gặp vấn đề:
1. Check `VERCEL_DEPLOYMENT_GUIDE.md` → Troubleshooting section
2. Check Vercel logs
3. Check MongoDB Atlas metrics
4. Test API endpoints với Postman/curl

---

**🎉 Chúc mừng! Bạn đã deploy thành công!**

Domain của bạn: `https://yourapp.vercel.app`

