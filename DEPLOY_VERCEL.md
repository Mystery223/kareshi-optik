# Deploy Guide (Vercel) - Kareshi Optik

Panduan ini jadi acuan deploy production agar setup konsisten dan minim error.

## 1) Prasyarat

- Repository sudah terhubung ke Vercel.
- Database PostgreSQL production sudah siap.
- Redis production sudah siap (Upstash / Redis Cloud / Redis managed lain).
- Domain sudah disiapkan (opsional, tapi direkomendasikan).

## 2) Environment Variables (WAJIB)

Set semua variable berikut di Vercel: `Project -> Settings -> Environment Variables`.

### Core

- `DATABASE_URL`  
  contoh: `postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require`
- `NEXTAUTH_URL`  
  contoh: `https://your-domain.com`
- `NEXTAUTH_SECRET`  
  generate random secret yang kuat.
- `AUTH_SECRET`  
  isi sama dengan `NEXTAUTH_SECRET` (untuk kompatibilitas Auth.js v5).
- `AUTH_TRUST_HOST`  
  set `true` di Vercel.

### Redis (Cache + Rate Limiting)

- `REDIS_URL`  
  contoh: `redis://default:password@host:6379`
- `REDIS_CACHE_TTL_SECONDS`  
  rekomendasi awal: `300`
- `REDIS_RATE_LIMIT_WHITELIST_IPS`  
  production biasanya kosong.  
  isi hanya jika benar-benar butuh whitelist IP tertentu (format koma):  
  `1.2.3.4,5.6.7.8`

### Email

- `RESEND_API_KEY`
- `FROM_EMAIL`  
  contoh: `noreply@your-domain.com`
- `ADMIN_EMAIL`

### Public App

- `NEXT_PUBLIC_SITE_URL`  
  contoh: `https://your-domain.com`
- `NEXT_PUBLIC_APP_NAME`  
  contoh: `Kareshi Optik`
- `NEXT_PUBLIC_WA_NUMBER`  
  contoh: `6281234567890`

## 3) Build & Deploy Setting (Vercel)

Biasanya auto-detected, tapi pastikan:

- Framework Preset: `Next.js`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: default (kosong)
- Node version: gunakan default terbaru Vercel (atau set sesuai kebijakan tim)

## 4) Database Migration (Sebelum Go Live)

Jalankan migration ke DB production.

Contoh dari lokal (pastikan `DATABASE_URL` mengarah ke DB production):

```bash
npm run db:compat
npm run db:baseline
npm run db:migrate
```

Catatan:
- Jangan jalankan seed dummy di production kecuali memang untuk demo.
- Jika butuh data demo terkontrol, jalankan manual dan dokumentasikan.
- `db:compat` wajib jika DB production awalnya dibuat dari dump SQL lama (`db_kareshi.sql` versi lama).
- `db:baseline` menandai migration lama agar `drizzle-kit` tidak menjalankan ulang SQL yang sudah ada.

## 5) Deploy Flow yang Direkomendasikan

1. Set semua env vars di Vercel (Production + Preview jika perlu).
2. Jalankan migration ke DB production.
3. Deploy dari branch utama.
4. Verifikasi endpoint kritikal:
   - Login/register
   - Booking
   - `/koleksi` dan detail produk
   - `/admin` (role admin/staff)
5. Cek log Vercel:
   - error DB connection
   - error Redis connection
   - rate limit hits (`[RATE_LIMIT_BLOCKED]`)

## 6) Post-Deploy Checklist

- [ ] Login berhasil untuk `customer`.
- [ ] Login berhasil untuk `admin/staff` dan redirect ke `/admin`.
- [ ] Produk list/detail tampil normal (termasuk gambar fallback brand).
- [ ] Booking berhasil dan API tidak 500.
- [ ] Footer map dan link eksternal berfungsi.
- [ ] Rate limiting aktif (uji spam request) dan response `429` memiliki `Retry-After`.

## 7) Troubleshooting Cepat

### A. Login gagal terus
- Cek `NEXTAUTH_URL` benar.
- Cek `NEXTAUTH_SECRET` sudah di-set.
- Cek `AUTH_SECRET` dan `AUTH_TRUST_HOST=true`.
- Cek data user/password hash di DB production.

### B. Koleksi/detail produk error
- Cek `DATABASE_URL`.
- Jalankan berurutan: `npm run db:compat`, `npm run db:baseline`, `npm run db:migrate`.
- Pastikan migration products/brands/categories/variants/reviews sudah applied.

### C. Redis tidak aktif
- Cek `REDIS_URL`.
- Jika Redis mati, app tetap jalan, tapi cache+rate-limit dibypass.
- Lihat log: `[REDIS_CONNECT_ERROR]` atau `[REDIS_DISABLED]`.

### D. Rate limit terlalu ketat
- Ubah limit di:
  - `src/auth.ts`
  - `src/app/api/auth/register/route.ts`
  - `src/app/api/appointments/book/route.ts`

## 8) Rekomendasi Production Tambahan

- Tambahkan monitoring/error tracking (Sentry).
- Tambahkan health-check endpoint internal.
- Aktifkan backup rutin untuk DB.
- Gunakan domain email yang sudah diverifikasi (Resend).
