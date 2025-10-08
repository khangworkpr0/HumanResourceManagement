# API Serverless Functions

## Mô Tả

Thư mục này chứa **Vercel Serverless Functions** wrapper cho Express backend.

### Cấu Trúc

```
api/
├── index.js         # Entry point - Express app wrapper
└── package.json     # Dependencies cho serverless function
```

## index.js

File này:
- Import và sử dụng lại **tất cả routes** từ `../backend/routes/`
- Quản lý MongoDB connection với **connection pooling**
- Export Express app cho Vercel: `module.exports = app`

## Tại Sao Cần File Này?

Vercel serverless functions cần:
1. File export một **function handler** hoặc **Express app**
2. Nằm trong thư mục `api/` hoặc được define trong `vercel.json`
3. Không chạy `app.listen()` trong production (Vercel tự handle)

## Routes Được Hỗ Trợ

Tất cả routes sẽ có prefix `/api`:

- `POST /api/auth/register` - Đăng ký user
- `POST /api/auth/login` - Đăng nhập
- `GET /api/employees` - Lấy danh sách nhân viên
- `POST /api/employees` - Tạo nhân viên mới
- `GET /api/departments` - Lấy danh sách phòng ban
- `POST /api/contracts` - Tạo hợp đồng
- `GET /api/health` - Health check

## Environment Variables Cần Thiết

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
CLIENT_URL=https://yourapp.vercel.app
```

## Local Development

Để test local:

```bash
cd api
npm install
node index.js
```

Server sẽ chạy trên `http://localhost:5000`

## Deploy

Vercel tự động detect và deploy file này khi:
- `vercel.json` có build config cho `api/index.js`
- `api/package.json` có đầy đủ dependencies

