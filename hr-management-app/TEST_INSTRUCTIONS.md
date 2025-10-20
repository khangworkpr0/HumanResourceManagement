# 🧪 MongoDB Connection Test Instructions

## Quick Test

```bash
cd hr-management-app
node test-mongodb-connection.js
```

---

## What This Script Does

1. ✅ Loads environment variables from `backend/config.env`
2. ✅ Validates MONGODB_URI format
3. ✅ Connects to MongoDB Atlas with same options as Vercel
4. ✅ Tests actual database query (`User.findOne()`)
5. ✅ Counts documents
6. ✅ Verifies connection state

---

## Expected Output (SUCCESS):

```
============================================================
  MongoDB Atlas Connection Test
  Simulating Vercel Serverless Environment
============================================================

ℹ Step 1: Checking environment variables...
✅ MONGODB_URI found: mongodb+srv://username:****@cluster.net/humandb
ℹ Target database: humandb

ℹ Step 2: Connecting to MongoDB Atlas...
ℹ Using same options as Vercel deployment
ℹ Connection options:
  - serverSelectionTimeoutMS: 10000
  - socketTimeoutMS: 45000
  - family: 4
  - maxPoolSize: 10
  - minPoolSize: 1
  - retryWrites: true
  - w: majority

✅ Connected in 1234ms
✅ Host: ac-xbiubnm-shard-00-00.2hmguhe.mongodb.net
✅ Database: humandb
✅ ReadyState: 1 (1=connected)

ℹ Step 3: Testing database query...
ℹ Executing: User.findOne()
✅ Query executed successfully in 123ms
✅ Found user: test@example.com
User details: { id: '...', email: 'test@example.com', ... }

ℹ Step 4: Counting documents...
✅ Count query executed in 45ms
✅ Total users in database: 5

ℹ Step 5: Verifying connection state...
✅ Current state: connected (1)

✅ 🎉 ALL TESTS PASSED!

ℹ Connection is working correctly.
```

---

## If Test FAILS:

### Error: "MONGODB_URI not found"
**Fix:** Check `backend/config.env` file exists and has `MONGODB_URI=...`

### Error: "Connection failed"
**Possible causes:**
1. Wrong username/password in URI
2. IP not whitelisted on MongoDB Atlas
3. Network/firewall blocking connection
4. MongoDB cluster paused

**Check:**
```bash
# View your config
cat backend/config.env

# Test with curl
curl https://cloud.mongodb.com
```

### Error: "buffering timed out"
**This is THE BUG!** Means:
1. Connection succeeded BUT
2. Query ran before connection was ready OR
3. Database name is wrong

**Check logs for:**
- `Connected to: test` vs `URI specifies: humandb` ← MISMATCH!
- Fix: Update MONGODB_URI to include correct database name

---

## Compare Local vs Vercel

| Check | Local (this script) | Vercel |
|-------|-------------------|--------|
| **Connection** | Should succeed | Check logs |
| **Database name** | Should match URI | Check logs |
| **Query time** | < 1 second | Should be similar |
| **Error** | None | Should be none after fix |

---

## After Test Passes Locally

If local test ✅ PASSES but Vercel ❌ FAILS:

### 1. Check Vercel Environment Variables
```
Vercel Dashboard → Project → Settings → Environment Variables
```

Ensure:
- `MONGODB_URI` = **EXACT SAME** as local
- `JWT_SECRET` is set
- Applied to: **Production**

### 2. Check Vercel Logs
```bash
vercel logs --prod
```

Look for:
- Database name in logs
- Connection errors
- Timeout messages

### 3. Check MongoDB Atlas
```
MongoDB Atlas → Network Access → IP Access List
```

Ensure:
- `0.0.0.0/0` is in whitelist (allow all)
- Or add Vercel IPs

### 4. Redeploy Vercel
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

Or in Vercel Dashboard:
```
Deployments → Latest → ... → Redeploy
```

---

## Current Status (2024-10-15)

✅ **Commit 67a8874** deployed with:
- Proper async connection flow
- await connectDB() before loading routes
- Global bufferCommands = false
- Initialization middleware

**Expected result:** No more buffering timeout!

**If still failing:** Run this test script and share output!

---

## Troubleshooting Commands

```bash
# Check Node version (should be >= 18)
node --version

# Check Mongoose version
npm list mongoose

# Test connection only (no queries)
node -e "const m=require('mongoose');m.connect(process.env.MONGODB_URI).then(()=>console.log('OK')).catch(console.error)"

# View Vercel env vars (after linking)
vercel env pull

# Check if port is blocked
telnet cluster.mongodb.net 27017
```

---

## What to Share if Still Failing

1. Output of `node test-mongodb-connection.js`
2. Vercel deployment logs
3. MongoDB Atlas connection string format (masked password)
4. Any error messages

---

Good luck! 🍀


