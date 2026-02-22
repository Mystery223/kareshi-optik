# Handover Checklist - Kareshi Optik

Checklist ini dipakai saat serah terima project ke klien.

## 1. Repository & Branch

- [ ] Branch produksi sudah final dan stabil.
- [ ] Tidak ada file sensitif (`.env`, token, key) yang ter-commit.
- [ ] `.gitignore` sudah benar untuk artefak runtime/build.

## 2. Environment Variables (Production)

- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `REDIS_URL`
- [ ] `REDIS_CACHE_TTL_SECONDS`
- [ ] `REDIS_RATE_LIMIT_WHITELIST_IPS` (opsional)
- [ ] `RESEND_API_KEY`
- [ ] `FROM_EMAIL`
- [ ] `ADMIN_EMAIL`
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_APP_NAME`
- [ ] `NEXT_PUBLIC_WA_NUMBER`

## 3. Database

- [ ] Migration sudah dijalankan di database production.
- [ ] Akun internal awal sudah tersedia (minimal 1 admin aktif).
- [ ] Backup database awal setelah go-live sudah dibuat.

## 4. Functional QA

- [ ] Register/login customer berjalan normal.
- [ ] Login admin/staff redirect ke `/admin`.
- [ ] Booking appointment berhasil.
- [ ] Halaman katalog + detail produk tampil normal.
- [ ] Dashboard customer (`/dashboard`) normal.
- [ ] Dashboard admin (`/admin`) normal.
- [ ] Upload avatar profile normal untuk role terkait.
- [ ] Manajemen user internal (`/admin/users`) hanya bisa diakses admin.

## 5. Security QA

- [ ] `staff` tidak bisa menghapus produk.
- [ ] `staff` tidak bisa mengakses manajemen user internal.
- [ ] Tidak bisa menonaktifkan admin aktif terakhir.
- [ ] Tidak bisa mengubah role akun sendiri.
- [ ] Endpoint mutasi penting sudah cek role di backend.

## 6. Operasional

- [ ] Log akses Vercel/hosting sudah dipantau.
- [ ] Alert error runtime sudah disiapkan (jika ada tools monitoring).
- [ ] SOP reset password admin/staff diserahkan ke PIC klien.

## 7. Dokumen Serah Terima

- [ ] Panduan deploy: `DEPLOY_VERCEL.md`
- [ ] README proyek: `README.md`
- [ ] Kredensial akun awal diserahkan via kanal aman (bukan chat umum).
- [ ] Kontak PIC teknis klien dan dev sudah tercatat.
