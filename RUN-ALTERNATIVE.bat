@echo off
REM =====================================================
REM HALO ABE - SUPER STARTUP SCRIPT (Find Node Anywhere)
REM =====================================================
REM Cari Node.js di sistem, kalo nggk ada di PATH
REM =====================================================

setlocal enabledelayedexpansion

title HALO ABE Server

echo.
echo =====================================================
echo   HALO ABE - Server Startup
echo =====================================================
echo.

REM Common Node.js paths
set "PATHS_TO_CHECK="
set "PATHS_TO_CHECK=!PATHS_TO_CHECK!C:\Program Files\nodejs"
set "PATHS_TO_CHECK=!PATHS_TO_CHECK! C:\Program Files (x86)\nodejs"
set "PATHS_TO_CHECK=!PATHS_TO_CHECK! C:\Users\%USERNAME%\AppData\Local\Programs\nodejs"
set "PATHS_TO_CHECK=!PATHS_TO_CHECK! D:\nodejs"
set "PATHS_TO_CHECK=!PATHS_TO_CHECK! E:\nodejs"

set "NODE_FOUND="

echo [STEP 1] Cari Node.js...
echo.

REM Check PATH first
where node >nul 2>nul
if !errorlevel! equ 0 (
    for /f "tokens=*" %%i in ('where node') do set "NODE_FOUND=%%i"
    echo [OK] Node.js ditemukan di PATH: !NODE_FOUND!
    goto :HAVE_NODE
)

echo [INFO] Node.js tidak ada di PATH, cari di folder umum...
echo.

REM Search common paths
for %%p in (!PATHS_TO_CHECK!) do (
    if exist "%%p\node.exe" (
        set "NODE_FOUND=%%p\node.exe"
        echo [OK] Node.js ditemukan: !NODE_FOUND!
        goto :HAVE_NODE
    )
)

REM If still not found, show options
echo.
echo [ERROR] Node.js tidak ditemukan!
echo.
echo SOLUSI 1 - Download Node.js Portable (REKOMENDASI):
echo   1. Buka: https://nodejs.org/en/download/
echo   2. Pilih "Windows Binary (.zip)" bukan installer
echo   3. Extract ke: C:\nodejs\
echo   4. Jalankan script ini lagi
echo.
echo SOLUSI 2 - Download Official Installer:
echo   1. Buka: https://nodejs.org/en/download/
echo   2. Download versi LTS (.msi)
echo   3. Jalankan installer, klik Next-Next
echo   4. RESTART KOMPUTER
echo   5. Jalankan script ini lagi
echo.
echo SOLUSI 3 - Verifikasi instalasi:
echo   1. Buka Command Prompt (cmd.exe)
echo   2. Ketik: node --version
echo   3. Ketik: npm --version
echo   4. Jika muncul versi, tutup dan coba lagi script ini
echo.
pause
exit /b 1

:HAVE_NODE
echo.
echo [STEP 2] Setup backend...
echo.

REM Go to backend folder
cd /d "%~dp0backend"

if not exist package.json (
    echo ERROR: package.json tidak ditemukan di backend folder!
    pause
    exit /b 1
)

echo [OK] Backend folder: %cd%
echo.

REM Install dependencies
if not exist node_modules (
    echo [INSTALL] Sedang install dependencies...
    "!NODE_FOUND!" -e "console.log(require('path').dirname(process.execPath))" > node_path.txt
    set /p NODE_DIR=<node_path.txt
    del node_path.txt
    
    if exist "!NODE_DIR!\npm.cmd" (
        "!NODE_DIR!\npm.cmd" install
    ) else if exist "!NODE_DIR!\npm" (
        "!NODE_DIR!\npm" install
    ) else (
        echo ERROR: npm tidak ditemukan
        pause
        exit /b 1
    )
    
    if !errorlevel! neq 0 (
        echo ERROR: Gagal install dependencies
        pause
        exit /b 1
    )
)

echo [OK] Dependencies siap
echo.
echo =====================================================
echo   [STEP 3] STARTING SERVER
echo =====================================================
echo.
echo   Server akan jalan di: http://localhost:8080
echo.
echo   BUKA BROWSER dan kunjungi:
echo   http://localhost:8080/login/register.html
echo.
echo   TEKAN Ctrl+C untuk stop server
echo.
echo =====================================================
echo.

"!NODE_FOUND!" server-simple.js

if !errorlevel! neq 0 (
    echo.
    echo ERROR: Server gagal jalan
    echo Tekan sembarang tombol untuk exit...
    pause
    exit /b 1
)

pause
