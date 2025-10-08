# 🔐 Vercel Environment Variables - Quick Guide

## 📋 Variables Cần Set

Copy và paste các values sau vào **Vercel Dashboard** → **Settings** → **Environment Variables**

---

### 1️⃣ MONGODB_URI (Required)

**Name**: `MONGODB_URI`

**Value**:
```
mongodb+srv://khua8986_db_user:MQ2FXE9phRNFkgGJ@cluster0.3ohoovb.mongodb.net/hrms?retryWrites=true&w=majority&appName=Cluster0
```

**Environments**: 
- ☑️ Production
- ☑️ Preview  
- ☑️ Development

---

### 2️⃣ JWT_SECRET (Required)

**Name**: `JWT_SECRET`

**Option A - Generate Random** (Khuyến nghị):
```bash
# Run this command to generate:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option B - Use This**:
```
hr-management-system-super-secret-jwt-key-2025-production-deployment
```

**Environments**: 
- ☑️ Production
- ☑️ Preview  
- ☑️ Development

---

### 3️⃣ NODE_ENV (Required)

**Name**: `NODE_ENV`

**Value**:
```
production
```

**Environments**: 
- ☑️ Production **ONLY**

---

### 4️⃣ CLIENT_URL (Optional)

**Name**: `CLIENT_URL`

**Value** (update sau khi deploy):
```
https://yourapp.vercel.app
```

Thay `yourapp` bằng tên project thực tế của bạn.

**Environments**: 
- ☑️ Production
- ☑️ Preview  
- ☑️ Development

---

## 🚀 Quick Setup Steps

### Via Vercel Dashboard:

1. **Login** → [vercel.com](https://vercel.com)

2. **Select Project** → **Settings** → **Environment Variables**

3. **Add Each Variable**:
   ```
   Click "Add" button
   → Enter Name
   → Paste Value
   → Select Environments
   → Click "Save"
   ```

4. **Repeat** for all 4 variables (minimum 3: MONGODB_URI, JWT_SECRET, NODE_ENV)

5. **Redeploy**:
   ```
   Deployments → Latest deployment → ... → Redeploy
   ```

---

### Via Vercel CLI (Alternative):

```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Add variables
vercel env add MONGODB_URI production
# Paste: mongodb+srv://khua8986_db_user:MQ2FXE9phRNFkgGJ@cluster0.3ohoovb.mongodb.net/hrms?retryWrites=true&w=majority&appName=Cluster0

vercel env add JWT_SECRET production
# Paste: your-secret-key

vercel env add NODE_ENV production
# Type: production

# Deploy
vercel --prod
```

---

## ✅ Verify Setup

After deployment, test:

```bash
curl https://yourapp.vercel.app/api/health
```

**Expected**:
```json
{
  "success": true,
  "dbStatus": "connected"  ← ✅ Must be "connected"
}
```

---

## ⚠️ Important Notes

1. **MongoDB Network Access**: Ensure `0.0.0.0/0` is whitelisted
2. **No Spaces**: Copy/paste carefully, no extra spaces
3. **Database Name**: `hrms` is included in connection string
4. **Redeploy**: Always redeploy after adding/changing env vars

---

**See Also**:
- `MONGODB_SETUP_COMPLETE.md` - Full MongoDB setup guide
- `DEPLOYMENT_READY.md` - Complete deployment guide

