# 🎯 HALO ABE - VERCEL DEPLOYMENT QUICK REFERENCE

## ⚡ 3-STEP DEPLOYMENT

```
STEP 1: Verify              → ./check-vercel-ready.bat
STEP 2: Create Vercel Project    → https://vercel.com (Import from GitHub)
STEP 3: Setup Custom Domain      → Add to Vercel + Update DNS
```

---

## 📖 IMPORTANT FILES

| File | Tujuan |
|------|--------|
| `PANDUAN-DEPLOYMENT.md` | **BACA INI DULU** - Panduan lengkap dalam Bahasa Indonesia |
| `DEPLOY-VERCEL.md` | Panduan dalam English |
| `vercel.json` | Konfigurasi Vercel (jangan edit!) |
| `.env.example` | Template environment variables |
| `api/` | Serverless API endpoints |
| `check-vercel-ready.bat` | Script verifikasi kesiapan |

---

## 🚀 QUICK START

### 1. Verifikasi Siap Deploy
```bash
./check-vercel-ready.bat
```
Output harus: `✅ DEPLOYMENT READY!`

### 2. Go to Vercel
```
https://vercel.com
→ Sign in with GitHub
→ Add New Project
→ Import "halo-abe"
```

### 3. Configure Before Deploy
```
Environment Variables:
- MONGODB_URI = [paste MongoDB connection string]
- NODE_ENV = production

Framework: Other
Root: ./
Install: npm install
Build: npm run vercel-build
```

### 4. Click Deploy ✓

### 5. Setup Domain
```
Vercel Dashboard → Project → Settings → Domains
→ Add Domain: haloabeweb.my.id
→ Update DNS nameservers ke:
   ns1.vercel-dns.com
   ns2.vercel-dns.com
```

### 6. Wait 24-48 Hours
DNS propagation happens automatically

### 7. Test
```
https://haloabeweb.my.id
```

---

## 🔑 ENVIRONMENT VARIABLES

### MONGODB_URI
Get from: https://cloud.mongodb.com/
1. Login → Cluster → Connect
2. Copy connection string
3. Replace `<username>` dan `<password>`
4. Change database to `halo_abe`

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/halo_abe?retryWrites=true&w=majority
```

### NODE_ENV
```
production
```

---

## 🔗 GITHUB REPOSITORY

```
https://github.com/syauqi123478-art/halo-abe
```

Already pushed and ready to import into Vercel!

---

## ✅ API ENDPOINTS (After Deploy)

```
POST /api/register        → Register user
POST /api/login           → Login user
POST /api/logout          → Logout user
GET  /api/me              → Get current user
GET  /pages/halo.html     → Main dashboard (protected)
GET  /login/login.html    → Login page
GET  /login/register.html → Register page
```

---

## 🧪 TEST ENDPOINTS

```bash
# Register
curl -X POST https://haloabeweb.my.id/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password123"}'

# Login
curl -X POST https://haloabeweb.my.id/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password123"}'

# Me (check auth)
curl https://haloabeweb.my.id/api/me
```

---

## 🆘 TROUBLESHOOTING

### "MONGODB_URI not set"
→ Add to Vercel environment variables

### "502 Bad Gateway"
→ Check Vercel logs (Deployments → Logs)

### Domain tidak bisa diakses
→ Tunggu 24-48 jam untuk DNS propagate
→ Clear browser cache

### "Cannot find module"
→ Redeploy dari Vercel dashboard

---

## 📊 MONITORING

### Vercel Dashboard
```
https://vercel.com/dashboard
```

### MongoDB Atlas
```
https://cloud.mongodb.com/
```

### Check Domain
```
https://whatsmydns.net
```

---

## 💡 PRO TIPS

1. ✅ Vercel auto-enables HTTPS with Let's Encrypt
2. ✅ Deployments automatically scale
3. ✅ Free tier sufficient untuk development
4. ⚠️ MongoDB free tier limited (512MB)
5. 📝 Keep `.env` file secret, never commit!

---

## 📞 SUPPORT LINKS

- Vercel Documentation: https://vercel.com/docs
- MongoDB Documentation: https://docs.mongodb.com/
- Vercel Support: https://vercel.com/support
- GitHub Issues: https://github.com/syauqi123478-art/halo-abe/issues

---

## ✨ NEXT STEPS

- [ ] Run `./check-vercel-ready.bat`
- [ ] Go to vercel.com and login with GitHub
- [ ] Import `halo-abe` repository
- [ ] Add MongoDB URI environment variable
- [ ] Click Deploy
- [ ] Add custom domain `haloabeweb.my.id`
- [ ] Update DNS nameservers
- [ ] Wait for DNS propagation
- [ ] Test website
- [ ] Done! 🎉

---

**Full Guide:** `PANDUAN-DEPLOYMENT.md` (Bahasa Indonesia)

**Questions?** Check documentation files in project root.

