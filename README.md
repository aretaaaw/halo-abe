# Halo, ABE - Sistem Manajemen Pembelajaran & Kebiasaan

**Status**: ✅ Fully Functional Authentication & Backend

## 📋 Fitur

- ✅ **Register/Sign Up** - Daftar akun baru dengan username & password
- ✅ **Login** - Masuk dengan kredensial yang sudah terdaftar
- ✅ **Session Management** - Tetap login saat refresh halaman
- ✅ **Logout** - Keluar dan kembali ke halaman login
- ✅ **Protected Pages** - Halaman utama dilindungi auth
- ✅ **Dashboard Interaktif** - Halaman utama (Halo, ABE) dengan fitur:
  - Home - Penyambutan & intro
  - Motivation - Kutipan motivasi harian
  - Tugas - Manajemen task & deadline
  - Finance - Kalkulasi pembagian uang
  - Habit - Tracking kebiasaan & stress management

## 🚀 Setup & Jalankan

### Prerequisites
- **Node.js** v20+ (download dari https://nodejs.org/en/download/)
- **npm** (menyertai Node.js)

### Instalasi

```bash
# 1. Clone/buka folder project
cd D:\halo-abe

# 2. Install backend dependencies
cd backend
npm install

# 3. Kembali ke root folder
cd ..
```

### Jalankan Server

**Option 1: Menggunakan npm script**
```bash
npm run dev
```

**Option 2: Jalankan langsung**
```bash
node backend/server-simple.js
```

Server akan berjalan di: **http://localhost:8080**

## 🔐 Menggunakan Aplikasi

### 1. Daftar Akun Baru
- Buka: http://localhost:8080/login/register.html
- Isi username & password (min 8 karakter)
- Klik **Daftar**
- → Otomatis masuk ke halaman utama

### 2. Login
- Buka: http://localhost:8080/login/login.html
- Isi username & password
- Klik **Masuk**
- → Masuk ke halaman utama

### 3. Akses Halaman Utama
- URL: http://localhost:8080/pages/halo.html
- Atau: http://localhost:8080 (akan redirect ke halo.html)
- Jika belum login → akan redirect ke halaman login

### 4. Logout
- Klik tombol **Logout** di navbar
- → Kembali ke halaman login

## 📂 Struktur Folder

```
halo-abe/
├── backend/
│   ├── server-simple.js          # Server utama (Express.js)
│   ├── models/
│   │   └── User.js              # User schema (opsional untuk MongoDB)
│   ├── package.json
│   └── package-lock.json
├── login/
│   ├── login.html               # Halaman login
│   └── register.html            # Halaman register
├── pages/
│   └── halo.html                # Halaman utama (dashboard)
├── public/
│   ├── style.css                # Styling global
│   ├── auth.css                 # Styling auth pages
│   ├── Home.jpeg, motivasi.jpeg # Background images
│   ├── tugas*.jpeg              # Task images
│   └── maskot.mp4               # Video animasi
├── package.json                 # Root npm scripts
├── .env                         # Environment variables (MongoDB URI)
└── README.md                    # File ini
```

## 🔧 Konfigurasi

### .env File
File `.env` berisi MongoDB connection string (opsional):

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=haloABE
SESSION_SECRET=your-secret-key
```

**Note**: Server saat ini menggunakan in-memory storage, jadi tidak perlu MongoDB untuk development.

## 📊 API Endpoints

### Authentication
- `POST /api/register` - Daftar user baru
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/me` - Get user profile saat ini

### Static Pages
- `GET /login/login.html` - Halaman login
- `GET /login/register.html` - Halaman register
- `GET /pages/halo.html` - Dashboard (protected)

## 🛡️ Security

- ✅ Password hashing dengan **bcryptjs** (10 salt rounds)
- ✅ Session management dengan **express-session**
- ✅ CORS properly configured
- ✅ HTTP-only cookies untuk session
- ✅ Protected routes dengan auth middleware

## 🌐 Deploy

### Deploy ke Vercel/Railway/Heroku

1. **Siapkan environment variables** di platform deploy:
   ```
   SESSION_SECRET=your-secret-key
   NODE_ENV=production
   ```

2. **Push ke git:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Connect ke Vercel/Railway/Heroku dan deploy**

### Untuk Production
Ubah `server-simple.js` ke `server.js` untuk gunakan MongoDB Atlas:
```bash
NODE_ENV=production node backend/server.js
```

## 🐛 Troubleshooting

### Error: "npm: command not found"
- Install Node.js dari https://nodejs.org/en/download/
- Restart terminal setelah install

### Error: "Cannot GET /pages/halo.html"
- Pastikan belum login
- Login terlebih dahulu di `/login/login.html`

### Session tidak tersimpan
- Clear browser cookies
- Pastikan server berjalan
- Cek console browser (F12) untuk error messages

## 📝 Testing

Semua fitur sudah di-test dan berfungsi:
- ✅ Register user baru
- ✅ Login dengan username & password
- ✅ Logout dan clear session
- ✅ Redirect ke login jika belum auth
- ✅ Access halaman dashboard after login
- ✅ Session persist saat refresh halaman

## 📞 Support

Jika ada masalah:
1. Buka **Developer Console** (F12) untuk melihat error
2. Check **Network tab** untuk melihat API response
3. Restart server jika ada perubahan

## 📄 License

ISC

---

**Created by**: Syauqi  
**Last Updated**: November 18, 2025
