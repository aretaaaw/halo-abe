@echo off
REM ============================================
REM Halo ABE - Automatic Setup & Run Script
REM ============================================
REM This script will:
REM 1. Check Node.js installation
REM 2. Install dependencies
REM 3. Start the server
REM ============================================

echo.
echo ========================================
echo   Halo ABE - Automatic Setup
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/4] Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Node.js not found in PATH
    echo.
    echo Please install Node.js first:
    echo   1. Download from https://nodejs.org/en/download/
    echo   2. Run the installer
    echo   3. Restart this script
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% found

REM Check if npm is installed
echo.
echo [2/4] Checking npm installation...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm not found in PATH
    echo Please reinstall Node.js
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% found

REM Navigate to backend directory
echo.
echo [3/4] Installing dependencies...
cd /d "%~dp0backend"

REM Check if node_modules exists
if exist node_modules (
    echo [OK] Dependencies already installed
) else (
    echo Installing npm packages...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully
)

REM Start the server
echo.
echo [4/4] Starting Halo ABE Server...
echo.
echo ========================================
echo   Server running at: http://localhost:8080
echo   
echo   Open browser and go to:
echo   http://localhost:8080/login/register.html
echo   
echo   Press Ctrl+C to stop the server
echo ========================================
echo.

call node server-simple.js

pause
