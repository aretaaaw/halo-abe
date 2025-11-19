# 🚀 QUICK START - Halo ABE

## ⚡ FASTEST WAY (Recommended)

### **UPDATE: Bug Session Reload Sudah Diperbaiki! ✅**

Masalah: Saat reload halaman, malah redirect ke login (seolah logout sendiri)

**Penyebab**: Session cookie tidak ter-persist dengan benar

**Status**: **FIXED** ✅ - Silakan test ulangi!

---

### **Option 1: Smart Script** (Cari Node.js Otomatis) ⭐ **COBA INI DULU**
```
1. Go to D:\halo-abe\
2. Double-click: RUN-ALTERNATIVE.bat
3. Script akan cari Node.js di mana pun
4. Tunggu "Server running at http://localhost:8080"
5. Buka browser → http://localhost:8080/login/register.html
```

### **Option 2: PowerShell Smart Script**
```powershell
# Buka PowerShell di D:\halo-abe\
# Run:
.\RUN-ALTERNATIVE.ps1
```

### **Option 3: Original Setup Script**
```
1. Double-click: setup-and-run.bat
2. Atau di PowerShell: .\setup-and-run.ps1
```

### **Option 3: Manual npm**
```bash
# Open Command Prompt or PowerShell
cd D:\halo-abe\backend
npm install
npm run dev
```

---

## 📋 WHAT HAPPENS AUTOMATICALLY

1. ✅ Checks Node.js is installed
2. ✅ Checks npm is installed  
3. ✅ Installs missing dependencies
4. ✅ Starts server on port 8080
5. ✅ Shows access URL

---

## 🔧 IF SCRIPT FAILS

### **Error: Node.js not found** (Most Common)
```
Script akan otomatis cari Node.js di sistem.
Jika tidak ketemu, ikuti SOLUSI INI:

SOLUSI 1 - Download Node.js Portable (TERBAIK):
1. Buka: https://nodejs.org/en/download/
2. SCROLL KE BAWAH, cari "Windows Binary (.zip)"
   (BUKAN installer .msi, BUKAN .exe)
3. Pilih sesuai OS:
   - Windows 64-bit: node-v20.x.x-win-x64.zip
   - Windows 32-bit: node-v20.x.x-win-x86.zip
4. Download dan extract ke: C:\nodejs\
5. Cek: Buka C:\nodejs\ - harus ada file node.exe
6. Jalankan script RUN-ALTERNATIVE.bat lagi

SOLUSI 2 - Download Official Installer (.msi):
1. Buka: https://nodejs.org/en/download/
2. Download LTS versi (.msi) - bukan .zip
3. Jalankan installer, klik NEXT TERUS
4. Tunggu sampai "Finish"
5. **RESTART KOMPUTER** (PENTING!)
6. Buka PowerShell baru
7. Ketik: node --version
8. Jika keluar versi, coba script lagi

SOLUSI 3 - Verify Installation:
1. Buka Command Prompt (cmd.exe)
2. Ketik: node --version
3. Ketik: npm --version
4. Jika kedua-duanya keluar versi, berarti sudah OK
   Coba jalankan script RUN-ALTERNATIVE.bat lagi
```

### **Error: npm not found**
```
Biasanya npm sudah included dengan Node.js.
Coba:
1. Uninstall Node.js dari Control Panel
2. Restart komputer
3. Download ulang dari https://nodejs.org/en/download/
4. Install menggunakan installer (.msi)
5. Restart komputer lagi
6. Coba script lagi
```

### **Error: Port 8080 already in use**
```
Solution 1: Close other applications using port 8080
Solution 2: Change port in backend/server-simple.js
            Find: app.listen(8080, ...)
            Change to: app.listen(3000, ...)
```

### **Error: Dependencies not found**
```
Solution:
1. Delete: D:\halo-abe\backend\node_modules (if exists)
2. Run: npm install in backend folder
3. Try again
```

---

## ✅ SUCCESS CHECKLIST

After running setup script:
- [ ] Terminal shows "Server running at http://localhost:8080"
- [ ] No ERROR or exception messages
- [ ] Port 8080 is listening
- [ ] Browser can access http://localhost:8080

