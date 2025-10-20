@echo off
chcp 65001 >nul
cls
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║  🔐 MongoDB Authentication Error - Debug Tool            ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo Error: "bad auth : authentication failed"
echo.
echo Đây là lỗi XÁC THỰC - Username/Password không đúng!
echo.
echo ════════════════════════════════════════════════════════════
echo.

REM Check if in correct directory
if not exist "backend\config.env" (
    echo ❌ Không tìm thấy backend\config.env
    echo 💡 Hãy chạy script này từ thư mục hr-management-app
    pause
    exit /b 1
)

echo 📝 Bước 1: Kiểm tra MONGODB_URI local...
echo.

REM Check if MONGODB_URI exists in config.env
findstr /C:"MONGODB_URI" backend\config.env >nul 2>&1
if errorlevel 1 (
    echo ❌ KHÔNG tìm thấy MONGODB_URI trong backend\config.env
    echo.
    echo 💡 Thêm dòng này vào file backend\config.env:
    echo    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/humandb?retryWrites=true^&w=majority
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Tìm thấy MONGODB_URI trong config.env
    echo.
    echo URI hiện tại (che password):
    for /f "tokens=1,* delims==" %%a in ('findstr /C:"MONGODB_URI" backend\config.env') do (
        set uri=%%b
    )
    echo    !uri:~0,30!****
    echo.
)

echo ════════════════════════════════════════════════════════════
echo 📋 Bước 2: Test kết nối MongoDB local...
echo ════════════════════════════════════════════════════════════
echo.
echo Đang test connection...
echo.

node test-mongodb-connection.js

if errorlevel 1 (
    echo.
    echo ════════════════════════════════════════════════════════════
    echo ❌ LOCAL TEST FAILED!
    echo ════════════════════════════════════════════════════════════
    echo.
    echo VẤN ĐỀ: MONGODB_URI trong backend\config.env SAI!
    echo.
    echo 🔧 CÁCH SỬA:
    echo.
    echo 1️⃣  Vào MongoDB Atlas:
    echo    https://cloud.mongodb.com/
    echo.
    echo 2️⃣  Tạo Database User mới:
    echo    • Database Access ^> Add New Database User
    echo    • Username: hrapp_user
    echo    • Password: Auto-generate ^(copy ngay!^)
    echo    • Role: Read and write to any database
    echo.
    echo 3️⃣  Get Connection String:
    echo    • Clusters ^> Connect ^> Connect your application
    echo    • Copy connection string
    echo    • Thay ^<password^> bằng password thật
    echo    • Thêm /humandb trước dấu ?
    echo.
    echo 4️⃣  Update backend\config.env:
    echo    MONGODB_URI=mongodb+srv://hrapp_user:PASSWORD@cluster.mongodb.net/humandb?retryWrites=true^&w=majority
    echo.
    echo 5️⃣  Chạy lại script này để test
    echo.
    echo ════════════════════════════════════════════════════════════
    echo 📖 Chi tiết: FIX_MONGODB_AUTH_ERROR.md
    echo ════════════════════════════════════════════════════════════
    echo.
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════
echo ✅ LOCAL TEST PASSED!
echo ════════════════════════════════════════════════════════════
echo.
echo Local connection OK! Vấn đề ở VERCEL Environment Variables.
echo.
echo 🔧 CÁCH SỬA:
echo.
echo 1️⃣  Copy MONGODB_URI từ local:
echo.

for /f "tokens=1,* delims==" %%a in ('findstr /C:"MONGODB_URI" backend\config.env') do (
    echo    %%b
)

echo.
echo 2️⃣  Vào Vercel Dashboard:
echo    https://vercel.com/dashboard
echo.
echo 3️⃣  Project ^> Settings ^> Environment Variables
echo.
echo 4️⃣  Xóa MONGODB_URI cũ (nếu có)
echo.
echo 5️⃣  Add New:
echo    • Name: MONGODB_URI
echo    • Value: ^(paste URI từ bước 1^)
echo    • Environment: ✅ Production, Preview, Development
echo    • Click Save
echo.
echo 6️⃣  Redeploy:
echo    • Deployments ^> Latest ^> Redeploy
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo ⚠️  CHÚ Ý:
echo    - Copy CHÍNH XÁC URI từ backend\config.env
echo    - KHÔNG có khoảng trắng đầu/cuối
echo    - PHẢI redeploy sau khi set env vars
echo.
echo ════════════════════════════════════════════════════════════
echo 📖 Hướng dẫn chi tiết: FIX_MONGODB_AUTH_ERROR.md
echo ════════════════════════════════════════════════════════════
echo.

pause

