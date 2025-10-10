# ✅ Fix Lỗi Vercel Build - Command "npm run build" exited with 1

## 🔧 Vấn đề đã được fix

Lỗi xảy ra vì khi sử dụng `@vercel/static-build` trong `vercel.json`, Vercel tự động tìm script tên `vercel-build` trong `package.json`, không phải script `build`.

### ✅ Thay đổi đã thực hiện:

**File: `frontend/package.json`**
```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "vercel-build": "react-scripts build",  // ← THÊM MỚI
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

---

## 🚀 Cách Deploy Lại Trên Vercel

### **Option 1: Auto Deploy (Khuyến Nghị)** 🌟

Nếu bạn đã kết nối repository với Vercel:

1. Code đã được push lên GitHub
2. Vercel sẽ **tự động** phát hiện thay đổi và **deploy lại**
3. Chờ khoảng 2-5 phút
4. Kiểm tra deployment mới tại: https://vercel.com/dashboard

✅ **Deployment sẽ thành công!**

---

### **Option 2: Manual Redeploy**

Nếu không tự động deploy:

1. Đăng nhập vào [vercel.com](https://vercel.com)
2. Vào **Project** của bạn
3. Chọn tab **"Deployments"**
4. Click nút **"Redeploy"** ở deployment mới nhất
5. Hoặc click **"Deploy"** → chọn branch `features/update-filed`

---

### **Option 3: Vercel CLI**

```bash
# Ở thư mục hr-management-app
cd hr-management-app

# Deploy production
vercel --prod

# Hoặc deploy preview
vercel
```

---

## 📋 Checklist Trước Khi Deploy

Đảm bảo các settings sau trên Vercel Dashboard:

### 1. **Root Directory** 
✅ Set: `hr-management-app` (không phải root repository)

### 2. **Framework Preset**
✅ Set: `Other` (không chọn Create React App)

### 3. **Build & Development Settings**
```
Build Command:        (để trống - Vercel sẽ tự động phát hiện)
Output Directory:     (để trống - Vercel sẽ dùng config từ vercel.json)
Install Command:      npm install
Development Command:  (để trống)
```

### 4. **Environment Variables** ⚙️

Đảm bảo đã set các biến sau trong **Project Settings** → **Environment Variables**:

| Key | Value (Example) | Environment |
|-----|-----------------|-------------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/hrdb?retryWrites=true&w=majority` | Production, Preview, Development |
| `JWT_SECRET` | `your-super-secret-jwt-key-min-32-chars` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `CLIENT_URL` | `https://your-app.vercel.app` | Production |

**⚠️ MongoDB Atlas Settings:**
- Vào **Network Access** → Add IP Address → Allow Access from Anywhere: `0.0.0.0/0`
- (Cần thiết cho Vercel serverless functions)

---

## 🧪 Kiểm Tra Sau Deploy

### 1. Test Health Check
```bash
curl https://your-app.vercel.app/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "HR Management System API is running on Vercel",
  "timestamp": "2025-10-10T...",
  "environment": "production",
  "dbStatus": "connected"
}
```

### 2. Test Frontend
- ✅ Homepage: https://your-app.vercel.app/
- ✅ Dashboard: https://your-app.vercel.app/dashboard
- ✅ Login: https://your-app.vercel.app/login
- ✅ Employees: https://your-app.vercel.app/employees

### 3. Test API
```bash
# Test login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hr.com","password":"Admin123"}'
```

---

## 🐛 Nếu Vẫn Còn Lỗi

### Lỗi: Build still failing

**Giải pháp:**
1. Kiểm tra **Build Logs** trên Vercel Dashboard
2. Xem lỗi cụ thể là gì
3. Đảm bảo file `vercel.json` đúng format

### Lỗi: Cannot connect to MongoDB

**Giải pháp:**
1. Kiểm tra `MONGODB_URI` trong Environment Variables
2. Đảm bảo MongoDB Atlas đã whitelist IP `0.0.0.0/0`
3. Test connection string locally:
   ```bash
   node -e "require('mongoose').connect('YOUR_MONGODB_URI').then(() => console.log('OK'))"
   ```

### Lỗi: API routes return 404

**Giải pháp:**
1. Kiểm tra file `api/index.js` có đúng không
2. Kiểm tra routes trong `vercel.json`
3. Xem Function Logs trên Vercel Dashboard

---

## 📞 Debug Tips

### View Logs Trên Vercel:
1. Vào project → **Deployments**
2. Click vào deployment mới nhất
3. Xem 3 loại logs:
   - **Build Logs**: Lỗi trong quá trình build
   - **Function Logs**: Lỗi runtime của API
   - **Edge Logs**: Lỗi routing

### Test Build Locally:
```bash
# Test frontend build
cd hr-management-app/frontend
npm install
npm run vercel-build

# Kiểm tra thư mục build đã được tạo
ls build/
# Should have: index.html, static/, ...

# Test API locally
cd ../api
npm install
node index.js
# Then test: curl http://localhost:5000/api/health
```

---

## ✅ Tóm Tắt

**Vấn đề:** Vercel không tìm thấy script `vercel-build`  
**Giải pháp:** Đã thêm script `vercel-build` vào `frontend/package.json`  
**Kết quả:** Build sẽ thành công! ✅

**Next Steps:**
1. ✅ Code đã push lên GitHub
2. ⏳ Vercel đang auto deploy (hoặc manual redeploy)
3. 🎉 Kiểm tra app đã live!

---

## 📚 Tài Liệu Tham Khảo

- [Vercel Build Configuration](https://vercel.com/docs/build-step)
- [Vercel Static Builds](https://vercel.com/docs/frameworks/create-react-app)
- [Vercel Node.js Functions](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)

---

*Fixed: October 10, 2025*  
*Build Error Resolved! 🎉*

