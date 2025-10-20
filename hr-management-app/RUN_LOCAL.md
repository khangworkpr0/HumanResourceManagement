# 🚀 Chạy Backend Local với MongoDB Atlas

## Bước 1: Cấu hình MongoDB Atlas

### Lấy Connection String từ Vercel:

1. Vào https://vercel.com/dashboard
2. Chọn project HR Management
3. Settings → Environment Variables
4. Copy giá trị `MONGODB_URI`

**Hoặc lấy trực tiếp từ MongoDB Atlas:**

1. Vào https://cloud.mongodb.com
2. Chọn cluster của bạn
3. Click "Connect"
4. Chọn "Connect your application"
5. Copy connection string (dạng: `mongodb+srv://...`)

### Cập nhật file `backend/config.env`:

```env
# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hr_management?retryWrites=true&w=majority

# JWT (lấy từ Vercel để giống production)
JWT_SECRET=your_secret_from_vercel

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

> ⚠️ **Quan trọng:** 
> - Thay `username` và `password` bằng thông tin thật của bạn
> - Đảm bảo MongoDB Atlas IP Whitelist có `0.0.0.0/0` để cho phép kết nối từ mọi nơi

---

## Bước 2: Chạy Backend Server

### Mở Terminal và chạy:

```bash
cd hr-management-app/backend
npm install
npm run dev
```

**Hoặc từ thư mục root:**

```bash
cd hr-management-app
npm run server
```

### Kết quả mong đợi:

```
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
Server running on port 5000
Environment: development
```

---

## Bước 3: Test API

### Test trong browser:

1. **Health Check**: http://localhost:5000/
   ```json
   {"message": "HR Management API is running!"}
   ```

2. **Test Login**: Dùng Postman hoặc curl

**PowerShell:**
```powershell
$body = @{
    email = "admin@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**Bash/Mac:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

---

## Bước 4: Chạy cả Frontend + Backend

### Terminal 1 - Backend:
```bash
cd hr-management-app/backend
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd hr-management-app/frontend
npm start
```

**Hoặc chạy cùng lúc (từ root):**
```bash
cd hr-management-app
npm run dev
```

→ Frontend: http://localhost:3000
→ Backend API: http://localhost:5000

---

## 🐛 Troubleshooting

### Lỗi: "MongoServerError: bad auth"
→ Sai username hoặc password trong MONGODB_URI

### Lỗi: "Could not connect to any servers"
→ Check:
- IP Whitelist trên MongoDB Atlas có `0.0.0.0/0` chưa
- Internet connection
- MONGODB_URI có đúng format không

### Lỗi: "Cannot find module"
→ Chạy `npm install` trong thư mục backend

### Port 5000 đã được sử dụng
→ Đổi PORT trong config.env:
```env
PORT=5001
```

---

## 💡 Tips

### 1. Tạo user mới trong database:

**Chạy seed script:**
```bash
cd backend
node seed.js
```

### 2. Check Mongoose connection:

Thêm vào `backend/server.js`:
```javascript
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});
```

### 3. Debug mode:

```bash
NODE_ENV=development npm run dev
```

---

## ✅ Checklist

- [ ] Đã cập nhật `MONGODB_URI` trong `backend/config.env`
- [ ] Đã cập nhật `JWT_SECRET` trong `backend/config.env`
- [ ] MongoDB Atlas IP Whitelist có `0.0.0.0/0`
- [ ] Đã chạy `npm install` trong thư mục backend
- [ ] Server khởi động thành công
- [ ] Test API `/` trả về success
- [ ] Test login với user có sẵn

---

## 🎯 So sánh Local vs Production

| Feature | Local (npm run dev) | Production (Vercel) |
|---------|---------------------|---------------------|
| MongoDB | ✅ Atlas (same DB) | ✅ Atlas |
| Code | ✅ Latest code | ✅ Deployed code |
| Hot Reload | ✅ Yes | ❌ No |
| Environment | development | production |
| URL | localhost:5000 | your-app.vercel.app |

→ **Database giống nhau = Data giống nhau!**

