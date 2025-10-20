@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo   🚀 VERCEL REDEPLOY - Fix bufferMaxEntries Error
echo ========================================================
echo.
echo 📋 Sửa lỗi: "option buffermaxentries is not supported"
echo.
echo ✅ Đã fix:
echo    - Update Mongoose 7.6.0 → 8.0.3
echo    - Xóa bufferMaxEntries option không hỗ trợ
echo.
echo ========================================================
echo.

REM Check if in correct directory
if not exist "api\package.json" (
    echo ❌ Lỗi: Không tìm thấy api\package.json
    echo 💡 Hãy chạy script này từ thư mục hr-management-app
    pause
    exit /b 1
)

echo 📝 Bước 1/4: Kiểm tra git status...
echo.
git status --short
echo.

echo ========================================================
echo 💾 Bước 2/4: Commit changes...
echo ========================================================
echo.

REM Add specific files
git add api/package.json
git add test-mongodb-connection.js
git add TEST_INSTRUCTIONS.md
git add VERCEL_REDEPLOY_INSTRUCTIONS.md
git add redeploy-vercel-fix.bat

echo Files đã stage:
git diff --cached --name-only
echo.

REM Commit
git commit -m "fix: Update Mongoose to 8.0.3 and remove unsupported bufferMaxEntries option"

if errorlevel 1 (
    echo.
    echo ⚠️  Không có thay đổi mới hoặc đã commit rồi
    echo.
) else (
    echo.
    echo ✅ Commit thành công!
    echo.
)

echo ========================================================
echo 🚀 Bước 3/4: Push to GitHub...
echo ========================================================
echo.

git push origin main

if errorlevel 1 (
    echo.
    echo ❌ Push failed! Kiểm tra lại kết nối hoặc credentials
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ✅ Push thành công!
    echo.
)

echo ========================================================
echo 🔄 Bước 4/4: Vercel Redeploy Instructions
echo ========================================================
echo.
echo Code đã được push lên GitHub!
echo Vercel sẽ tự động deploy nếu có auto-deploy.
echo.
echo 🔧 QUAN TRỌNG: Để fix lỗi hoàn toàn, bạn CẦN:
echo.
echo 1️⃣  Vào Vercel Dashboard:
echo    https://vercel.com/dashboard
echo.
echo 2️⃣  Chọn project HR Management
echo.
echo 3️⃣  Click "Deployments" → Latest → "..." → "Redeploy"
echo.
echo 4️⃣  ⚠️  BỎ TICK "Use existing Build Cache"
echo    (Để rebuild từ đầu với Mongoose mới)
echo.
echo 5️⃣  Click "Redeploy"
echo.
echo ========================================================
echo.
echo Hoặc deploy từ CLI:
echo.
echo   vercel --prod --force
echo.
echo ========================================================
echo.
echo ✅ Sau khi redeploy, kiểm tra:
echo.
echo    curl https://your-app.vercel.app/api/health
echo.
echo Kết quả mong đợi:
echo    "dbStatus": "connected"
echo    "dbReadyState": 1
echo.
echo ========================================================
echo.
echo 📖 Xem chi tiết: VERCEL_REDEPLOY_INSTRUCTIONS.md
echo.
echo ✨ DONE! Code đã sẵn sàng để deploy.
echo.

pause

