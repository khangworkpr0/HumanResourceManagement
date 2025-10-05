@echo off
echo 🌐 Starting HR Management System for Network Access...
echo.
echo 📍 Your IP Address: 192.168.0.164
echo.
echo 🚀 Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"
echo.
echo ⏳ Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul
echo.
echo 🚀 Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"
echo.
echo ✅ Both servers are starting...
echo.
echo 🌐 Access URLs:
echo    Frontend: http://192.168.0.164:3000
echo    Backend:  http://192.168.0.164:5000
echo.
echo 📱 Other devices on the same network can access:
echo    http://192.168.0.164:3000
echo.
pause
