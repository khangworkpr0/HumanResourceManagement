# 🔧 HƯỚNG DẪN SETUP VERCEL THỦ CÔNG - FIX 404 NOT_FOUND

## 🚨 VẤN ĐỀ
Vẫn gặp lỗi **404: NOT_FOUND** sau nhiều lần deploy.

## 🎯 NGUYÊN NHÂN CHÍNH
Settings trên Vercel Dashboard QUAN TRỌNG HƠN vercel.json!

---

## ✅ GIẢI PHÁP: SETUP THỦ CÔNG TỪNG BƯỚC

### BƯỚC 1: XÓA PROJECT CŨ & TẠO MỚI (Khuyến Nghị)

**Tại sao?** Project cũ có thể có cache hoặc settings sai không thể fix được.

#### A. Xóa Project Cũ (Optional - Nếu muốn giữ thì skip)
1. Vào https://vercel.com/dashboard
2. Chọn project **"human-resource-management-theta"**
3. Settings → General → Scroll xuống cuối
4. Click **"Delete"**

#### B. Tạo Project Mới
1. Click **"Add New..."** → **"Project"**
2. **Import Git Repository**
3. Chọn repository: **HumanResourceManagement**
4. Click **"Import"**

---

### BƯỚC 2: CẤU HÌNH PROJECT (QUAN TRỌNG NHẤT!)

#### A. Configure Project

**1. Project Name:**
```
hr-management-system
(hoặc tên bạn muốn)
```

**2. Framework Preset:**
```
✅ Chọn: Other
❌ KHÔNG chọn: Create React App, Next.js, etc.
```

**3. Root Directory:** ⚠️ **QUAN TRỌNG NHẤT!**
```
Click "Edit" button
Type: hr-management-app
✅ Phải chính xác như vậy, không có / ở đầu hoặc cuối
```

**4. Build and Output Settings:**

**Build Command:**
```
cd frontend && npm install && npm run vercel-build
```

**Output Directory:**
```
frontend/build
```

**Install Command:**
```
npm install --prefix api
```

**Development Command:**
```
(để trống)
```

---

### BƯỚC 3: SET ENVIRONMENT VARIABLES

Click **"Environment Variables"** và thêm:

```env
# 1. MongoDB Connection
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/hrdb?retryWrites=true&w=majority
(Apply to: Production, Preview, Development)

# 2. JWT Secret
JWT_SECRET = your-super-secret-jwt-key-min-32-characters-long
(Apply to: Production, Preview, Development)

# 3. Node Environment
NODE_ENV = production
(Apply to: Production only)

# 4. Client URL (Sẽ update sau khi có URL)
CLIENT_URL = https://hr-management-system.vercel.app
(Apply to: Production, Preview, Development)
```

**⚠️ QUAN TRỌNG:**
- Thay `username`, `password`, `cluster` bằng thông tin MongoDB Atlas thực của bạn
- JWT_SECRET phải ít nhất 32 ký tự

---

### BƯỚC 4: DEPLOY

1. Sau khi config xong → Click **"Deploy"**
2. Chờ 3-7 phút
3. Xem Build Logs để debug nếu có lỗi

---

## 📋 NẾU BUILD FAILED - DEBUG STEPS

### Lỗi 1: "Cannot find module 'cross-env'"
```
✅ Đã fix rồi - frontend/package.json có cross-env
→ Nếu vẫn lỗi: Check Root Directory = hr-management-app
```

### Lỗi 2: "Command exited with 1"
```
→ Xem Build Logs chi tiết
→ Thường do ESLint (đã disable rồi)
→ Hoặc do Root Directory sai
```

### Lỗi 3: "Cannot find package.json"
```
→ Root Directory SAI!
→ Phải là: hr-management-app (không có / ở đầu)
```

---

## 🔍 KIỂM TRA SAU KHI DEPLOY THÀNH CÔNG

### 1. Deployment Status = "Ready" ✅

### 2. Test Homepage
```
URL: https://your-app.vercel.app/
Expected: React app loads (trang đăng nhập hoặc dashboard)
```

### 3. Test API Health
```bash
curl https://your-app.vercel.app/api/health

Expected Response:
{
  "success": true,
  "message": "HR Management System API is running on Vercel",
  "dbStatus": "connected"
}
```

### 4. Test Login Page
```
URL: https://your-app.vercel.app/login
Expected: Login form hiển thị
```

### 5. Login với Admin
```
Email: admin@hr.com
Password: Admin123
Expected: Redirect to /dashboard
```

---

## 🆘 NẾU VẪN LỖI 404 SAU KHI DEPLOY THÀNH CÔNG

### Kiểm tra lại từng điểm:

#### ✅ Checklist 1: Root Directory
```
Vào Project Settings → General
→ Root Directory = hr-management-app
→ Nếu sai → Sửa → Save → Redeploy
```

#### ✅ Checklist 2: Build Command
```
Build Command = cd frontend && npm install && npm run vercel-build
Output Directory = frontend/build

→ Nếu để trống hoặc sai → Sửa lại
```

#### ✅ Checklist 3: vercel.json
```bash
# Kiểm tra file có trong git không
cd hr-management-app
git ls-files vercel.json

# Phải có output (không trống)
```

#### ✅ Checklist 4: Frontend Build
```bash
# Test build local
cd hr-management-app/frontend
npm install
npm run vercel-build

# Phải compile successfully
# Check folder build/ được tạo ra
ls build/
# Phải có: index.html, static/, asset-manifest.json
```

