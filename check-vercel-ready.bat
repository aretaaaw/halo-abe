@echo off
REM Halo ABE - Quick Vercel Deploy Script
REM This script prepares the project for Vercel deployment

echo.
echo ==========================================
echo  HALO ABE - VERCEL DEPLOYMENT CHECKER
echo ==========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not installed
    echo Install from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js installed
node --version

REM Check git
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git not installed
    echo Install from: https://git-scm.com/
    pause
    exit /b 1
)

echo [OK] Git installed
git --version

REM Check git remote
echo.
echo [CHECKING] Git remote...
git remote -v | findstr "origin"
if errorlevel 1 (
    echo [ERROR] No git remote 'origin' found
    echo Setup with: git remote add origin https://github.com/YOUR_USERNAME/halo-abe.git
    pause
    exit /b 1
)

echo.
echo [OK] Git remote configured
git remote -v

REM Check package.json
if not exist "package.json" (
    echo [ERROR] package.json not found
    pause
    exit /b 1
)

echo [OK] package.json found

REM Check .env.example
if not exist ".env.example" (
    echo [ERROR] .env.example not found
    pause
    exit /b 1
)

echo [OK] .env.example found

REM Check vercel.json
if not exist "vercel.json" (
    echo [ERROR] vercel.json not found
    pause
    exit /b 1
)

echo [OK] vercel.json found

REM Check API folder
if not exist "api" (
    echo [ERROR] api folder not found
    pause
    exit /b 1
)

echo [OK] API folder exists

REM Summary
echo.
echo ==========================================
echo   DEPLOYMENT READY!
echo ==========================================
echo.
echo Next steps:
echo.
echo 1. Go to: https://vercel.com
echo 2. Sign in with GitHub
echo 3. Create new project from repository
echo 4. Add environment variables:
echo    - MONGODB_URI: your_mongodb_connection_string
echo    - NODE_ENV: production
echo 5. Deploy
echo 6. Add custom domain in project settings
echo.
echo Full guide: DEPLOY-VERCEL.md
echo.
pause
