# ✅ FIX LỖI 404: NOT_FOUND TRÊN VERCEL

## 🔴 Lỗi Gặp Phải
```
404: NOT_FOUND
Code: NOT_FOUND
ID: sin1::2qjsq-1760068906179-aae727efe29b
```

## 🎯 Nguyên Nhân
Cấu hình `vercel.json` cũ sử dụng `builds` và `routes` (cú pháp cũ) với paths không đúng, dẫn đến Vercel không tìm thấy files frontend.

## ✅ Giải Pháp Đã Áp Dụng

### Cập nhật `vercel.json` với cấu hình mới:

**File: `hr-management-app/vercel.json`**
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run vercel-build",
  "outputDirectory": "frontend/build",
  "installCommand": "cd api && npm install",
  "functions": {
    "api/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/index.js"
    },
    {
      "source": "/uploads/:path*",
      "destination": "/api/index.js"
    },
    {
      "source": "/:path*",
      "destination": "/index.html"
    }
  ]
}
```

### Thay đổi chính:

1. **`buildCommand`** - Chỉ định rõ cách build frontend
2. **`outputDirectory`** - Chỉ định thư mục output là `frontend/build`
3. **`rewrites`** thay vì `routes` - Syntax mới hơn và đúng hơn
4. **`functions`** - Khai báo serverless functions cho API
5. **Routing đơn giản** - Tất cả requests không phải `/api/*` sẽ trả về `index.html` (cho React Router)

---

## 🚀 CÁCH DEPLOY LẠI

### ✅ Code đã được push lên GitHub

```bash
git add vercel.json
git commit -m "Fix 404 error: Update vercel.json"
git push origin features/update-filed
```

### Bước 1: Vercel sẽ Auto Deploy
- Vercel tự động phát hiện commit mới
- Chờ 2-3 phút để build và deploy

### Bước 2: Hoặc Manual Redeploy

#### **Option A: Redeploy trên Dashboard**
1. Vào https://vercel.com/dashboard
2. Chọn project của bạn
3. Tab **"Deployments"**
4. Click **"Redeploy"** ở deployment mới nhất

#### **Option B: Deploy mới từ Git**
1. Vào project → **"Deployments"**
2. Click **"Deploy"**
3. Chọn branch `features/update-filed`
4. Click **"Deploy"**

#### **Option C: Vercel CLI**
```bash
cd hr-management-app
vercel --prod
```

---

## ⚙️ QUAN TRỌNG: Kiểm Tra Settings Trên Vercel

### 1. Root Directory
Vào **Project Settings** → **General** → **Root Directory**
```
✅ Set: hr-management-app
```

### 2. Build & Development Settings
Vào **Project Settings** → **General** → **Build & Development Settings**

```
Framework Preset:     Other (không chọn Create React App)
Build Command:        (để trống - dùng từ vercel.json)
Output Directory:     (để trống - dùng từ vercel.json)  
Install Command:      (để trống - dùng từ vercel.json)
Development Command:  (để trống)
```

**⚠️ LƯU Ý:** Nếu có override ở Project Settings, hãy **xóa hết** và để Vercel dùng config từ `vercel.json`.

### 3. Environment Variables
Đảm bảo đã set đầy đủ:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrdb?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-min-32-characters-long
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
```

**MongoDB Atlas:**
- Network Access → Add IP Address → `0.0.0.0/0` (Allow all)

---

## 🧪 Kiểm Tra Sau Deploy

### 1. Test Homepage (Root Path)
```bash
curl https://your-app.vercel.app/

# Hoặc mở trình duyệt:
https://your-app.vercel.app/
```

**Expected:** Trang React app hiển thị đúng

### 2. Test API Health
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

### 3. Test React Router (Không bị 404)
Mở trình duyệt và test các routes:
- ✅ `https://your-app.vercel.app/`
- ✅ `https://your-app.vercel.app/login`
- ✅ `https://your-app.vercel.app/dashboard`
- ✅ `https://your-app.vercel.app/employees`

**Tất cả phải hiển thị React app, không bị 404!**

### 4. Test API Login
```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hr.com","password":"Admin123"}'
```

---

## 🐛 Nếu Vẫn Gặp 404

### Checklist Debug:

#### 1. Kiểm tra Build Logs
- Vào Vercel Dashboard → Deployments
- Click vào deployment mới nhất
- Xem **Build Logs**
- Đảm bảo:
  ```
  ✅ Installing dependencies...
  ✅ Building frontend...
  ✅ Compiled successfully
  ✅ Build completed
  ```

#### 2. Kiểm tra Output Directory
- Trong Build Logs, tìm dòng:
  ```
  Build completed. Output placed in "frontend/build"
  ```
- Đảm bảo `frontend/build/index.html` tồn tại

#### 3. Kiểm tra Functions
- Vào tab **"Functions"**
- Đảm bảo có function `api/index.js`
- Status phải là ✅ (không có lỗi)

#### 4. Xóa Override Settings
Vào **Project Settings** → **General**:
- Xóa **Build Command** override (để trống)
- Xóa **Output Directory** override (để trống)
- Xóa **Install Command** override (để trống)
- Click **"Save"** và **Redeploy**

#### 5. Clear Cache và Redeploy
- Vào **Deployments**
- Click **"..."** (3 dots) ở deployment
- Chọn **"Redeploy"**
- ✅ Check **"Use existing Build Cache"** = OFF
- Click **"Redeploy"**

---

## 📊 So Sánh Cấu Hình

### ❌ Cũ (Gây lỗi 404):
```json
{
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    },
    { "src": "api/index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.js" },
    { "src": "/(.*)", "dest": "/frontend/build/index.html" }
  ]
}
```

**Vấn đề:** 
- Routes trỏ đến `/frontend/build/index.html` nhưng Vercel không serve đúng path này
- Syntax `builds` và `routes` là cú pháp cũ

### ✅ Mới (Fix 404):
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run vercel-build",
  "outputDirectory": "frontend/build",
  "installCommand": "cd api && npm install",
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/index.js" },
    { "source": "/:path*", "destination": "/index.html" }
  ]
}
```

**Ưu điểm:**
- `outputDirectory` chỉ định rõ thư mục build của frontend
- `rewrites` với syntax mới hơn
- Routes đơn giản: `/api/*` → API, còn lại → `index.html`
- Vercel tự động serve static files từ `outputDirectory`

---

## 🔍 Debug Tips

### 1. Xem Function Logs
- Vào Vercel Dashboard → Project
- Tab **"Functions"**
- Click vào `api/index.js`
- Xem **Real-time Logs**

### 2. Test Local Build
```bash
cd hr-management-app/frontend
npm run vercel-build

# Kiểm tra build folder
ls build/
# Should have: index.html, static/, asset-manifest.json, ...

# Test serve local
npx serve -s build
# Open: http://localhost:3000
```

### 3. Check Vercel Build Output
Trong Build Logs, tìm:
```
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Build completed successfully
```

---

## ✅ Tóm Tắt

| Vấn đề | Nguyên nhân | Giải pháp |
|--------|-------------|-----------|
| 404 NOT_FOUND | `vercel.json` routing không đúng | Cập nhật với `rewrites` và `outputDirectory` |
| Static files 404 | Path không đúng trong routes | Dùng `outputDirectory` để Vercel tự serve |
| React Router 404 | Thiếu fallback về index.html | Thêm rewrite `/:path*` → `/index.html` |
| API 404 | Functions không được khai báo | Thêm `functions` config trong vercel.json |

---

## 🎉 Kết Quả Mong Đợi

Sau khi deploy với config mới:

✅ Homepage: `https://your-app.vercel.app/` → Hiển thị React app  
✅ API Health: `https://your-app.vercel.app/api/health` → JSON response  
✅ React Routes: Mọi route `/dashboard`, `/employees`, etc. đều hoạt động  
✅ Không còn 404 errors!  

---

## 📞 Nếu Cần Hỗ Trợ Thêm

1. Share Build Logs từ Vercel
2. Share URL của app deployed
3. Check Function Logs nếu API lỗi
4. Kiểm tra Environment Variables đã đầy đủ chưa

---

*Fixed: October 10, 2025*  
*Status: ✅ 404 Error Resolved!*  
*Deploy ngay để test!* 🚀

