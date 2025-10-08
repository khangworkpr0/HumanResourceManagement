# 🚀 Hướng Dẫn Deploy HR Management System Lên Vercel

## 📋 Tổng Quan

Hướng dẫn này giúp bạn deploy cả **Frontend (React)** và **Backend (Node.js Express)** trong **một dự án Vercel duy nhất** trên cùng một domain.

### Cấu Trúc Dự Án
```
hr-management-app/
├── frontend/           # React app
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Express API
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server.js
├── api/
│   └── index.js       # Vercel serverless function wrapper
└── vercel.json        # Cấu hình Vercel
```

---

## 📝 Cấu Hình File

### 1️⃣ `vercel.json` - Cấu Hình Chính

File này đã được tạo ở thư mục `hr-management-app/vercel.json` với các phần:

#### **Builds** 
- **Frontend**: Sử dụng `@vercel/static-build` để build React app
  - Input: `frontend/package.json`
  - Output: `frontend/build/` (thư mục build của React)
  
- **Backend**: Sử dụng `@vercel/node` để chạy serverless function
  - Input: `api/index.js`

#### **Routes** (Thứ tự quan trọng!)
```json
1. /api/* → Backend API
2. /uploads/* → Static files (backend uploads)
3. /static/* → React static assets
4. /*.{js,css,json,ico,png,...} → React build files
5. /* → React index.html (Fix 404 cho React Router!)
```

**⚠️ Lưu ý**: Route cuối cùng (`/*` → `index.html`) là **cực kỳ quan trọng** để fix lỗi 404 khi truy cập `/dashboard`, `/employees`, etc. Nó đảm bảo mọi route không match ở trên đều trả về `index.html` cho React Router xử lý.

---

### 2️⃣ `api/index.js` - Serverless Function Wrapper

File này đã được tạo để:
- Wrap Express app thành serverless function
- Quản lý MongoDB connection với caching (tối ưu cho serverless)
- Import và sử dụng lại các routes từ `backend/`
- Export `module.exports = app` (bắt buộc cho Vercel)

**Tính năng chính**:
- ✅ Connection pooling (tái sử dụng kết nối DB)
- ✅ Error handling toàn cục
- ✅ CORS đã cấu hình
- ✅ Health check endpoint: `/api/health`

---

### 3️⃣ `frontend/package.json` - Đã Đúng ✅

Script build hiện tại:
```json
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

✅ **Đúng rồi!** Script này sẽ tạo thư mục `build/` khi Vercel chạy build.

---

## 🔧 Các Bước Deploy

### **Bước 1: Kiểm Tra Trước Khi Deploy**

#### A. Kiểm tra frontend build được local
```bash
cd hr-management-app/frontend
npm install
npm run build
```

Đảm bảo thư mục `build/` được tạo ra.

#### B. Kiểm tra cấu hình API base URL trong frontend

Mở file `frontend/src/utils/axios.js` và đảm bảo:
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  // Trong production trên Vercel, sẽ tự động dùng '/api'
});
```

Nếu chưa có, tạo file `.env.production` trong `frontend/`:
```
REACT_APP_API_URL=/api
```

---

### **Bước 2: Push Code Lên Git**

```bash
# Ở thư mục gốc (HumanResourceManagement)
cd hr-management-app

git add vercel.json api/index.js VERCEL_DEPLOYMENT_GUIDE.md
git commit -m "Add Vercel deployment configuration"
git push origin features/update-filed
```

---

### **Bước 3: Deploy Lên Vercel**

#### **Option 1: Deploy Qua Vercel Dashboard (Khuyến Nghị)** 🌟

