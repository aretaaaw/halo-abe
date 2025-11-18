# 🔧 TROUBLESHOOTING: Localhost Refused to Connect

## 🎯 Root Causes Identified

### Problem 1: Node.js Environment Not Recognized
**Status**: ⚠️ CRITICAL

PowerShell session tidak recognize `npm` atau `node` command meskipun sudah diinstall.

**Penyebab:**
- Node.js diinstall tapi PATH belum terupdate di PowerShell session saat ini
- Perlu restart terminal atau system
- Atau Node.js installation incomplete

**Solution:**

### Option A: Restart System (RECOMMENDED)
```
1. Tutup semua terminal/PowerShell
2. Restart PC
3. Buka terminal baru
4. Coba npm --version (akan ketemu)
```

**Waktu**: 2-5 menit  
**Keberhasilan**: 95%

---

### Option B: Gunakan Node.js Installer dari Browser

Jika restart tidak work:

1. **Download Node.js LTS** dari https://nodejs.org/en/download/
2. **Run installer** (.msi file) 
3. **Follow wizard** (pilih default options)
4. **Restart PC**
5. **Buka PowerShell baru** dan coba:
   ```powershell
   npm --version
   node --version
   ```

**Waktu**: 5-10 menit  
**Keberhasilan**: 99%

---

### Option C: Find Node Installation Path

Jika ingin cari path manual:

```powershell
# Check predefined locations
Test-Path "C:\Program Files\nodejs\"
Test-Path "C:\Program Files (x86)\nodejs\"
Test-Path "C:\Users\$env:USERNAME\AppData\Local\Programs\nodejs\"

# List folder jika ada
dir "C:\Program Files\nodejs\" -ErrorAction SilentlyContinue
```

---

## 🚀 Setelah Node.js Berfungsi

### Step 1: Install Backend Dependencies
```powershell
cd D:\halo-abe\backend
npm install
```

**Output yang diharapkan:**
```
added 150 packages in 45s
```

### Step 2: Start Server
```powershell
npm run dev
```

**Output yang diharapkan:**
```
Backend berjalan di http://localhost:8080
```

### Step 3: Test di Browser
Buka: **http://localhost:8080**

**Harapan**: Akan redirect ke `/login/login.html`

---

## ✅ Verification Checklist

Sebelum test, pastikan:

- [ ] Restart PC (atau close all terminals)
- [ ] `npm --version` menampilkan versi (bukan error)
- [ ] `node --version` menampilkan versi
- [ ] `cd D:\halo-abe\backend`
- [ ] `npm install` berhasil
- [ ] `npm run dev` berjalan tanpa error
- [ ] Browser: `http://localhost:8080` → tidak refused to connect

---

## 🔍 Diagnostic Commands

Jika masih error, jalankan ini untuk debug:

```powershell
# Check Node installation
node --version
npm --version
npm list -g

# Check dependencies installed
cd D:\halo-abe\backend
npm list

# Check port 8080
netstat -ano | findstr :8080

# Check if server can start
node server-simple.js
```

---

## 🆘 Common Errors & Solutions

### Error 1: "npm: command not found"
**Penyebab**: Node.js tidak terinstall atau PATH salah  
**Solusi**: 
1. Download & install dari https://nodejs.org/
2. Restart PC
3. Coba lagi

---

### Error 2: "ERR! code ENOENT" (saat npm install)
**Penyebab**: File package.json tidak ditemukan  
**Solusi**:
```powershell
# Pastikan di folder yang benar
cd D:\halo-abe\backend
ls package.json  # Harus ada filenya
```

---

### Error 3: "Port 8080 already in use"
**Penyebab**: Server lain sudah pakai port 8080  
**Solusi**:
```powershell
# Kill proses yang pakai port 8080
netstat -ano | findstr :8080
# Catat PID, lalu:
taskkill /PID <PID> /F

# Atau ganti port di server-simple.js
# Ubah: app.listen(8080, ...)
# Menjadi: app.listen(3000, ...)
```

---

### Error 4: "Cannot GET /pages/halo.html"
**Penyebab**: Belum login  
**Solusi**: Login dulu di `/login/login.html`

---

## 📊 Perbandingan: Halo ABE vs Web-Mari-Aktif

| Aspek | Halo ABE | Web-Mari-Aktif |
|-------|----------|--------|
| Node.js Installed | ✓ (belum recognized) | ✓ (working) |
| npm PATH Set | ✗ | ✓ |
| Dependencies Installed | ? (belum verified) | ✓ |
| Server Can Start | ? | ✓ |
| Localhost Working | ✗ (refused to connect) | ✓ (port 3000) |

**Key Difference**: Environment configuration

---

## ✨ Quick Fix Checklist

```bash
# 1. Restart PC

# 2. Open new terminal (PowerShell or CMD)

# 3. Verify Node installed
node --version

# 4. Go to project
cd D:\halo-abe\backend

# 5. Install dependencies  
npm install

# 6. Start server
npm run dev

# 7. Open browser
# http://localhost:8080
```

---

## 📞 Support

### Jika semua sudah dilakukan tapi masih tidak jalan:

1. **Cek error message** di terminal saat npm run dev
2. **Screenshot error** dan cek:
   - Folder structure ada?
   - File server-simple.js ada?
   - package.json complete?
3. **Coba dari folder** `D:\halo-abe\contoh\web-mari-aktif`
   - `npm install`
   - `npm run dev`
   - Ini seharusnya work (referensi project)

---

## 🎯 Next Steps

### Jika Berhasil:
1. ✅ Server running di localhost:8080
2. ✅ Test register/login
3. ✅ Celebrate! 🎉

### Jika Gagal:
1. Follow troubleshooting steps
2. Restart system
3. Try again with fresh terminal
4. Document error & report

---

**Last Updated**: November 18, 2025  
**Status**: Diagnosis Complete - Solution Ready

