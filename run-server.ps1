# Start Halo ABE Server
# Run this from PowerShell to start the backend server

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$scriptPath\backend"

Write-Host "Starting Halo ABE Server..." -ForegroundColor Green
Write-Host "URL: http://localhost:8080" -ForegroundColor Yellow
Write-Host ""

& node .\server-simple.js

Read-Host "Press any key to exit..."
