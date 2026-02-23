# Kareshi Optik

Website + sistem operasional optik berbasis Next.js untuk:

- Landing page dan katalog produk
- Booking appointment
- Dashboard customer
- Dashboard internal (`admin` / `staff`)

## Stack

- Next.js 16 (App Router)
- TypeScript
- Drizzle ORM + PostgreSQL
- NextAuth (credentials)
- Redis (cache + rate limiting)
- Resend (email notifikasi)

## Setup Lokal

1. Install dependency

```bash
npm install
```

2. Siapkan environment file

```bash
cp .env.example .env.local
```

3. Isi nilai pada `.env.local` (minimal: `DATABASE_URL`, `NEXTAUTH_SECRET` / `AUTH_SECRET`)

4. Jalankan app

```bash
npm run dev
```

5. Akses:
- Public website: `http://localhost:3000`
- Admin portal: `http://localhost:3000/admin`
- Customer dashboard: `http://localhost:3000/dashboard`

## Scripts

- `npm run dev` -> development server
- `npm run build` -> production build
- `npm run start` -> run production server
- `npm run lint` -> lint codebase
- `npm run db:compat` -> patch kompatibilitas DB legacy
- `npm run db:baseline` -> sinkronkan histori drizzle migration
- `npm run db:migrate` -> apply migration drizzle
- `npm run seed:test-data` -> seed akun test
- `npm run seed:products-dummy` -> seed katalog dummy

## Role & Akses

- `admin`
  - akses penuh area `/admin`
  - dapat mengelola user internal (`/admin/users`)
  - dapat menghapus produk
- `staff`
  - akses operasional `/admin` (appointments, orders, products, blog, exam)
  - tidak bisa menghapus produk
  - tidak bisa mengakses manajemen user internal
- `customer`
  - akses `/dashboard` pribadi
  - tidak dapat mengakses `/admin`

## Deploy

- Panduan deploy production: `DEPLOY_VERCEL.md`
- Checklist handover klien: `HANDOVER_CHECKLIST.md`

## Catatan Keamanan

- Jangan commit file `.env*` ke repository.
- Upload avatar user disimpan di `public/uploads/avatars` dan file runtime di-ignore dari Git.
- Enforcement role kritikal dilakukan di backend (server action/API), bukan hanya UI.