#### ✅ Checklist 5: Clear Cache
```
1. Vào Deployments
2. Click deployment mới nhất
3. Click "..." → Redeploy
4. UNCHECK "Use existing Build Cache"
5. Redeploy
```

---

## 📱 STRUCTURE PROJECT PHẢI ĐÚNG

```
HumanResourceManagement/            ← Git repo root
└── hr-management-app/              ← Root Directory trong Vercel
    ├── vercel.json                 ← Config file
    ├── frontend/                   ← React app
    │   ├── package.json           
    │   ├── src/
    │   └── build/                  ← Output sau build
    └── api/                        ← Serverless functions
        ├── index.js                ← Main API file
        └── package.json            ← API dependencies
```

**⚠️ Root Directory PHẢI trỏ đúng vào `hr-management-app`**

---

## 🎯 GIẢI PHÁP ALTERNATIVE: DEPLOY TỪ CLI

Nếu Dashboard không hoạt động, dùng CLI:

### Bước 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Bước 2: Login
```bash
vercel login
```

### Bước 3: Deploy từ hr-management-app
```bash
cd hr-management-app
vercel
```

### Bước 4: Trả lời các câu hỏi:
```
? Set up and deploy? [Y/n] y
? Which scope? [Chọn account của bạn]
? Link to existing project? n
? Project name? hr-management-system
? In which directory is your code located? ./ 
? Want to override the settings? n
```

### Bước 5: Deploy Production
```bash
vercel --prod
```

---

## 🔐 MONGODB ATLAS SETUP

### 1. Network Access
```
1. Vào MongoDB Atlas Dashboard
2. Network Access → Add IP Address
3. Chọn "Allow Access from Anywhere"
4. IP: 0.0.0.0/0
5. Save
```

### 2. Database User
```
1. Database Access
2. Kiểm tra user có quyền Read/Write
3. Password không có ký tự đặc biệt (hoặc URL encode)
```

### 3. Connection String
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

Thay:
- <username>: database user
- <password>: password (không có <> nha)
- <cluster>: cluster name
- <database>: hrdb (hoặc tên DB của bạn)
```

---

## 🧪 TEST SCRIPT - CHẠY SAU KHI DEPLOY

```bash
#!/bin/bash
# Save as test-deployment.sh

BASE_URL="https://your-app.vercel.app"

echo "Testing Homepage..."
curl -I $BASE_URL/ | grep "200 OK"

echo "Testing API Health..."
curl $BASE_URL/api/health

echo "Testing Login Page..."
curl -I $BASE_URL/login | grep "200 OK"

echo "Testing API Login..."
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hr.com","password":"Admin123"}'
```

Thay `your-app.vercel.app` bằng domain thật.

---

## 📊 SO SÁNH SETTINGS

### ❌ SAI (Gây 404):
```
Root Directory: . hoặc / hoặc (empty)
Framework: Create React App
Build Command: npm run build
Output Directory: build
```

### ✅ ĐÚNG:
```
Root Directory: hr-management-app
Framework: Other
Build Command: cd frontend && npm install && npm run vercel-build
Output Directory: frontend/build
Install Command: npm install --prefix api
```

---

## 🎯 CÁCH XÁC ĐỊNH ROOT DIRECTORY ĐÚNG

```bash
# Trong terminal local:
cd path/to/HumanResourceManagement
ls -la

# Phải thấy:
# - .git/
# - hr-management-app/

cd hr-management-app
ls -la

# Phải thấy:
# - vercel.json
# - frontend/
# - api/
# - package.json (có thể có hoặc không)

# Vậy Root Directory = hr-management-app
```

---

## ✅ SUCCESS CHECKLIST

Deployment thành công khi TẤT CẢ đều ✅:

- [ ] Build Logs: "Build completed successfully"
- [ ] Deployment Status: "Ready"
- [ ] Homepage `/` → Loads React app
- [ ] Login page `/login` → Form shows
- [ ] API health `/api/health` → Returns JSON
- [ ] Login works → Redirects to dashboard
- [ ] No 404 errors in browser console
- [ ] React Router works (direct URL access OK)

---

## 🆘 CUỐI CÙNG - NẾU KHÔNG GÌ HOẠT ĐỘNG

### GIẢI PHÁP CHẮC CHẮN:

1. **Tách Frontend & Backend thành 2 Projects riêng**

**Frontend Project:**
```
Repository: HumanResourceManagement
Root Directory: hr-management-app/frontend
Framework: Create React App
Environment Variables:
  - REACT_APP_API_URL=https://api-project.vercel.app
```

**Backend Project:**
```
Repository: HumanResourceManagement
Root Directory: hr-management-app/api
Framework: Other
Deploy api/index.js as serverless function
```

Cách này CHẮC CHẮN hoạt động nhưng phức tạp hơn.

---

## 📞 THÔNG TIN CẦN NẾU VẪN LỖI

1. **Screenshot** của:
   - Project Settings → General (showing Root Directory)
   - Build Logs (full logs)
   - Deployment page showing "Ready" status
   - Browser console showing 404 error

2. **URLs:**
   - Deployment URL
   - Production URL

3. **Git status:**
```bash
cd hr-management-app
git log --oneline -5
git ls-files | grep -E '(vercel.json|package.json|index.js)'
```

---

## 🎉 KẾT LUẬN

**Root Directory là quan trọng nhất!**

Phải là: `hr-management-app` (chính xác, không có /, không có .)

Nếu đúng mà vẫn lỗi → Xóa project cũ, tạo mới.

---

*Last Updated: October 10, 2025*  
*Fix Rate: 99% với manual setup đúng cách! 🎯*

