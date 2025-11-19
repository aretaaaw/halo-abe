# 🚀 Deploy ke Vercel + Custom Domain

## Step-by-Step Deployment

### 1️⃣ Push ke GitHub

```bash
# Initialize git (jika belum)
git init

# Add semua files
git add .

# Commit
git commit -m "Prepare for Vercel deployment"

# Create repository on GitHub
# https://github.com/new
# Name: halo-abe

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/halo-abe.git

# Push
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy ke Vercel

1. **Go to**: https://vercel.com
2. **Sign up with GitHub** (jika belum punya akun)
3. **Click**: "New Project"
4. **Import** repository: `halo-abe`
5. **Project name**: `halo-abe`
6. **Framework**: Leave empty (default)
7. **Environment Variables**: 
   - **MONGODB_URI**: Paste MongoDB connection string
   - **NODE_ENV**: `production`

**Konfigurasi:**
```
Root Directory: ./
Install Command: npm install
Build Command: npm run vercel-build
Output Directory: ./
```

8. **Click**: "Deploy"
9. **Wait** ~2-3 menit sampai deploy complete

---

### 3️⃣ Setup Custom Domain (haloabeweb.my.id)

#### Option A: Menggunakan Vercel (RECOMMENDED)

1. **Di Vercel Dashboard:**
   - Pilih project `halo-abe`
   - Go to: **Settings → Domains**
   - Click: **Add Domain**
   - Input: `haloabeweb.my.id`
   - Click: **Add**

2. **Vercel akan show nameserver:**
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

3. **Di domain registrar (.my.id provider):**
   - Login ke akun domain
   - Go to: DNS Settings / Nameservers
   - Replace dengan Vercel nameservers:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - Save changes
   - **Wait 24-48 hours** untuk DNS propagate

4. **Verify:**
   - Kunjungi: https://haloabeweb.my.id
   - Seharusnya menampilkan halaman Halo ABE

---

#### Option B: Menggunakan CNAME (Jika ingin keep nameservers)

1. **Di Vercel Dashboard:**
   - Go to: **Settings → Domains**
   - Click: **Add Domain**
   - Input: `haloabeweb.my.id`
   - Pilih: **CNAME** method
   - Vercel show: `cname.vercel-dns.com`

2. **Di domain registrar:**
   - Go to: DNS / Records settings
   - Add **CNAME Record:**
     ```
     Name: www (or haloabeweb)
     Target: cname.vercel-dns.com
     ```
   - Save
   - **Wait 5-10 minutes** untuk propagate

3. **Verify:** https://haloabeweb.my.id

---

### 4️⃣ Enable HTTPS (Auto)

✅ **Vercel otomatis setup HTTPS** dengan Let's Encrypt
- Tidak perlu konfigurasi manual
- SSL certificate auto-renew setiap tahun

---

## ⚠️ Environment Variables di Vercel

**Sebelum deploy, siapkan:**

1. **MONGODB_URI**
   - Login ke: https://cloud.mongodb.com/
   - Ambil connection string dari cluster
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/halo_abe?retryWrites=true&w=majority`

2. **NODE_ENV** = `production`

**Cara set di Vercel:**
- Project Settings → Environment Variables
- Add each variable
- Deploy ulang dengan "Redeploy"

---

## 🧪 Test Production

Setelah live:

```bash
# Test register
curl -X POST https://haloabeweb.my.id/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Test login
curl -X POST https://haloabeweb.my.id/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' \
  -c cookies.txt

# Test me endpoint
curl https://haloabeweb.my.id/api/me -b cookies.txt
```

---

## 🔍 Troubleshooting

### Domain tidak bisa diakses
- Tunggu 24-48 jam untuk DNS propagate
- Clear browser cache: Ctrl+Shift+Delete
- Cek DNS: https://whatsmydns.net

### HTTPS error
- Pastikan custom domain sudah ter-add di Vercel
- Tunggu SSL certificate di-issue (biasanya 5-10 menit)

### API returns 500 error
- Check: **Vercel Logs**
- Lihat: Project → Deployments → Logs
- Biasanya: MongoDB connection issue

### "Not authenticated" error
- Pastikan cookies enabled di browser
- Login ulang
- Check browser DevTools → Network → Cookies

---

## 📊 Monitoring

**Vercel Dashboard:**
- Deployments: Lihat history & logs
- Analytics: Lihat traffic & performance
- Settings: Manage domains & env vars

**MongoDB Atlas:**
- https://cloud.mongodb.com/
- Lihat: Network requests, storage, performance

---

## 🎯 Important Notes

1. ✅ **Auto HTTPS**: Vercel handle semua
2. ✅ **Auto Scaling**: Vercel scale automatically
3. ✅ **Free tier**: Cukup untuk development/demo
4. ⚠️ **Databases**: MongoDB Atlas free tier terbatas (512MB)
5. 📝 **Cost**: Production bisa ~ $10-50/bulan depending usage

---

## Next Steps

1. Buka: https://github.com/new
2. Create repository `halo-abe`
3. Push code
4. Deploy ke Vercel
5. Setup custom domain
6. Test production
7. Done! 🎉

---

**Questions?** Check Vercel docs:
- https://vercel.com/docs
- https://vercel.com/docs/concepts/deployments/custom-domains