---

## 📱 ACCESS THE APP

### **Register New Account**
```
http://localhost:8080/login/register.html
- Username: any name
- Password: min 8 characters
- Confirm password: same as above
- Click: Daftar
```

### **Login**
```
http://localhost:8080/login/login.html
- Username: the account you created
- Password: your password
- Click: Masuk
```

### **Main Dashboard**
```
After login, you'll see:
http://localhost:8080/pages/halo.html

Features:
- Home: Welcome page
- Motivation: Daily quotes
- Tugas: Task management
- Finance: Money calculator
- Habit: Habit tracking
```

---

## 🛑 STOP SERVER

```
Press: Ctrl + C in the terminal
Result: Server will stop
```

---

## 📞 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "localhost refused to connect" | Make sure script finished & server is running |
| "Cannot find module express" | Run `npm install` in backend folder |
| "Port 8080 already in use" | Close other Node.js apps or change port |
| "Node.js not found" | Install from nodejs.org |
| Script hangs | Press Ctrl+C and try again |

---

## 🎯 QUICK COMMANDS

```bash
# Setup only (install dependencies)
npm run setup

# Setup + run server
npm run setup:dev

# Run existing setup
npm run dev

# Check MongoDB connection (if using MongoDB)
npm run check-mongo
```

---

## 📝 FILES EXPLAINED

```
D:\halo-abe\
├── RUN-ALTERNATIVE.bat ........ COBA YANG INI DULU (cari node otomatis)
├── RUN-ALTERNATIVE.ps1 ........ Versi PowerShell dari di atas
├── setup-and-run.bat ........... Backup (jika Node.js sudah terpasang)
├── setup-and-run.ps1 ........... Backup PowerShell version
├── backend/
│   ├── server-simple.js ........ Main server file
│   ├── package.json ............ Dependencies config
│   └── node_modules/ ........... Installed packages (dibuat otomatis)
├── login/
│   ├── login.html .............. Login page
│   └── register.html ........... Register page
├── pages/
│   └── halo.html ............... Main dashboard
└── public/
    ├── style.css ............... Styling
    └── (images & assets)
```

---

## 🔐 ACCOUNTS FOR TESTING

After setup, create test accounts:

```
Account 1:
- Username: syauqi
- Password: password123

Account 2:
- Username: tester
- Password: testpass99

Or create your own!
```

---

## 🌐 VERIFY SERVER RUNNING

Open any browser and paste:
```
http://localhost:8080
→ Should redirect to login page

http://localhost:8080/login/register.html
→ Should show register form

http://localhost:8080/login/login.html  
→ Should show login form
```

---

## 📊 SYSTEM REQUIREMENTS

- **Windows 7+** or any OS with Node.js
- **Node.js 18+** (download from nodejs.org)
- **npm 9+** (included with Node.js)
- **Browser** (Chrome, Firefox, Edge, Safari)
- **Internet** (for initial npm install)

---

## 🚀 YOU'RE READY!

**LANGKAH 1:** Double-click file `RUN-ALTERNATIVE.bat`

**LANGKAH 2:** Tunggu sampai muncul:
```
Server running at: http://localhost:8080
```

**LANGKAH 3:** Buka browser dan kunjungi:
```
http://localhost:8080/login/register.html
```

**LANGKAH 4:** Daftar akun baru (username & password)

**LANGKAH 5:** Login dengan akun yang baru dibuat

**LANGKAH 6:** Enjoy! 🎉

---

**Jika RUN-ALTERNATIVE.bat tidak bekerja?**

Artinya Node.js benar-benar tidak ada. Ikuti SOLUSI di atas untuk download Node.js terlebih dahulu.

**Questions?** Check files in project root:
- README.md (detailed documentation)
- CONTOH-REFERENCE.md (learning resources)
- TROUBLESHOOTING.md (common issues)
- **BUG-FIX-SESSION-RELOAD.md (Solusi untuk reload bug!) ← BACA INI**

---

**Happy coding! 🎉**
