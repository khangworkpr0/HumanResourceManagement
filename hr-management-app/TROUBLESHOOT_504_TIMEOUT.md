# 🐛 FIX LỖI 504 TIMEOUT & MONGOOSE BUFFER TIMEOUT

## 🔴 Lỗi Gặp Phải

```json
{
  "success": false,
  "message": "Server error",
  "error": "Operation `users.findOne()` buffering timed out after 10000ms"
}
```

## 🎯 Nguyên Nhân

**Mongoose buffer timeout:**
- Default: 10 giây
- MongoDB connection chậm → queries bị buffer
- Timeout trước khi kết nối thành công

**Các nguyên nhân phụ:**
1. MongoDB Atlas cluster đang cold start
2. Network latency cao (nếu cluster ở xa)
3. Connection string có vấn đề
4. IP chưa được whitelist đúng cách

## ✅ Giải Pháp Đã Áp Dụng

### 1. Tăng Mongoose Timeouts

**File: `api/index.js`**
```javascript
await mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000,  // ← Tăng lên
  socketTimeoutMS: 45000,            // ← Tăng lên
  connectTimeoutMS: 10000,           // ← Thêm mới
  bufferCommands: false,             // ← Disable buffering
  maxPoolSize: 5,
  minPoolSize: 1,
  maxIdleTimeMS: 60000
});

// Set query timeout globally
mongoose.set('bufferTimeoutMS', 20000); // ← Tăng từ 10s lên 20s
```

### 2. Tăng Vercel Function Timeout

**File: `vercel.json`**
```json
{
  "functions": {
    "api/*.js": {
      "memory": 1024,
      "maxDuration": 30  // ← Max cho Free plan
    }
  }
}
```

---

## 🔧 KIỂM TRA THÊM

### A. MongoDB Atlas Settings

#### 1. Cluster Status
- Vào MongoDB Atlas → Database
- Cluster phải **Active** (màu xanh)
- Nếu **Paused** → Resume cluster

#### 2. Network Access
- Vào Network Access
- **Phải có:** `0.0.0.0/0` (ALLOW ACCESS FROM ANYWHERE)
- Status: **Active**

**⚠️ Quan trọng:** 
- Không chỉ add `0.0.0.0/0`
- Đảm bảo không có rules khác chặn
- Delete các IP rules cũ nếu có

#### 3. Database User
- Vào Database Access
- User tồn tại và **Active**
- Password đúng (không có special chars hoặc đã encode)

### B. Connection String Format

**Kiểm tra MONGODB_URI trong Vercel:**

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```

**Checklist:**
- [ ] Có `mongodb+srv://` ở đầu
- [ ] Username đúng (không có `<>`)
- [ ] Password đúng (không có `<>`, không space)
- [ ] Cluster name đúng
- [ ] **Có `/DATABASE`** sau `.net` (ví dụ: `/hrdb`)
- [ ] Có `?retryWrites=true&w=majority`

**Ví dụ đúng:**
```
mongodb+srv://myuser:MyPass123@cluster0.abcde.mongodb.net/hrdb?retryWrites=true&w=majority
           ^^^^^^^  ^^^^^^^^^  ^^^^^^^^^^^^^^^^^^^^^^^^  ^^^^
           user     password   cluster domain            database
```

### C. Cluster Region

**Nếu quá chậm:**
- Cluster ở region xa (US, EU) → Latency cao
- **Giải pháp:** Migrate cluster về Singapore/Tokyo (gần VN hơn)

**Cách check:**
1. MongoDB Atlas → Database → Click cluster name
2. Xem **Region** (ví dụ: `ap-southeast-1` = Singapore ✅)

---

## 🧪 TEST NHANH

### Test 1: Ping Cluster
```bash
# Check latency đến MongoDB
ping cluster0.abcde.mongodb.net
```

### Test 2: Test Connection Local
```bash
cd hr-management-app/backend

node -e "const mongoose = require('mongoose'); mongoose.connect('YOUR_MONGODB_URI', {serverSelectionTimeoutMS: 5000}).then(() => console.log('✅ OK')).catch(e => console.log('❌', e.message))"
```

**Thay `YOUR_MONGODB_URI` bằng connection string thật.**

**Kết quả:**
- ✅ `OK` trong < 3 giây → Connection tốt
- ❌ Error hoặc > 5 giây → Có vấn đề

---

## 🔄 ALTERNATIVE SOLUTIONS

### Option 1: Tăng Timeout Hơn Nữa (Không khuyến khích)

```javascript
mongoose.set('bufferTimeoutMS', 30000); // 30 giây
```

**Nhược điểm:** Users phải đợi lâu

### Option 2: Warm-up Connection (Khuyến nghị)

Tạo cron job ping `/api/health` mỗi 5 phút để giữ connection warm.

**Service:** https://cron-job.org
- Schedule: Every 5 minutes
- URL: `https://human-resource-management-khaki.vercel.app/api/health`

### Option 3: Optimize MongoDB Atlas

1. Vào Cluster → Configuration
2. Enable **Auto-scale**: NO (giữ M0 Free)
3. Enable **Backups**: Optional
4. Reduce **Pause cluster**: Never

---

## 🎯 CHECKLIST FIX TIMEOUT

**Làm theo thứ tự:**

1. [ ] Code đã push (đã xong ✅)
2. [ ] Vercel đang deploy (chờ 2-3 phút ⏰)
3. [ ] MongoDB Atlas cluster **Active** (không Paused)
4. [ ] Network Access có `0.0.0.0/0` **Active**
5. [ ] Connection string đúng format (có `/hrdb`)
6. [ ] Password không có special chars (hoặc đã encode)
7. [ ] Test connection local (< 3 giây)
8. [ ] Cluster region gần VN (Singapore/Tokyo)

---

## 💡 TIP: Nếu Vẫn Timeout

### Temporary Workaround: Retry Logic

Khi login fail với timeout, **thử lại lần 2** (serverless function đã warm → nhanh hơn)

**Lần 1:** Cold start + DB connect → 10-15s (timeout)  
**Lần 2:** Warm function + cached DB → < 2s (success)

---

## ✅ EXPECTED RESULT

Sau khi fix + deploy xong:

**Login lần 1:** Có thể chậm (3-5s) nhưng **KHÔNG timeout**  
**Login lần 2+:** Rất nhanh (< 1s)

---

**Đợi 2-3 phút để Vercel deploy xong rồi test lại!** 🚀

