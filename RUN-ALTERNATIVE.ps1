# Halo ABE - Direct Node.js Finder
# Cari node.exe di mana pun, terus jalankan server

$ErrorActionPreference = "SilentlyContinue"

Write-Host "`n" -ForegroundColor White
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  HALO ABE - Server Startup (Smart Finder)" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor White

# Step 1: Find Node.js
Write-Host "[STEP 1] Cari Node.js..." -ForegroundColor Yellow

$nodeExe = $null

# Cek PATH dulu
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCmd) {
    $nodeExe = $nodeCmd.Source
    Write-Host "[OK] Node.js ditemukan di PATH:" -ForegroundColor Green
    Write-Host "     $nodeExe" -ForegroundColor Green
} else {
    # Cek common paths
    $commonPaths = @(
        "C:\Program Files\nodejs\node.exe",
        "C:\Program Files (x86)\nodejs\node.exe",
        "$env:APPDATA\nodejs\node.exe",
        "D:\nodejs\node.exe",
        "E:\nodejs\node.exe",
        "$env:USERPROFILE\nodejs\node.exe",
        "C:\Users\$env:USERNAME\AppData\Local\Programs\nodejs\node.exe"
    )
    
    Write-Host "[INFO] Cari di folder umum..." -ForegroundColor Yellow
    
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            $nodeExe = $path
            Write-Host "[OK] Node.js ditemukan:" -ForegroundColor Green
            Write-Host "     $nodeExe" -ForegroundColor Green
            break
        }
    }
}

# Kalo tidak ketemu
if (-not $nodeExe) {
    Write-Host "`n[ERROR] Node.js tidak ditemukan!" -ForegroundColor Red
    Write-Host "`nSOLUSI 1 - Download Node.js Portable (REKOMENDASI):" -ForegroundColor Yellow
    Write-Host "  1. Buka: https://nodejs.org/en/download/" -ForegroundColor White
    Write-Host "  2. Pilih 'Windows Binary (.zip)' - BUKAN installer" -ForegroundColor White
    Write-Host "  3. Extract ke: C:\nodejs\" -ForegroundColor White
    Write-Host "  4. Jalankan script ini lagi" -ForegroundColor White
    Write-Host "`nSOLUSI 2 - Download Official Installer:" -ForegroundColor Yellow
    Write-Host "  1. Buka: https://nodejs.org/en/download/" -ForegroundColor White
    Write-Host "  2. Download LTS versi (.msi)" -ForegroundColor White
    Write-Host "  3. Jalankan, klik Next-Next" -ForegroundColor White
    Write-Host "  4. RESTART KOMPUTER" -ForegroundColor Red
    Write-Host "  5. Jalankan script ini lagi" -ForegroundColor White
    Write-Host "`nSOLUSI 3 - Cek instalasi:" -ForegroundColor Yellow
    Write-Host "  1. Buka Command Prompt (cmd.exe)" -ForegroundColor White
    Write-Host "  2. Ketik: node --version" -ForegroundColor White
    Write-Host "  3. Ketik: npm --version" -ForegroundColor White
    Write-Host "  4. Jika OK, tutup dan coba script ini lagi" -ForegroundColor White
    Write-Host "`n"
    Read-Host "Tekan Enter untuk exit"
    exit 1
}

# Step 2: Go to backend
Write-Host "`n[STEP 2] Setup backend..." -ForegroundColor Yellow

$backendPath = Join-Path (Get-Location) "backend"

if (-not (Test-Path $backendPath)) {
    $backendPath = Join-Path (Split-Path -Parent $PSCommandPath) "backend"
}

if (-not (Test-Path "$backendPath\package.json")) {
    Write-Host "[ERROR] backend\package.json tidak ditemukan!" -ForegroundColor Red
    Read-Host "Tekan Enter untuk exit"
    exit 1
}

Set-Location $backendPath
Write-Host "[OK] Backend folder: $backendPath" -ForegroundColor Green

# Step 3: Install dependencies
Write-Host "`n[STEP 3] Cek dependencies..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "[INSTALL] Install dependencies..." -ForegroundColor Yellow
    
    # Get npm path
    $npmDir = Split-Path -Parent $nodeExe
    $npmCmd = Join-Path $npmDir "npm.cmd"
    
    if (-not (Test-Path $npmCmd)) {
        $npmCmd = Join-Path $npmDir "npm"
    }
    
    if (-not (Test-Path $npmCmd)) {
        Write-Host "[ERROR] npm tidak ditemukan!" -ForegroundColor Red
        Read-Host "Tekan Enter untuk exit"
        exit 1
    }
    
    & $npmCmd install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Gagal install dependencies" -ForegroundColor Red
        Read-Host "Tekan Enter untuk exit"
        exit 1
    }
}

Write-Host "[OK] Dependencies siap" -ForegroundColor Green

# Step 4: Start server
Write-Host "`n" -ForegroundColor White
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "  [STEP 4] STARTING SERVER" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "`n  Server akan jalan di: http://localhost:8080`n" -ForegroundColor Cyan
Write-Host "  BUKA BROWSER dan kunjungi:" -ForegroundColor Yellow
Write-Host "  http://localhost:8080/login/register.html`n" -ForegroundColor White
Write-Host "  Tekan Ctrl+C untuk stop server`n" -ForegroundColor Yellow
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "`n" -ForegroundColor White

& $nodeExe server-simple.js

Write-Host "`n[INFO] Server stopped" -ForegroundColor Yellow
Read-Host "Tekan Enter untuk exit"
