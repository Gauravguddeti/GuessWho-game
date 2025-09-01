#!/usr/bin/env pwsh

Write-Host "🎯 Starting Who's That? Game..." -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow

# Install backend dependencies if needed
if (!(Test-Path "backend/node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Blue
    Set-Location backend
    npm install
    Set-Location ..
}

# Install frontend dependencies if needed  
if (!(Test-Path "frontend/node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Blue
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host "✅ Dependencies ready!" -ForegroundColor Green
Write-Host ""

# Start backend server in new window
Write-Host "🚀 Starting backend server..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'backend'; npm start" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep 3

# Start frontend in new window
Write-Host "🌐 Starting frontend application..." -ForegroundColor Blue  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'frontend'; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "🎉 Game is starting!" -ForegroundColor Green
Write-Host "🔗 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔗 Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Both servers are running in separate windows."
Write-Host "📋 Close those windows to stop the servers."
Write-Host ""
Write-Host "🎮 Enjoy playing Who's That? with your friends!" -ForegroundColor Magenta

Read-Host "Press Enter to close this window"
