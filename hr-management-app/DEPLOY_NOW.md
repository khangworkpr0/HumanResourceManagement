# 🚀 DEPLOY NGAY - 3 BƯỚC ĐƠN GIẢN

## ✅ Lỗi Đã Fix!

Lỗi **"Command npm run build exited with 1"** đã được fix bằng cách thêm script `vercel-build` vào `frontend/package.json`.

---

## 📝 3 BƯỚC DEPLOY

### **BƯỚC 1: Code Đã Push ✅**
```bash
✅ Code đã được commit và push lên GitHub
✅ Branch: features/update-filed
✅ Commit: "Fix Vercel build: Add vercel-build script"
```

### **BƯỚC 2: Deploy Trên Vercel**

#### **Cách 1: Auto Deploy (Nếu đã kết nối)** ⚡
- Vercel sẽ tự động deploy sau khi phát hiện code mới
- Chờ 2-5 phút
- ✅ Done!

#### **Cách 2: Manual Redeploy** 🔄
1. Vào https://vercel.com/dashboard
2. Chọn project của bạn
3. Tab **Deployments** → Click **"Redeploy"**

#### **Cách 3: Vercel CLI** 💻
```bash
cd hr-management-app
vercel --prod
```

### **BƯỚC 3: Kiểm Tra**

Test ngay sau khi deploy:
```bash
# Test API health
curl https://your-app.vercel.app/api/health

# Hoặc mở trình duyệt:
https://your-app.vercel.app
```

---

## ⚙️ QUAN TRỌNG: Environment Variables

Đảm bảo đã set trong **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrdb?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-min-32-characters-long
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
```

**MongoDB Atlas:**
- Network Access → Add IP → `0.0.0.0/0` (Allow all)

---

## 🎯 Vercel Settings

Khi setup project lần đầu:

| Setting | Value |
|---------|-------|
| **Root Directory** | `hr-management-app` |
| **Framework Preset** | Other |
| **Build Command** | (để trống) |
| **Output Directory** | (để trống) |
| **Install Command** | npm install |

---

## 🐛 Troubleshooting

### Nếu build vẫn fail:
1. Check **Build Logs** trên Vercel
2. Đảm bảo Root Directory = `hr-management-app`
3. Redeploy lại

### Nếu API không kết nối DB:
1. Check MONGODB_URI có đúng không
2. MongoDB Atlas → Network Access → Whitelist `0.0.0.0/0`
3. Redeploy

### Nếu 404 trên routes:
- Đảm bảo file `vercel.json` đúng
- Check Routes configuration

---

## ✅ Checklist

- [ ] Code đã push lên GitHub ✅
- [ ] Environment Variables đã set trên Vercel
- [ ] MongoDB Atlas đã whitelist IP 0.0.0.0/0
- [ ] Root Directory = `hr-management-app`
- [ ] Deploy/Redeploy
- [ ] Test `/api/health`
- [ ] Test frontend routes

---

## 🎉 XONG!

Sau khi deploy thành công, app sẽ chạy tại:
- **Frontend**: https://your-app.vercel.app
- **API**: https://your-app.vercel.app/api/*
- **Health Check**: https://your-app.vercel.app/api/health

---

**Need help?** Check `FIX_VERCEL_BUILD_ERROR.md` for detailed guide.

