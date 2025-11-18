# 🚀 PANDUAN DEPLOYMENT HALO ABE KE VERCEL

## 📋 Overview

Halo ABE sudah siap di-deploy ke Vercel dengan custom domain `haloabeweb.my.id`. Semua konfigurasi sudah di-setup otomatis.

---

## ✅ Yang Sudah Selesai

- ✅ Struktur project sudah Vercel-compatible
- ✅ API endpoints dibuat sebagai serverless functions (`/api`)
- ✅ `vercel.json` sudah dikonfigurasi dengan routing CORS yang benar
- ✅ `package.json` diupdate untuk Vercel (ES Modules)
- ✅ Semua files sudah di-push ke GitHub
- ✅ MongoDB integration siap (gunakan MongoDB Atlas)
- ✅ Environment variables sudah di-template (`.env.example`)

---

## 🎯 LANGKAH DEPLOYMENT (3 Steps Mudah)

### **STEP 1: Verifikasi Kesiapan** ✓

Jalankan script untuk check semua file sudah siap:

```bash
# Windows
./check-vercel-ready.bat

# macOS/Linux
bash check-vercel-ready.sh
```

Harusnya output: ✅ **DEPLOYMENT READY!**

---

### **STEP 2: Buat Vercel Project**

#### A. Login ke Vercel

1. Buka: https://vercel.com
2. Click: **Sign up / Sign in**
3. Pilih: **Sign in with GitHub**
4. Authorize Vercel ke GitHub account Anda

#### B. Import Repository

1. Di Vercel dashboard, click: **Add New** → **Project**
2. Cari repository: `halo-abe`
3. Click: **Import**

#### C. Configure Project

**Settings:**
```
Project Name: halo-abe
Framework Preset: Other
Root Directory: ./
Install Command: npm install
Build Command: npm run vercel-build
Output Directory: ./
```

#### D. Environment Variables

Add sebelum deploy:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/halo_abe?retryWrites=true&w=majority
NODE_ENV = production
```

**Cara dapat MONGODB_URI:**
1. Login ke: https://cloud.mongodb.com/
2. Click cluster → **Connect**
3. Pilih: **Drivers**
4. Copy connection string
5. Replace `<username>` dan `<password>`
6. Ganti database name ke `halo_abe`

#### E. Deploy!

Click: **Deploy**

⏳ Tunggu ~2-3 menit...

Output akan tampil:
```
✅ Deployment successful at: https://halo-abe.vercel.app
```

---

### **STEP 3: Setup Custom Domain**

#### A. Di Vercel Dashboard

1. Pilih project: `halo-abe`
2. Go to: **Settings** → **Domains**
3. Click: **Add Domain**
4. Input: `haloabeweb.my.id`
5. Click: **Add**

Vercel akan show:
```
Nameservers:
ns1.vercel-dns.com
ns2.vercel-dns.com

OR CNAME:
cname.vercel-dns.com
```

#### B. Di Domain Registrar (.my.id Provider)

**Option 1: Ganti Nameservers (RECOMMENDED)**

1. Login ke registrar Anda (tempat beli domain)
2. Cari: **Domain Management** atau **Nameservers**
3. Replace dengan:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
4. Save changes
5. Tunggu 24-48 jam untuk propagate

**Option 2: Tambah CNAME Record**

1. Login ke registrar
2. Cari: **DNS Settings** atau **DNS Records**
3. Tambah **CNAME Record**:
   ```
   Name: haloabeweb (atau subdomain)
   Target: cname.vercel-dns.com
   TTL: 3600
   ```
4. Save
5. Tunggu 5-10 menit

#### C. Verify

Cek di Vercel dashboard apakah domain sudah terhubung:
- Status akan berubah dari "Pending" → "Active"
- Atau cek di: https://whatsmydns.net

---

## 🧪 Test Setelah Deploy

### Test Website
```bash
# Di browser:
https://haloabeweb.my.id
https://haloabeweb.my.id/login/register.html
https://haloabeweb.my.id/login/login.html
```

### Test API

```bash
# Register
curl -X POST https://haloabeweb.my.id/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' \
  -c cookies.txt

