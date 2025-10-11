# 🐛 DEBUG LỖI 500 TRÊN VERCEL

## 🔍 Bước 1: Xem Logs Trên Vercel Dashboard

### Cách 1: Function Logs (XEM LỖI BACKEND)

1. Vào https://vercel.com/dashboard
2. Chọn project của bạn
3. Click tab **"Logs"** (ở menu trên)
4. Hoặc: **Project Settings** → **Functions** → Click vào function → **View Logs**

**Bạn sẽ thấy:**
- ✅ Requests thành công (200)
- ❌ Requests lỗi (500) với error message chi tiết

**Ví dụ lỗi thường gặp:**
```
MongoServerError: bad auth: Authentication failed.
→ Password sai trong MONGODB_URI

MongooseServerSelectionError: connect ECONNREFUSED
→ IP chưa được whitelist

Error: MONGODB_URI is not defined
→ Environment variable chưa set
```

### Cách 2: Runtime Logs

1. Vào **Deployments** tab
2. Click vào deployment mới nhất
3. Click **"View Function Logs"**
4. Tìm request POST `/api/auth/login`
5. Xem error message

---

## 🧪 Bước 2: Test API Health Check

Mở terminal và chạy:

```bash
curl -v https://human-resource-management-khaki.vercel.app/api/health
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "HR Management System API is running on Vercel",
  "dbStatus": "connected"
}
```

**Nếu lỗi:**
```json
{
  "success": false,
  "message": "Database connection failed",
  "error": "MongoServerError: bad auth"
}
```

→ Đọc error message để biết vấn đề

---

## 🔧 Bước 3: Kiểm Tra Environment Variables

1. Vào **Project Settings** → **Environment Variables**
2. Kiểm tra từng biến:

### ✅ Checklist MONGODB_URI

**Format đúng:**
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```

**Kiểm tra:**
- [ ] Có `mongodb+srv://` ở đầu
- [ ] USERNAME đúng (không có `<>`)
- [ ] PASSWORD đúng (không có `<>`, không có space)
- [ ] Có `/DATABASE` sau `.net` (vd: `/hrdb`)
- [ ] Có `?retryWrites=true&w=majority` ở cuối

**❌ SAI:**
```
mongodb+srv://hruser:<password>@cluster0.xxx.mongodb.net/?retryWrites=true
                      ^^^^^^^^^^^ (chưa thay password)
                                                      ^ (thiếu /hrdb)
```

**✅ ĐÚNG:**
```
mongodb+srv://hruser:Abc123XYZ@cluster0.xxx.mongodb.net/hrdb?retryWrites=true&w=majority
                     ^^^^^^^^^^                             ^^^^^
```

### ⚠️ Lưu ý về Special Characters trong Password

Nếu password có ký tự đặc biệt, cần encode:

| Character | Encode thành |
|-----------|--------------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `/` | `%2F` |
| `:` | `%3A` |
| `?` | `%3F` |

**Ví dụ:**
- Password: `P@ss/word`
- Trong URI: `P%40ss%2Fword`

---

## 🔍 Bước 4: Kiểm Tra MongoDB Atlas Settings

### A. Network Access
1. Vào MongoDB Atlas → **Network Access**
2. **Phải có:** `0.0.0.0/0` (Allow access from anywhere)
3. Status phải là **Active** (màu xanh)

**Nếu không có:**
- Click **"Add IP Address"**
- Click **"ALLOW ACCESS FROM ANYWHERE"**
- IP: `0.0.0.0/0`
- Click **"Confirm"**

### B. Database Access
1. Vào MongoDB Atlas → **Database Access**
2. Tìm user của bạn (vd: `hruser`)
3. **Authentication Method:** SCRAM
4. **Database User Privileges:** Read and write to any database

**Nếu quên password:**
- Click **"Edit"** → **"Edit Password"**
- Tạo password mới → **LƯU LẠI**
- Update `MONGODB_URI` trên Vercel
- Redeploy

### C. Cluster Status
1. Vào MongoDB Atlas → **Database** (Clusters)
2. Cluster phải có status: **Active** (màu xanh)
3. Nếu đang **Starting** → đợi vài phút

---

## 🧪 Bước 5: Test Connection Local

Để chắc chắn connection string đúng, test bằng Node.js local:

```bash
cd hr-management-app/backend
node -e "const mongoose = require('mongoose'); mongoose.connect('YOUR_MONGODB_URI').then(() => console.log('✅ Connected!')).catch(err => console.error('❌ Error:', err.message))"
```

**Thay `YOUR_MONGODB_URI` bằng connection string thật.**

**Kết quả:**
- ✅ `Connected!` → URI đúng, network ok
- ❌ Error → Đọc error message để fix

---

## 📊 Các Lỗi Thường Gặp & Cách Fix

