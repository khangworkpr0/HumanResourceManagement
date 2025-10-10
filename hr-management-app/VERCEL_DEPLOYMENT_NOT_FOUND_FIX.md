# 🚨 FIX LỖI: 404 DEPLOYMENT_NOT_FOUND

## ❌ Lỗi Gặp Phải
```
404: NOT_FOUND
Code: DEPLOYMENT_NOT_FOUND
ID: sin1::db47r-1760077196863-4ce6c444506e
```

## 🔍 Nguyên Nhân
Lỗi này xảy ra khi:
1. **Build failed** - Deployment không thành công
2. **Root Directory** settings sai trên Vercel
3. **Project chưa được deploy** đúng cách
4. **URL** đang truy cập không đúng

---

## ✅ GIẢI PHÁP - KIỂM TRA THEO BƯỚC

### BƯỚC 1: Kiểm Tra Deployment Status

1. Vào **Vercel Dashboard**: https://vercel.com/dashboard

2. Chọn project **"human-resource-management-theta"**

3. Xem tab **"Deployments"**

4. Kiểm tra deployment mới nhất:
   - ✅ **Ready** (màu xanh) → Deployment thành công
   - ❌ **Failed** (màu đỏ) → Build failed
   - ⏳ **Building** (màu vàng) → Đang build

### BƯỚC 2: Nếu Deployment FAILED ❌

Click vào deployment failed → Xem **Build Logs**

#### Các lỗi thường gặp:

**A. Lỗi: "Could not find package.json"**
```
Root Directory sai!
```
**Fix:**
- Vào Project Settings → General
- **Root Directory** = `hr-management-app` ⚠️
- Save và Redeploy

**B. Lỗi: "Command 'npm run build' exited with 1"**
```
Build script sai hoặc dependencies thiếu
```
**Fix:**
- Check Build Logs để xem lỗi cụ thể
- Thường do ESLint errors (đã fix rồi)

**C. Lỗi: "Module not found"**
```
Dependencies chưa được install
```
**Fix:**
- Check `api/package.json` có đầy đủ dependencies
- Check `frontend/package.json` có `cross-env`

### BƯỚC 3: Nếu Deployment READY ✅ Nhưng Vẫn 404

#### A. Kiểm Tra URL Đang Truy Cập

Vercel cung cấp nhiều URLs:

1. **Production URL**: `https://project-name.vercel.app`
2. **Deployment URL**: `https://project-name-xxxxx.vercel.app`
3. **Branch URL**: `https://project-name-git-branch.vercel.app`

**Cách xác định URL đúng:**
- Vào Deployments → Click deployment mới nhất
- Copy **Visit** URL
- Hoặc vào tab **Domains** để xem production URL

#### B. Kiểm Tra Root Directory Settings

**⚠️ QUAN TRỌNG NHẤT:**

1. Vào **Project Settings**
2. Tab **General**
3. Tìm **Root Directory**
4. Phải là: `hr-management-app` (KHÔNG phải `.` hoặc `/`)

<img width="600" alt="root-directory" src="https://vercel.com/_next/image?url=%2Fdocs-proxy%2Fstatic%2Fdocs%2Fconcepts%2Fprojects%2Froot-directory.png&w=3840&q=75">

5. Nếu sai → Sửa lại → **Save** → **Redeploy**

---

## 🔧 CÁCH REDEPLOY ĐÚNG

### Option 1: Redeploy Từ Dashboard (Khuyến Nghị)

1. Vào Vercel Dashboard
2. Chọn project
3. Tab **"Deployments"**
4. Click deployment mới nhất
5. Click **"..."** (3 dots)
6. Chọn **"Redeploy"**
7. ✅ **Uncheck** "Use existing Build Cache"
8. Click **"Redeploy"**

### Option 2: Deploy Mới Từ Git

1. Vào tab **"Deployments"**
2. Click nút **"Deploy"**
3. Chọn branch: `features/update-filed`
4. Click **"Deploy"**

### Option 3: Vercel CLI

```bash
cd hr-management-app
vercel --prod
```

---

## 📋 CHECKLIST ĐẦY ĐỦ

### ✅ Pre-Deployment

- [ ] Code đã push lên GitHub
- [ ] `vercel.json` có trong `hr-management-app/`
- [ ] `api/package.json` có đầy đủ dependencies
- [ ] `frontend/package.json` có `cross-env` và script `vercel-build`
- [ ] Build thành công local: `cd frontend && npm run vercel-build`

### ✅ Vercel Settings

- [ ] **Root Directory** = `hr-management-app`
- [ ] **Framework Preset** = `Other`
- [ ] **Build Command** = (để trống - dùng từ vercel.json)
- [ ] **Output Directory** = (để trống - dùng từ vercel.json)
- [ ] **Install Command** = (để trống - dùng từ vercel.json)

### ✅ Environment Variables

- [ ] `MONGODB_URI` đã set
- [ ] `JWT_SECRET` đã set
- [ ] `NODE_ENV` = `production`
- [ ] `CLIENT_URL` = `https://your-app.vercel.app`