# Login
curl -X POST https://haloabeweb.my.id/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' \
  -b cookies.txt

# Check me
curl https://haloabeweb.my.id/api/me -b cookies.txt
```

---

## 🔍 Monitoring & Debugging

### Check Logs di Vercel

1. Vercel dashboard → Project `halo-abe`
2. Click: **Deployments**
3. Pilih latest deployment
4. Click: **Logs**
5. Lihat real-time logs & errors

### Common Errors & Solutions

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `MONGODB_URI not set` | Env var tidak added | Add MONGODB_URI di Vercel Settings |
| `MongoNetworkError` | Koneksi MongoDB failed | Check MongoDB Atlas IP whitelist |
| `Cannot find module 'bcryptjs'` | Dependencies tidak install | Run `npm install` & redeploy |
| `502 Bad Gateway` | API error | Check logs di Vercel dashboard |
| Domain tidak bisa diakses | DNS not propagated | Tunggu 24-48 jam atau cek nameservers |

---

## 📊 Project Structure

```
halo-abe/
├── api/                    ← Serverless API endpoints
│   ├── register.js         ← POST /api/register
│   ├── login.js            ← POST /api/login
│   ├── logout.js           ← POST /api/logout
│   └── me.js               ← GET /api/me
├── pages/                  ← Static HTML pages
│   └── halo.html           ← Main dashboard (protected)
├── login/                  ← Auth pages
│   ├── login.html
│   └── register.html
├── public/                 ← Static assets
│   ├── style.css
│   ├── *.jpeg
│   └── *.mp4
├── vercel.json             ← Vercel config
├── package.json            ← Dependencies
├── .env.example            ← Env template
└── DEPLOY-VERCEL.md        ← This file
```

---

## 🔐 Security Notes

### Production Checklist

- ✅ HTTPS enabled automatically (Let's Encrypt)
- ✅ CORS configured properly
- ✅ API rate limiting (via Vercel)
- ✅ Passwords hashed dengan bcryptjs
- ⚠️ TODO: Add JWT tokens (untuk production-grade security)
- ⚠️ TODO: Add session timeout
- ⚠️ TODO: Add request validation
- ⚠️ TODO: Add rate limiting per IP

### Environment Variables Security

- ✅ MONGODB_URI stored as **Secret** (tidak exposed)
- ✅ Never commit `.env` file
- ✅ Use `.env.example` untuk template

---

## 💰 Cost Estimation

### Vercel (Free Tier)
- **Deployments**: Unlimited
- **Bandwidth**: 100 GB/month
- **Serverless Functions**: Unlimited calls
- **Status**: ✅ Cukup untuk demo/development

### MongoDB Atlas (Free Tier)
- **Storage**: 512 MB
- **Monthly transfer**: 5 GB
- **Status**: ✅ Cukup untuk dev, ⚠️ upgrade untuk production

### Custom Domain
- **Cost**: Tergantung registrar (~$5-15/tahun)
- **Setup**: Satu kali

---

## 🚀 Advanced Configuration (Optional)

### Enable Caching

Tambah ke `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/public/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

### Enable Compression

Vercel auto-enable gzip compression untuk static files.

### Custom Error Pages

Buat `public/404.html` untuk custom 404 page.

---

## 📞 Support & Documentation

### Useful Links
- Vercel Docs: https://vercel.com/docs
- Vercel CLI: https://vercel.com/cli
- MongoDB Docs: https://docs.mongodb.com/
- Domain DNS: https://whatsmydns.net

### Troubleshooting Docs
- DEPLOY-VERCEL.md
- BUG-FIX-SESSION-RELOAD.md
- QUICK-START.md

---

## ✨ Final Checklist

Sebelum production:

- [ ] Vercel project created
- [ ] Custom domain added
- [ ] Environment variables configured
- [ ] MongoDB connection tested
- [ ] Registration/login flow tested
- [ ] Session persistence tested
- [ ] Dashboard loads correctly
- [ ] HTTPS working
- [ ] Custom domain resolves

---

## 🎉 SELESAI!

Website sudah live di: **https://haloabeweb.my.id**

Enjoy! 🚀

---

**Questions?** Check Vercel documentation atau contact support.

