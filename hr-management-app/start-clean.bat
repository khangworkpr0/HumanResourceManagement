@echo off
echo 🧹 Cleaning up existing processes...
taskkill /f /im node.exe 2>nul
echo.
echo ⏳ Waiting 3 seconds...
timeout /t 3 /nobreak >nul
echo.
echo 🚀 Starting Backend Server...
start "Backend" cmd /k "cd backend && npm start"
echo.
echo ⏳ Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul
echo.
echo 🚀 Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && set HOST=0.0.0.0 && npm start"
echo.
echo ✅ Both servers are starting...
echo.
echo 🌐 Access URLs:
echo    Local:    http://localhost:3000
echo    Network: http://192.168.0.164:3000
echo.
echo 📱 Other devices can access: http://192.168.0.164:3000
echo.
echo 🔍 Check the terminal windows for any errors
echo.
pause
