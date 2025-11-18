# ============================================
# Halo ABE - Automatic Setup & Run Script
# ============================================
# Run this script to automatically:
# 1. Check Node.js & npm installation
# 2. Install dependencies
# 3. Start the server

# Allow script execution if needed
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "   Halo ABE - Automatic Setup" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

# Step 1: Check Node.js
Write-Host "[1/4] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = & node --version 2>$null
    Write-Host "[OK] Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js not found in PATH" -ForegroundColor Red
    Write-Host "`nPlease install Node.js:" -ForegroundColor Yellow
    Write-Host "  1. Download from https://nodejs.org/en/download/" 
    Write-Host "  2. Run the installer"
    Write-Host "  3. Restart this script`n"
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Check npm
Write-Host "`n[2/4] Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = & npm --version 2>$null
    Write-Host "[OK] npm $npmVersion found" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm not found in PATH" -ForegroundColor Red
    Write-Host "Please reinstall Node.js`n" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 3: Install dependencies
Write-Host "`n[3/4] Installing dependencies..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
Set-Location $backendPath

if (Test-Path "node_modules") {
    Write-Host "[OK] Dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "Installing npm packages..." -ForegroundColor Cyan
    & npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[OK] Dependencies installed successfully" -ForegroundColor Green
}

# Step 4: Start server
Write-Host "`n[4/4] Starting Halo ABE Server...`n" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Server running at: http://localhost:8080" -ForegroundColor Green
Write-Host "" -ForegroundColor Cyan
Write-Host "   Open browser and go to:" -ForegroundColor Cyan
Write-Host "   http://localhost:8080/login/register.html" -ForegroundColor Green
Write-Host "" -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

& node .\server-simple.js

Write-Host "`nServer stopped. Press Enter to exit..." -ForegroundColor Yellow
Read-Host