### ✅ MongoDB Atlas

- [ ] Network Access → IP Whitelist = `0.0.0.0/0`
- [ ] Database User có quyền Read/Write
- [ ] Connection String đúng format

---

## 🧪 CÁCH DEBUG

### 1. Xem Build Logs

```
Vercel Dashboard → Deployments → Click deployment → "Building" tab
```

**Tìm kiếm:**
- ❌ `Error:` - Lỗi build
- ❌ `Failed` - Build failed
- ✅ `Build completed` - Build thành công

### 2. Xem Function Logs

```
Vercel Dashboard → Deployments → Click deployment → "Functions" tab
```

**Kiểm tra:**
- API function `api/index.js` có được tạo không
- Có lỗi runtime không

### 3. Test Endpoints

**A. Test Health Check:**
```bash
curl https://your-app.vercel.app/api/health
```

**B. Test Frontend:**
```bash
curl -I https://your-app.vercel.app/
```

Phải trả về `200 OK` và `content-type: text/html`

### 4. Xem Network Tab (Chrome DevTools)

1. Mở Chrome
2. F12 → Tab "Network"
3. Reload page
4. Xem request nào bị 404:
   - Frontend files → Check `outputDirectory`
   - API calls → Check rewrites trong `vercel.json`

---

## 🔄 NẾU VẪN KHÔNG HOẠT ĐỘNG

### Solution A: Tạo Project Mới

Đôi khi cache hoặc settings cũ gây vấn đề. Tạo project mới:

1. **Delete project cũ** (hoặc giữ lại)
2. **Import repository lại:**
   - Vercel Dashboard → "Add New Project"
   - Import từ GitHub
   - **Root Directory** = `hr-management-app`
   - Deploy

3. **Set Environment Variables**
4. **Test**

### Solution B: Deploy Từ Local

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project (hoặc tạo mới)
cd hr-management-app
vercel link

# Deploy production
vercel --prod
```

### Solution C: Kiểm Tra Files Có Bị Gitignore Không

```bash
# Kiểm tra file có trong git không
cd hr-management-app
git ls-files vercel.json
git ls-files api/index.js
git ls-files api/package.json
git ls-files frontend/package.json
```

Tất cả phải có output (không trống)

---

## 📝 CÁCH LẤY DEPLOYMENT LOGS

### Option 1: Từ Dashboard

1. Vercel Dashboard → Deployments
2. Click deployment → "Building" tab
3. Scroll xuống xem full logs
4. Copy error messages

### Option 2: Từ CLI

```bash
vercel logs [deployment-url] --follow
```

---

## 🎯 GIẢI PHÁP NHANH - THỬ NGAY

### Bước 1: Verify Settings
```
✅ Root Directory = hr-management-app
✅ Environment Variables đã set đầy đủ
```

### Bước 2: Clear Cache & Redeploy
```
Deployments → ... → Redeploy → Uncheck "Use Cache" → Redeploy
```

### Bước 3: Đợi 2-5 Phút
```
Build → Deploy → Ready ✅
```

### Bước 4: Test URL Mới
```
Click "Visit" button hoặc copy URL từ deployment
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. URL Changes
Mỗi deployment có URL riêng:
- `https://project-abc123.vercel.app` (deployment URL)
- `https://project.vercel.app` (production URL)

**Luôn dùng URL từ deployment mới nhất!**

### 2. DNS Propagation
Nếu dùng custom domain, có thể mất 24-48h để propagate.

### 3. Build Time
Build có thể mất 3-7 phút tùy project size.

### 4. Cache Issues
Nếu thấy content cũ → Clear browser cache hoặc mở Incognito.

---

## ✅ EXPECTED RESULT

Sau khi fix xong:

**1. Homepage:**
```
https://your-app.vercel.app/
→ 200 OK
→ Hiển thị React app
```

**2. API Health:**
```bash
curl https://your-app.vercel.app/api/health
→ 200 OK
→ {"success": true, "dbStatus": "connected"}
```

**3. Login Page:**
```
https://your-app.vercel.app/login
→ 200 OK
→ Form login hiển thị
```

**4. Dashboard (sau login):**
```
https://your-app.vercel.app/dashboard
→ 200 OK
→ Dashboard content
```

---

## 📞 SUPPORT

Nếu vẫn gặp vấn đề, cần thông tin sau:

1. **Screenshot** của:
   - Deployment status page
   - Build logs (nếu failed)
   - Error message đầy đủ

2. **Project Settings**:
   - Root Directory value
   - Environment Variables có đủ không

3. **URL** đang truy cập

4. **Browser Console** logs (F12 → Console tab)

---

## 🎉 SUCCESS CRITERIA

Deployment thành công khi:

✅ Build Logs show "Build completed"  
✅ Deployment status = "Ready"  
✅ Visit URL → Homepage loads  
✅ API health check returns 200  
✅ Login works  
✅ No 404 errors  

---

*Last Updated: October 10, 2025*  
*Status: Ready to troubleshoot! 🔧*

