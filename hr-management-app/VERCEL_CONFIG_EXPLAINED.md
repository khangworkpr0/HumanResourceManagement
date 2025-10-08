# 📖 Giải Thích Chi Tiết `vercel.json`

## Tổng Quan

File `vercel.json` là file cấu hình chính để Vercel biết cách:
1. **Build** frontend và backend
2. **Route** requests đến đúng nơi
3. **Optimize** performance

---

## Cấu Trúc File

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "builds": [...],
  "routes": [...],
  "env": {...},
  "functions": {...}
}
```

---

## 1️⃣ Schema và Version

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2
}
```

### Giải Thích
- **$schema**: Giúp IDE autocomplete và validate config
- **version: 2**: Vercel config version (bắt buộc phải là 2)

---

## 2️⃣ Builds - Cách Build Project

```json
"builds": [
  {
    "src": "frontend/package.json",
    "use": "@vercel/static-build",
    "config": {
      "distDir": "build"
    }
  },
  {
    "src": "api/index.js",
    "use": "@vercel/node"
  }
]
```

### Build #1: Frontend (React)

```json
{
  "src": "frontend/package.json",
  "use": "@vercel/static-build",
  "config": { "distDir": "build" }
}
```

**Giải thích từng dòng**:
- **src**: `"frontend/package.json"` 
  - Vercel sẽ vào thư mục `frontend/` và tìm `package.json`
  - Chạy `npm install` để cài dependencies
  - Chạy script `build` trong `package.json` (tức `react-scripts build`)

- **use**: `"@vercel/static-build"`
  - Builder chuyên dụng cho static sites (React, Vue, Angular, etc.)
  - Tự động optimize images, minify JS/CSS, gzip compression

- **config.distDir**: `"build"`
  - Thư mục output sau khi build (React mặc định tạo thư mục `build/`)
  - Vercel sẽ serve static files từ `frontend/build/`

**Kết quả**: 
- Frontend được build thành static files
- Deploy lên Vercel CDN (cực nhanh!)

---

### Build #2: Backend (Node.js)

```json
{
  "src": "api/index.js",
  "use": "@vercel/node"
}
```

**Giải thích từng dòng**:
- **src**: `"api/index.js"`
  - File entry point của serverless function
  - Vercel sẽ chạy file này như một Lambda function

- **use**: `"@vercel/node"`
  - Builder cho Node.js serverless functions
  - Tự động setup runtime, dependencies, environment

**Cách hoạt động**:
1. Vercel đọc `api/package.json` và install dependencies
2. Vercel wrap `api/index.js` thành serverless function
3. Mỗi request tới `/api/*` sẽ trigger function này
4. Function trả về response

**Lưu ý quan trọng**:
- File **PHẢI export** Express app: `module.exports = app`
- **KHÔNG** được có `app.listen()` trong production (Vercel tự handle)
- Timeout mặc định: 10s (có thể tăng trong section `functions`)

---

## 3️⃣ Routes - Routing Traffic

```json
"routes": [
  { "src": "/api/(.*)", "dest": "/api/index.js" },
  { "src": "/uploads/(.*)", "dest": "/api/index.js" },
  { "src": "/static/(.*)", "dest": "/frontend/build/static/$1" },
  { "src": "/(.*\\.(js|css|json|ico|png|jpg|jpeg|svg|woff|woff2|ttf|eot))", "dest": "/frontend/build/$1" },
  { "src": "/(.*)", "dest": "/frontend/build/index.html" }
]
```

### ⚠️ THỨ TỰ ROUTES CỰC KỲ QUAN TRỌNG!

Vercel xử lý routes **từ trên xuống dưới**. Route đầu tiên match sẽ được dùng.

---

### Route #1: API Routes

```json
{ "src": "/api/(.*)", "dest": "/api/index.js" }
```

**Giải thích**:
- **src**: `/api/(.*)` - Regex pattern
  - `/api/` - Bắt đầu với `/api/`
  - `(.*)` - Bắt **bất kỳ** gì sau đó
  
- **dest**: `/api/index.js`
  - Mọi request match pattern sẽ được gửi tới serverless function