1. Truy cập [vercel.com](https://vercel.com) và đăng nhập
2. Click **"Add New Project"**
3. Import repository của bạn
4. **Quan trọng**: Set **Root Directory** = `hr-management-app`
   
   Không phải root repository! Phải là folder `hr-management-app`.

5. **Framework Preset**: Để **Other** (không chọn Create React App)
6. **Build Settings**:
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `npm install` (sẽ install dependencies cho api/)

7. Click **"Deploy"**

#### **Option 2: Deploy Qua Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (ở thư mục hr-management-app)
cd hr-management-app
vercel --prod
```

Vercel CLI sẽ tự động detect `vercel.json` và deploy.

---

### **Bước 4: Set Environment Variables** ⚙️

Sau khi project được tạo trên Vercel:

1. Vào **Project Settings** → **Environment Variables**
2. Thêm các biến sau:

| Key | Value | Environment |
|-----|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/hrms?retryWrites=true&w=majority` | Production, Preview, Development |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `CLIENT_URL` | `https://yourapp.vercel.app` | Production |

**⚠️ Lưu ý về MONGODB_URI**:
- Nếu dùng MongoDB Atlas, đảm bảo:
  - Whitelist IP `0.0.0.0/0` (cho phép mọi IP - cần thiết cho Vercel serverless)
  - Hoặc chỉ whitelist IP của Vercel (xem danh sách tại Settings → Domains)
- Connection string phải có format đầy đủ với username, password, database name

3. Click **"Save"** và **"Redeploy"** để áp dụng biến môi trường

---

## 🧪 Kiểm Tra Sau Khi Deploy

### 1. Test Health Check API
```bash
curl https://yourapp.vercel.app/api/health
```

Kết quả mong đợi:
```json
{
  "success": true,
  "message": "HR Management System API is running on Vercel",
  "timestamp": "2025-10-08T...",
  "environment": "production",
  "dbStatus": "connected"
}
```

### 2. Test React Router (Fix 404)
Truy cập trực tiếp các routes:
- `https://yourapp.vercel.app/` ✅
- `https://yourapp.vercel.app/dashboard` ✅ (Không bị 404!)
- `https://yourapp.vercel.app/employees` ✅
- `https://yourapp.vercel.app/profile` ✅

### 3. Test API Calls
```bash
# Test login
curl -X POST https://yourapp.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test get employees
curl https://yourapp.vercel.app/api/employees \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🐛 Troubleshooting

### ❌ Lỗi: 404 NOT_FOUND khi truy cập /dashboard

**Nguyên nhân**: Cấu hình routing trong `vercel.json` sai hoặc thiếu.

**Giải pháp**: 
- Đảm bảo route `"src": "/(.*)", "dest": "/frontend/build/index.html"` nằm **cuối cùng** trong mảng `routes`.
- Kiểm tra `frontend/build/index.html` có tồn tại sau build.

---

### ❌ Lỗi: Cannot connect to database

**Nguyên nhân**: MONGODB_URI chưa set hoặc MongoDB Atlas chặn IP.

**Giải pháp**:
1. Vào MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)
2. Kiểm tra Environment Variables đã set đúng chưa
3. Redeploy project

---

### ❌ Lỗi: API routes trả về 404

**Nguyên nhân**: Routes trong `backend/routes/` có lỗi hoặc không được import đúng trong `api/index.js`.

**Giải pháp**:
1. Kiểm tra `api/index.js` đã import đúng routes chưa:
```javascript
const authRoutes = require('../backend/routes/auth');
app.use('/api/auth', authRoutes);
```

2. Kiểm tra file routes có export đúng không:
```javascript
// backend/routes/auth.js
const router = require('express').Router();
// ... routes
module.exports = router; // Phải có dòng này!
```

---

### ❌ Lỗi: Module not found

**Nguyên nhân**: Dependencies chưa được install trong Vercel build.

**Giải pháp**:
1. Đảm bảo `api/package.json` hoặc root `package.json` có đầy đủ dependencies
2. Tạo `api/package.json` nếu chưa có:

```json
{
  "name": "hr-api",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5-lts.1",
    "puppeteer": "^21.0.0"
  }
}
```

---

### ❌ Lỗi: Build failed - "distDir" not found

**Nguyên nhân**: Thư mục build không được tạo ra.

**Giải pháp**:
1. Kiểm tra script build trong `frontend/package.json`
2. Test build local:
```bash
cd frontend
npm install
npm run build
ls build/  # Phải có index.html, static/, ...
```

---

## 📊 Giới Hạn Vercel (Free Plan)

- **Serverless Function Execution**: 10s timeout (có thể upgrade)
- **Bandwidth**: 100GB/tháng
- **Deployments**: Unlimited
- **File Size**: Max 50MB per serverless function
- **Memory**: 1024MB default (có thể tăng trong `vercel.json`)

**⚠️ Lưu ý**: 
- Upload file lớn có thể vượt giới hạn → Cân nhắc dùng dịch vụ khác như AWS S3, Cloudinary
- Database connection mất thời gian kết nối lần đầu (cold start) → Đã optimize với connection pooling

---

## 🔄 Cập Nhật Code Sau Khi Deploy

Sau khi setup xong, mỗi lần push code:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel sẽ **tự động** build và deploy lại (Auto Deployment).

---

## 📞 Hỗ Trợ

Nếu gặp lỗi:
1. Check logs trên Vercel Dashboard → Project → Deployments → Click deployment → View Logs
2. Check Function logs cho API errors
3. Check Build logs nếu build failed

---

## ✅ Checklist Trước Khi Deploy

- [ ] `vercel.json` đã tạo ở `hr-management-app/`
- [ ] `api/index.js` đã tạo và export đúng
- [ ] Frontend build được local (`npm run build` thành công)
- [ ] MONGODB_URI đã có (từ MongoDB Atlas)
- [ ] Git push code lên repository
- [ ] Set Root Directory = `hr-management-app` trên Vercel
- [ ] Set Environment Variables trên Vercel
- [ ] MongoDB Atlas whitelist IP `0.0.0.0/0`
- [ ] Test `/api/health` sau deploy
- [ ] Test React Router routes (không bị 404)

---

## 🎉 Hoàn Thành!

Sau khi deploy thành công, bạn sẽ có:
- ✅ Frontend React chạy trên `https://yourapp.vercel.app`
- ✅ Backend API trên `https://yourapp.vercel.app/api/*`
- ✅ React Router hoạt động không bị 404
- ✅ Tự động deploy khi push code

**Ví dụ URLs**:
- Frontend: `https://yourapp.vercel.app/dashboard`
- API: `https://yourapp.vercel.app/api/employees`
- Health check: `https://yourapp.vercel.app/api/health`

---

*Tạo bởi: HR Management System Team*  
*Ngày: 2025-10-08*

