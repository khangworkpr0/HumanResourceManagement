# 🔧 FIX: "option buffermaxentries is not supported"

## ❌ Lỗi
```json
{
  "success": false,
  "message": "Service initialization failed",
  "error": "option buffermaxentries is not supported"
}
```

## 🎯 Nguyên nhân

1. **Mongoose version cũ**: API đang dùng `7.6.0`, backend dùng `8.0.3`
2. **Option lỗi thời**: `bufferMaxEntries` không còn hỗ trợ trong Mongoose 8.x

## ✅ Đã sửa

| File | Thay đổi |
|------|----------|
| `api/package.json` | Mongoose `7.6.0` → `8.0.3` |
| `test-mongodb-connection.js` | Xóa `bufferMaxEntries: 0` |
| `TEST_INSTRUCTIONS.md` | Cập nhật docs |

## 🚀 Cách deploy

### Tự động (Windows):
```bash
redeploy-vercel-fix.bat
```

### Thủ công:
```bash
# 1. Commit
git add .
git commit -m "fix: Update Mongoose and remove bufferMaxEntries"

# 2. Push
git push origin main

# 3. Redeploy Vercel
vercel --prod --force
```

### Từ Vercel Dashboard:
1. https://vercel.com/dashboard
2. Deployments → Latest → **Redeploy**
3. ⚠️ **BỎ TICK** "Use existing Build Cache"
4. Click Redeploy

## ✔️ Kiểm tra

```bash
curl https://your-app.vercel.app/api/health
```

Mong đợi:
```json
{
  "success": true,
  "dbStatus": "connected",
  "dbReadyState": 1
}
```

## 📁 Files liên quan

- `VERCEL_REDEPLOY_INSTRUCTIONS.md` - Hướng dẫn chi tiết
- `redeploy-vercel-fix.bat` - Auto deploy script
- `TEST_INSTRUCTIONS.md` - Test local

---

**Status:** ✅ READY TO DEPLOY  
**Date:** 2024-10-20  
**Mongoose:** 8.0.3

