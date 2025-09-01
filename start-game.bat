@echo off
echo Starting Who's That? Game...
echo.

echo Installing dependencies if needed...
echo.

echo [1/4] Installing backend dependencies...
cd backend
if not exist node_modules (
    call npm install
)

echo.
echo [2/4] Installing frontend dependencies...
cd ..\frontend
if not exist node_modules (
    call npm install
)

echo.
echo [3/4] Starting backend server...
cd ..\backend
start "Backend Server" cmd /k "npm start"

echo.
echo [4/4] Starting frontend application...
cd ..\frontend
timeout /t 3 /nobreak > nul
start "Frontend App" cmd /k "npm start"

echo.
echo Game is starting!
echo Backend server: http://localhost:3001
echo Frontend app: http://localhost:3000
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the game.
echo.
pause