### ❌ Lỗi 1: "bad auth: Authentication failed"

**Nguyên nhân:** Password sai hoặc user không tồn tại

**Giải pháp:**
1. MongoDB Atlas → Database Access → Edit user
2. **Edit Password** → Autogenerate mới
3. Copy password → Update MONGODB_URI trên Vercel
4. Format: `mongodb+srv://USERNAME:NEW_PASSWORD@...`
5. Save → Redeploy

### ❌ Lỗi 2: "IP address is not whitelisted"

**Nguyên nhân:** Chưa whitelist IP `0.0.0.0/0`

**Giải pháp:**
1. MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0`
3. Wait 2-3 phút để apply
4. Redeploy Vercel

### ❌ Lỗi 3: "MONGODB_URI is not defined"

**Nguyên nhân:** Environment variable chưa set hoặc chưa apply

**Giải pháp:**
1. Vercel → Settings → Environment Variables
2. Kiểm tra `MONGODB_URI` đã có chưa
3. Nếu có rồi → Click **"Redeploy"** để apply
4. Nếu chưa → Add mới → Save → Redeploy

### ❌ Lỗi 4: "MongooseServerSelectionError: connect ECONNREFUSED"

**Nguyên nhân:** Cluster đang starting hoặc connection timeout

**Giải pháp:**
1. Kiểm tra cluster status trên MongoDB Atlas
2. Đợi cluster Active (màu xanh)
3. Redeploy Vercel

### ❌ Lỗi 5: "Invalid scheme, expected connection string to start with mongodb://"

**Nguyên nhân:** URI format sai, thiếu `mongodb+srv://`

**Giải pháp:**
- Đảm bảo URI bắt đầu bằng `mongodb+srv://`
- Check không có space thừa ở đầu/cuối

---

## 🔄 Bước 6: Force Redeploy

Sau khi fix environment variables:

1. Vào **Deployments** tab
2. Click **"..."** (3 dots) ở deployment mới nhất
3. Click **"Redeploy"**
4. **QUAN TRỌNG:** Uncheck **"Use existing Build Cache"**
5. Click **"Redeploy"** để confirm
6. Chờ 2-3 phút

---

## 🧪 Bước 7: Test Từng Bước

### Test 1: API Health
```bash
curl https://human-resource-management-khaki.vercel.app/api/health
```

Expected: `"dbStatus": "connected"`

### Test 2: Register User (nếu DB trống)
```bash
curl -X POST https://human-resource-management-khaki.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Admin",
    "email": "admin@test.com",
    "password": "Test123456",
    "role": "admin"
  }'
```

### Test 3: Login
```bash
curl -X POST https://human-resource-management-khaki.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Test123456"
  }'
```

Expected: `"token": "eyJhbGc..."`

---

## 📋 Quick Debug Checklist

**Theo thứ tự ưu tiên:**

1. [ ] Xem Vercel Function Logs (tìm error message cụ thể)
2. [ ] Test `/api/health` endpoint
3. [ ] Kiểm tra `MONGODB_URI` format (username, password, database)
4. [ ] Kiểm tra password không có ký tự đặc biệt (hoặc đã encode)
5. [ ] MongoDB Atlas: Network Access có `0.0.0.0/0`
6. [ ] MongoDB Atlas: User tồn tại với password đúng
7. [ ] MongoDB Atlas: Cluster status = Active
8. [ ] Vercel: Environment Variables đã save
9. [ ] Vercel: Redeploy (không dùng cache)
10. [ ] Test connection string bằng Node.js local

---

## 💡 Tips Debug Nhanh

### Xem Logs Realtime:

1. Mở: https://vercel.com → Project → Logs
2. Để tab này mở
3. Mở tab mới → Login vào app
4. Quay lại tab Logs → Xem error ngay lập tức

### Copy Connection String An Toàn:

```bash
# Trong MongoDB Atlas, khi copy connection string:
# 1. Click "Copy"
# 2. Paste vào Notepad
# 3. Thay <password> bằng password thật
# 4. Thêm /hrdb sau .mongodb.net
# 5. Copy từ Notepad → Paste vào Vercel
```

### Test Nhanh Nhất:

```bash
# Mở browser console (F12) khi login
# Xem Network tab → Click request failed → Response tab
# Sẽ thấy error message chi tiết
```

---

## 🎯 Kết Luận

**90% lỗi 500 do:**
1. Password sai trong MONGODB_URI (40%)
2. IP chưa whitelist `0.0.0.0/0` (30%)
3. Environment variables chưa apply (20%)
4. Format connection string sai (10%)

**Cách debug nhanh nhất:**
1. Xem Vercel Logs → Đọc error message
2. Fix theo error message
3. Redeploy (không cache)
4. Test lại

---

**Good luck!** 🚀