**Ví dụ**:
- `GET /api/health` → `api/index.js`
- `POST /api/auth/login` → `api/index.js`
- `GET /api/employees/123` → `api/index.js`

---

### Route #2: Uploads (Static Files)

```json
{ "src": "/uploads/(.*)", "dest": "/api/index.js" }
```

**Giải thích**:
- Uploads (profile images, employee files) cũng đi qua backend
- Backend có `app.use('/uploads', express.static('uploads'))`

**Lưu ý**: 
- Trên Vercel serverless, **không khuyến khích** lưu uploads trong server
- Nên dùng **Cloudinary, AWS S3, hoặc Vercel Blob** thay thế

---

### Route #3: React Static Assets

```json
{ "src": "/static/(.*)", "dest": "/frontend/build/static/$1" }
```

**Giải thích**:
- **src**: `/static/(.*)` - Match `/static/js/main.js`, `/static/css/main.css`, etc.
- **dest**: `/frontend/build/static/$1`
  - `$1` = nội dung của `(.*)`
  - Ví dụ: `/static/js/main.js` → `/frontend/build/static/js/main.js`

**Tại sao cần**:
- React build tạo thư mục `build/static/` chứa JS, CSS chunks
- Route này serve trực tiếp từ CDN (cực nhanh!)

---

### Route #4: Other Static Files

```json
{
  "src": "/(.*\\.(js|css|json|ico|png|jpg|jpeg|svg|woff|woff2|ttf|eot))",
  "dest": "/frontend/build/$1"
}
```

**Giải thích**:
- **src**: Regex match các file có extension:
  - `.js`, `.css`, `.json` - Code files
  - `.ico` - Favicon
  - `.png`, `.jpg`, `.jpeg`, `.svg` - Images
  - `.woff`, `.woff2`, `.ttf`, `.eot` - Fonts

- **dest**: `/frontend/build/$1`
  - Serve từ thư mục build

**Ví dụ**:
- `/favicon.ico` → `/frontend/build/favicon.ico`
- `/logo192.png` → `/frontend/build/logo192.png`
- `/manifest.json` → `/frontend/build/manifest.json`

---

### Route #5: Catch-All (Fix 404 cho React Router) ⭐

```json
{ "src": "/(.*)", "dest": "/frontend/build/index.html" }
```

### 🚨 ĐÂY LÀ ROUTE QUAN TRỌNG NHẤT!

**Giải thích**:
- **src**: `/(.*)`
  - Match **BẤT KỲ** URL nào chưa match ở trên
  
- **dest**: `/frontend/build/index.html`
  - Luôn trả về `index.html`

**Tại sao cần**:
React Router là **client-side routing**:
1. User truy cập `https://yourapp.com/dashboard`
2. Không có route nào match `/dashboard` → Match route này
3. Vercel trả về `index.html`
4. React app load, React Router render component `<Dashboard />`

**Nếu không có route này**:
- User bookmark `https://yourapp.com/dashboard`
- User click link → Vercel trả về **404 NOT_FOUND** ❌
- Vì server không có file `dashboard.html`

**Vị trí phải ở cuối**:
- Nếu đặt đầu tiên → Mọi request đều về `index.html`, kể cả `/api/*` ❌
- Phải đặt cuối để API routes được xử lý trước ✅

---

## 4️⃣ Environment Variables

```json
"env": {
  "NODE_ENV": "production"
}
```

**Giải thích**:
- Set global environment variable cho cả frontend và backend
- `NODE_ENV=production` → Code chạy ở chế độ production (optimized)

**Lưu ý**:
- Các biến nhạy cảm (MONGODB_URI, JWT_SECRET) **KHÔNG** được đặt ở đây
- Dùng Vercel Dashboard → Settings → Environment Variables thay thế

---

## 5️⃣ Functions Configuration

```json
"functions": {
  "api/index.js": {
    "memory": 1024,
    "maxDuration": 10
  }
}
```

**Giải thích**:
- **memory**: `1024` MB RAM cho serverless function
  - Mặc định: 1024 MB (đủ cho hầu hết cases)
  - Có thể tăng nếu cần (Pro plan: 3008 MB)

