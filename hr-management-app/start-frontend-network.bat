@echo off
echo 🚀 Starting Frontend with Network Access...
echo.
echo 📍 Frontend will be accessible at: http://192.168.0.164:3000
echo.
set HOST=0.0.0.0
set PORT=3000
set REACT_APP_API_URL=http://192.168.0.164:5000
echo.
echo 🌐 Starting React development server...
npm start