- **maxDuration**: `10` seconds
  - Timeout tối đa cho function
  - Free plan: Max 10s
  - Pro plan: Max 60s
  - Enterprise: Max 900s (15 phút)

**Khi nào cần tăng**:
- Function xử lý file lớn
- Generate PDF phức tạp
- Query database phức tạp

---

## 📊 Flow Hoàn Chỉnh

### Request đến `/dashboard`

```
1. User truy cập: https://yourapp.com/dashboard
2. Vercel kiểm tra routes từ trên xuống:
   - ❌ Không match /api/(.*)
   - ❌ Không match /uploads/(.*)
   - ❌ Không match /static/(.*)
   - ❌ Không match /(.*)\\.(js|css|...)
   - ✅ Match /(.*) → Trả về index.html
3. Browser nhận index.html
4. React app load
5. React Router render <Dashboard />
6. User thấy dashboard! ✅
```

### Request đến `/api/employees`

```
1. User call API: fetch('/api/employees')
2. Vercel kiểm tra routes từ trên xuống:
   - ✅ Match /api/(.*) → Gọi api/index.js
3. Serverless function chạy:
   - Connect MongoDB
   - Query employees
   - Return JSON
4. Frontend nhận data và render! ✅
```

### Request đến `/static/js/main.js`

```
1. Browser request: /static/js/main.js
2. Vercel kiểm tra routes:
   - ❌ Không match /api/(.*)
   - ❌ Không match /uploads/(.*)
   - ✅ Match /static/(.*) → Serve file
3. Vercel CDN trả về file từ /frontend/build/static/js/main.js
4. File được cache, lần sau load cực nhanh! ⚡
```

---

## 🎯 Tổng Kết

### Điều Quan Trọng Cần Nhớ

1. **Builds**:
   - Frontend: Static build với `@vercel/static-build`
   - Backend: Serverless function với `@vercel/node`

2. **Routes**:
   - Thứ tự routes **cực kỳ quan trọng**
   - API routes phải đặt trước catch-all route
   - Catch-all route `(.*) → index.html` fix 404 cho React Router

3. **Environment Variables**:
   - Global vars trong `vercel.json`
   - Sensitive vars trong Dashboard

4. **Functions**:
   - Configure memory và timeout
   - Free plan: Max 10s timeout

---

## 🔧 Customize

### Thay Đổi Timeout (Pro Plan)

```json
"functions": {
  "api/index.js": {
    "memory": 3008,
    "maxDuration": 60
  }
}
```

### Thêm Headers

```json
"headers": [
  {
    "source": "/api/(.*)",
    "headers": [
      { "key": "Access-Control-Allow-Origin", "value": "*" },
      { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE" }
    ]
  }
]
```

### Redirects

```json
"redirects": [
  {
    "source": "/old-path",
    "destination": "/new-path",
    "permanent": true
  }
]
```

---

## ❓ FAQ

### Q: Tại sao không dùng `@vercel/static` cho frontend?

**A**: `@vercel/static-build` cho phép chạy build script (`npm run build`), còn `@vercel/static` chỉ serve static files có sẵn.

### Q: Có thể deploy nhiều serverless functions không?

**A**: Có! Tạo nhiều files trong `api/`:
```
api/
├── index.js         → /api/index
├── auth.js          → /api/auth
└── employees.js     → /api/employees
```

### Q: Vercel có cache responses không?

**A**: Có, nhưng chỉ cho static files. API responses không cache trừ khi set headers `Cache-Control`.

### Q: Cold start là gì?

**A**: Lần đầu serverless function chạy sau idle, phải khởi tạo container → Chậm hơn (1-3s). Connection pooling giảm cold start.

---

**💡 Tips**: 
- Đọc kỹ section Routes để hiểu flow
- Test local trước khi deploy
- Check logs trên Vercel nếu có lỗi

---

*File được tạo để giải thích chi tiết `vercel.json`*  
*Nếu có thắc mắc, tham khảo: https://vercel.com/docs/project-configuration*

