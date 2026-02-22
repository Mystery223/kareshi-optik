CREATE TABLE "brands" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" varchar(100) UNIQUE NOT NULL,
  "slug" varchar(100) UNIQUE NOT NULL,
  "logo_url" text,
  "country" varchar(100),
  "description" text,
  "website" varchar(255),
  "is_premium" boolean NOT NULL DEFAULT false,
  "is_active" boolean NOT NULL DEFAULT true,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" varchar(100) NOT NULL,
  "slug" varchar(100) UNIQUE NOT NULL,
  "description" text,
  "parent_id" uuid,
  "image_url" text,
  "sort_order" integer DEFAULT 0,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "products" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "sku" varchar(50) UNIQUE NOT NULL,
  "name" varchar(255) NOT NULL,
  "slug" varchar(255) UNIQUE NOT NULL,
  "brand_id" uuid NOT NULL,
  "category_id" uuid,
  "gender" gender_type NOT NULL DEFAULT 'unisex',
  "frame_material" frame_material NOT NULL,
  "frame_shape" varchar(50),
  "frame_color" varchar(100),
  "frame_width" decimal(5,1),
  "lens_width" decimal(5,1),
  "bridge_width" decimal(4,1),
  "temple_length" decimal(5,1),
  "price" decimal(12,0) NOT NULL,
  "original_price" decimal(12,0),
  "is_on_sale" boolean NOT NULL DEFAULT false,
  "description" text,
  "features" text[],
  "tags" text[],
  "images" text[],
  "thumbnail_url" text,
  "is_active" boolean NOT NULL DEFAULT true,
  "is_featured" boolean NOT NULL DEFAULT false,
  "badge" varchar(50),
  "meta_title" varchar(255),
  "meta_description" text,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "product_variants" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "product_id" uuid NOT NULL,
  "color_name" varchar(100),
  "color_hex" varchar(7),
  "stock" integer NOT NULL DEFAULT 0,
  "sku_variant" varchar(50) UNIQUE,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "lenses" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "brand_id" uuid,
  "name" varchar(255) NOT NULL,
  "slug" varchar(255) UNIQUE NOT NULL,
  "type" lens_type NOT NULL,
  "coating" text[],
  "index_val" decimal(3,2),
  "price" decimal(12,0) NOT NULL,
  "description" text,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "reviews" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "product_id" uuid NOT NULL,
  "customer_id" uuid,
  "order_id" uuid,
  "rating" smallint NOT NULL,
  "title" varchar(255),
  "content" text,
  "images" text[],
  "is_verified" boolean NOT NULL DEFAULT false,
  "is_published" boolean NOT NULL DEFAULT false,
  "helpful_count" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "customers" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100),
  "email" varchar(255) UNIQUE,
  "phone" varchar(20),
  "birth_date" date,
  "gender" varchar(10),
  "address" text,
  "city" varchar(100),
  "re_sphere" decimal(4,2),
  "re_cylinder" decimal(4,2),
  "re_axis" smallint,
  "re_add" decimal(3,2),
  "le_sphere" decimal(4,2),
  "le_cylinder" decimal(4,2),
  "le_axis" smallint,
  "le_add" decimal(3,2),
  "pd" decimal(5,2),
  "pd_right" decimal(4,2),
  "pd_left" decimal(4,2),
  "last_eye_exam" date,
  "notes" text,
  "total_orders" integer NOT NULL DEFAULT 0,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "eye_exam_history" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "customer_id" uuid NOT NULL,
  "appointment_id" uuid,
  "optometrist_id" uuid,
  "exam_date" date NOT NULL,
  "re_sphere" decimal(4,2),
  "re_cylinder" decimal(4,2),
  "re_axis" smallint,
  "re_add" decimal(3,2),
  "re_va_uncorr" varchar(10),
  "re_va_corr" varchar(10),
  "le_sphere" decimal(4,2),
  "le_cylinder" decimal(4,2),
  "le_axis" smallint,
  "le_add" decimal(3,2),
  "le_va_uncorr" varchar(10),
  "le_va_corr" varchar(10),
  "pd" decimal(5,2),
  "re_iop" decimal(4,1),
  "le_iop" decimal(4,1),
  "notes" text,
  "recommendations" text,
  "next_exam_date" date,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" varchar(255) NOT NULL,
  "email" varchar(255) UNIQUE NOT NULL,
  "password_hash" varchar(255),
  "role" user_role NOT NULL DEFAULT 'staff',
  "avatar_url" text,
  "is_active" boolean NOT NULL DEFAULT true,
  "last_login_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "optometrists" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "user_id" uuid,
  "name" varchar(255) NOT NULL,
  "title" varchar(100),
  "license_no" varchar(100),
  "photo_url" text,
  "specialization" text,
  "work_days" text[],
  "work_hours_start" time,
  "work_hours_end" time,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "appointment_slots" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "optometrist_id" uuid,
  "date" date NOT NULL,
  "start_time" time NOT NULL,
  "end_time" time NOT NULL,
  "max_patients" integer NOT NULL DEFAULT 1,
  "booked_count" integer NOT NULL DEFAULT 0,
  "is_available" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "appointments" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "booking_code" varchar(20) UNIQUE NOT NULL,
  "customer_id" uuid,
  "optometrist_id" uuid,
  "slot_id" uuid,
  "appointment_date" date NOT NULL,
  "appointment_time" time NOT NULL,
  "service_type" varchar(100) NOT NULL,
  "status" appointment_status NOT NULL DEFAULT 'pending',
  "notes" text,
  "patient_name" varchar(255) NOT NULL,
  "patient_phone" varchar(20) NOT NULL,
  "patient_email" varchar(255),
  "exam_notes" text,
  "prescription" jsonb,
  "recommendation" text,
  "reminder_sent_at" timestamptz,
  "confirmed_at" timestamptz,
  "completed_at" timestamptz,
  "cancelled_at" timestamptz,
  "cancellation_reason" text,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "orders" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "order_code" varchar(20) UNIQUE NOT NULL,
  "customer_id" uuid,
  "appointment_id" uuid,
  "product_id" uuid,
  "product_variant_id" uuid,
  "lens_id" uuid,
  "rx_re_sphere" decimal(4,2),
  "rx_re_cylinder" decimal(4,2),
  "rx_re_axis" smallint,
  "rx_le_sphere" decimal(4,2),
  "rx_le_cylinder" decimal(4,2),
  "rx_le_axis" smallint,
  "rx_pd" decimal(5,2),
  "frame_price" decimal(12,0) NOT NULL DEFAULT 0,
  "lens_price" decimal(12,0) NOT NULL DEFAULT 0,
  "service_fee" decimal(12,0) NOT NULL DEFAULT 0,
  "discount_amount" decimal(12,0) NOT NULL DEFAULT 0,
  "total_price" decimal(12,0) NOT NULL,
  "status" order_status NOT NULL DEFAULT 'pending',
  "estimated_ready" date,
  "completed_at" timestamptz,
  "notes" text,
  "handled_by" uuid,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "blog_posts" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "title" varchar(255) NOT NULL,
  "slug" varchar(255) UNIQUE NOT NULL,
  "excerpt" text,
  "content" text NOT NULL,
  "cover_image" text,
  "category" varchar(100),
  "tags" text[],
  "author_name" varchar(100),
  "author_id" uuid,
  "read_time" smallint,
  "is_published" boolean NOT NULL DEFAULT false,
  "is_featured" boolean NOT NULL DEFAULT false,
  "views" integer NOT NULL DEFAULT 0,
  "published_at" timestamptz,
  "meta_title" varchar(255),
  "meta_description" text,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE INDEX "idx_products_brand" ON "products" ("brand_id");

CREATE INDEX "idx_products_category" ON "products" ("category_id");

CREATE INDEX "idx_products_gender" ON "products" ("gender");

CREATE INDEX "idx_products_price" ON "products" ("price");

CREATE INDEX "idx_products_active" ON "products" ("is_active");

CREATE INDEX "idx_products_featured" ON "products" ("is_featured");

CREATE INDEX "idx_variants_product" ON "product_variants" ("product_id");

CREATE INDEX "idx_reviews_product" ON "reviews" ("product_id");

CREATE INDEX "idx_reviews_rating" ON "reviews" ("rating");

CREATE INDEX "idx_customers_email" ON "customers" ("email");

CREATE INDEX "idx_customers_phone" ON "customers" ("phone");

CREATE INDEX "idx_exam_customer" ON "eye_exam_history" ("customer_id");

CREATE INDEX "idx_exam_date" ON "eye_exam_history" ("exam_date");

CREATE INDEX "idx_slots_date" ON "appointment_slots" ("date");

CREATE INDEX "idx_slots_available" ON "appointment_slots" ("date", "is_available");

CREATE INDEX "idx_appt_date" ON "appointments" ("appointment_date");

CREATE INDEX "idx_appt_status" ON "appointments" ("status");

CREATE INDEX "idx_appt_customer" ON "appointments" ("customer_id");

CREATE INDEX "idx_appt_code" ON "appointments" ("booking_code");

CREATE INDEX "idx_appt_date_status" ON "appointments" ("appointment_date", "status");

CREATE INDEX "idx_orders_customer" ON "orders" ("customer_id");

CREATE INDEX "idx_orders_status" ON "orders" ("status");

CREATE INDEX "idx_orders_code" ON "orders" ("order_code");

CREATE INDEX "idx_blog_published" ON "blog_posts" ("is_published");

CREATE INDEX "idx_blog_featured" ON "blog_posts" ("is_featured");

COMMENT ON TABLE "brands" IS 'Master data merek kacamata yang dijual';

COMMENT ON COLUMN "brands"."id" IS 'Primary Key';

COMMENT ON COLUMN "brands"."name" IS 'Nama brand (RayBan, Oakley, dll)';

COMMENT ON COLUMN "brands"."slug" IS 'URL-friendly identifier';

COMMENT ON COLUMN "brands"."logo_url" IS 'URL logo brand';

COMMENT ON COLUMN "brands"."country" IS 'Negara asal brand';

COMMENT ON COLUMN "brands"."description" IS 'Deskripsi singkat brand';

COMMENT ON COLUMN "brands"."website" IS 'Website resmi brand';

COMMENT ON COLUMN "brands"."is_premium" IS 'Apakah brand premium';

COMMENT ON COLUMN "brands"."sort_order" IS 'Urutan tampil di halaman';

COMMENT ON TABLE "categories" IS 'Kategori frame: Pria, Wanita, Anak, Sunglasses, Sport';

COMMENT ON COLUMN "categories"."name" IS 'Nama kategori';

COMMENT ON COLUMN "categories"."parent_id" IS 'Self-referencing untuk sub-kategori';

COMMENT ON TABLE "products" IS 'Produk frame kacamata utama';

COMMENT ON COLUMN "products"."sku" IS 'Stock Keeping Unit';

COMMENT ON COLUMN "products"."brand_id" IS 'FK → brands';

COMMENT ON COLUMN "products"."category_id" IS 'FK → categories (nullable)';

COMMENT ON COLUMN "products"."gender" IS 'pria | wanita | unisex | anak';

COMMENT ON COLUMN "products"."frame_material" IS 'acetate | metal | titanium | plastik | kombinasi | kayu';

COMMENT ON COLUMN "products"."frame_shape" IS 'round | square | oval | cat-eye | aviator | browline';

COMMENT ON COLUMN "products"."frame_width" IS 'Lebar total frame (mm)';

COMMENT ON COLUMN "products"."lens_width" IS 'Lebar lensa (mm)';

COMMENT ON COLUMN "products"."bridge_width" IS 'Jarak antar lensa (mm)';

COMMENT ON COLUMN "products"."temple_length" IS 'Panjang tangkai (mm)';

COMMENT ON COLUMN "products"."price" IS 'Harga jual (IDR)';

COMMENT ON COLUMN "products"."original_price" IS 'Harga sebelum diskon';

COMMENT ON COLUMN "products"."features" IS 'Array fitur produk';

COMMENT ON COLUMN "products"."tags" IS 'Array tag untuk pencarian';

COMMENT ON COLUMN "products"."images" IS 'Array URL gambar produk';

COMMENT ON COLUMN "products"."thumbnail_url" IS 'URL gambar utama';

COMMENT ON COLUMN "products"."is_featured" IS 'Tampil di homepage';

COMMENT ON COLUMN "products"."badge" IS 'Terlaris | Baru | Eksklusif | Premium';

COMMENT ON TABLE "product_variants" IS 'Varian warna & stok per produk';

COMMENT ON COLUMN "product_variants"."product_id" IS 'FK → products (CASCADE DELETE)';

COMMENT ON COLUMN "product_variants"."color_name" IS 'Nama warna varian (Black, Tortoise, Gold)';

COMMENT ON COLUMN "product_variants"."color_hex" IS 'Hex code warna #RRGGBB';

COMMENT ON COLUMN "product_variants"."stock" IS 'Stok tersedia (>= 0)';

COMMENT ON COLUMN "product_variants"."sku_variant" IS 'SKU spesifik varian';

COMMENT ON TABLE "lenses" IS 'Katalog lensa kacamata (dijual terpisah dari frame)';

COMMENT ON COLUMN "lenses"."brand_id" IS 'FK → brands (Essilor, Hoya, Zeiss)';

COMMENT ON COLUMN "lenses"."type" IS 'single_vision | progressive | bifocal | reading | sunglasses';

COMMENT ON COLUMN "lenses"."coating" IS 'anti-reflective | anti-blue-light | photochromic | uv400 | anti-scratch';

COMMENT ON COLUMN "lenses"."index_val" IS 'Indeks bias: 1.50 | 1.56 | 1.60 | 1.67 | 1.74';

COMMENT ON COLUMN "lenses"."price" IS 'Harga lensa (IDR)';

COMMENT ON TABLE "reviews" IS 'Ulasan dan rating produk dari pelanggan terverifikasi';

COMMENT ON COLUMN "reviews"."product_id" IS 'FK → products (CASCADE DELETE)';

COMMENT ON COLUMN "reviews"."customer_id" IS 'FK → customers (nullable)';

COMMENT ON COLUMN "reviews"."order_id" IS 'FK → orders (verified review)';

COMMENT ON COLUMN "reviews"."rating" IS '1–5 bintang';

COMMENT ON COLUMN "reviews"."images" IS 'URL foto ulasan pelanggan';

COMMENT ON COLUMN "reviews"."is_verified" IS 'Sudah beli = verified';

COMMENT ON COLUMN "reviews"."helpful_count" IS 'Jumlah ''ulasan ini membantu''';

COMMENT ON TABLE "customers" IS 'Data pelanggan + rekam medis resep kacamata terkini';

COMMENT ON COLUMN "customers"."gender" IS 'pria | wanita';

COMMENT ON COLUMN "customers"."re_sphere" IS 'OD Sphere / Sferris kanan';

COMMENT ON COLUMN "customers"."re_cylinder" IS 'OD Cylinder / Silinder kanan';

COMMENT ON COLUMN "customers"."re_axis" IS 'OD Axis 0–180 derajat';

COMMENT ON COLUMN "customers"."re_add" IS 'OD Addition (untuk lensa progresif)';

COMMENT ON COLUMN "customers"."le_sphere" IS 'OS Sphere / Sferris kiri';

COMMENT ON COLUMN "customers"."le_cylinder" IS 'OS Cylinder / Silinder kiri';

COMMENT ON COLUMN "customers"."le_axis" IS 'OS Axis 0–180 derajat';

COMMENT ON COLUMN "customers"."le_add" IS 'OS Addition';

COMMENT ON COLUMN "customers"."pd" IS 'Binocular Pupillary Distance (mm)';

COMMENT ON COLUMN "customers"."pd_right" IS 'Monocular PD kanan (mm)';

COMMENT ON COLUMN "customers"."pd_left" IS 'Monocular PD kiri (mm)';

COMMENT ON COLUMN "customers"."last_eye_exam" IS 'Tanggal pemeriksaan mata terakhir';

COMMENT ON COLUMN "customers"."notes" IS 'Catatan khusus pelanggan';

COMMENT ON TABLE "eye_exam_history" IS 'Riwayat lengkap pemeriksaan mata per kunjungan';

COMMENT ON COLUMN "eye_exam_history"."customer_id" IS 'FK → customers (CASCADE DELETE)';

COMMENT ON COLUMN "eye_exam_history"."appointment_id" IS 'FK → appointments';

COMMENT ON COLUMN "eye_exam_history"."optometrist_id" IS 'FK → optometrists';

COMMENT ON COLUMN "eye_exam_history"."exam_date" IS 'Tanggal pemeriksaan';

COMMENT ON COLUMN "eye_exam_history"."re_sphere" IS 'OD Sphere';

COMMENT ON COLUMN "eye_exam_history"."re_cylinder" IS 'OD Cylinder';

COMMENT ON COLUMN "eye_exam_history"."re_axis" IS 'OD Axis';

COMMENT ON COLUMN "eye_exam_history"."re_add" IS 'OD Add';

COMMENT ON COLUMN "eye_exam_history"."re_va_uncorr" IS 'OD Visual Acuity tanpa koreksi (misal 6/60)';

COMMENT ON COLUMN "eye_exam_history"."re_va_corr" IS 'OD Visual Acuity dengan koreksi';

COMMENT ON COLUMN "eye_exam_history"."le_sphere" IS 'OS Sphere';

COMMENT ON COLUMN "eye_exam_history"."le_cylinder" IS 'OS Cylinder';

COMMENT ON COLUMN "eye_exam_history"."le_axis" IS 'OS Axis';

COMMENT ON COLUMN "eye_exam_history"."le_add" IS 'OS Add';

COMMENT ON COLUMN "eye_exam_history"."le_va_uncorr" IS 'OS Visual Acuity tanpa koreksi';

COMMENT ON COLUMN "eye_exam_history"."le_va_corr" IS 'OS Visual Acuity dengan koreksi';

COMMENT ON COLUMN "eye_exam_history"."pd" IS 'Pupillary Distance (mm)';

COMMENT ON COLUMN "eye_exam_history"."re_iop" IS 'OD Intraocular Pressure mmHg (tekanan bola mata)';

COMMENT ON COLUMN "eye_exam_history"."le_iop" IS 'OS Intraocular Pressure mmHg';

COMMENT ON COLUMN "eye_exam_history"."notes" IS 'Catatan pemeriksaan dokter';

COMMENT ON COLUMN "eye_exam_history"."recommendations" IS 'Rekomendasi tindak lanjut';

COMMENT ON COLUMN "eye_exam_history"."next_exam_date" IS 'Jadwal pemeriksaan berikutnya';

COMMENT ON TABLE "users" IS 'Akun pengguna sistem (staff, optometrist, admin)';

COMMENT ON COLUMN "users"."password_hash" IS 'bcrypt hash';

COMMENT ON COLUMN "users"."role" IS 'customer | staff | optometrist | admin';

COMMENT ON TABLE "optometrists" IS 'Data dokter mata dan refraksionis optisien';

COMMENT ON COLUMN "optometrists"."user_id" IS 'FK → users (nullable, opsional)';

COMMENT ON COLUMN "optometrists"."title" IS 'Optometrist | Refraksionis Optisien | Dokter Mata';

COMMENT ON COLUMN "optometrists"."license_no" IS 'Nomor STR / SIP';

COMMENT ON COLUMN "optometrists"."specialization" IS 'Spesialisasi (lensa kontak, anak, dll)';

COMMENT ON COLUMN "optometrists"."work_days" IS 'Array hari kerja: Senin, Selasa, ...';

COMMENT ON COLUMN "optometrists"."work_hours_start" IS 'Jam mulai praktik';

COMMENT ON COLUMN "optometrists"."work_hours_end" IS 'Jam selesai praktik';

COMMENT ON TABLE "appointment_slots" IS 'Slot waktu pemeriksaan yang dapat dibooking. UNIQUE(optometrist_id, date, start_time)';

COMMENT ON COLUMN "appointment_slots"."optometrist_id" IS 'FK → optometrists (nullable)';

COMMENT ON COLUMN "appointment_slots"."date" IS 'Tanggal slot tersedia';

COMMENT ON COLUMN "appointment_slots"."start_time" IS 'Jam mulai slot';

COMMENT ON COLUMN "appointment_slots"."end_time" IS 'Jam selesai slot';

COMMENT ON COLUMN "appointment_slots"."max_patients" IS 'Kapasitas pasien per slot';

COMMENT ON COLUMN "appointment_slots"."booked_count" IS 'Jumlah sudah dibooking';

COMMENT ON TABLE "appointments" IS 'Booking janji pemeriksaan mata. booking_code di-generate via PG function';

COMMENT ON COLUMN "appointments"."booking_code" IS 'Kode unik: KRS-2412-XXXX';

COMMENT ON COLUMN "appointments"."customer_id" IS 'FK → customers (nullable)';

COMMENT ON COLUMN "appointments"."optometrist_id" IS 'FK → optometrists (nullable)';

COMMENT ON COLUMN "appointments"."slot_id" IS 'FK → appointment_slots (nullable)';

COMMENT ON COLUMN "appointments"."appointment_date" IS 'Tanggal janji temu';

COMMENT ON COLUMN "appointments"."appointment_time" IS 'Waktu janji temu';

COMMENT ON COLUMN "appointments"."service_type" IS 'Periksa Rutin | Konsultasi | Ganti Frame | dll';

COMMENT ON COLUMN "appointments"."status" IS 'pending | confirmed | in_progress | completed | cancelled';

COMMENT ON COLUMN "appointments"."notes" IS 'Catatan dari pasien saat booking';

COMMENT ON COLUMN "appointments"."exam_notes" IS 'Catatan dokter setelah memeriksa';

COMMENT ON COLUMN "appointments"."prescription" IS 'Resep: {OD:{sph,cyl,axis,add}, OS:{...}, PD:...}';

COMMENT ON COLUMN "appointments"."recommendation" IS 'Rekomendasi lensa / tindakan lanjut';

COMMENT ON COLUMN "appointments"."reminder_sent_at" IS 'Kapan reminder dikirim';

COMMENT ON COLUMN "appointments"."confirmed_at" IS 'Kapan appointment dikonfirmasi staff';

COMMENT ON COLUMN "appointments"."completed_at" IS 'Kapan pemeriksaan selesai';

COMMENT ON TABLE "orders" IS 'Pesanan kacamata. Trigger otomatis kurangi stok saat INSERT';

COMMENT ON COLUMN "orders"."order_code" IS 'Kode: ORD-241201-XXXX';

COMMENT ON COLUMN "orders"."customer_id" IS 'FK → customers (nullable)';

COMMENT ON COLUMN "orders"."appointment_id" IS 'FK → appointments (nullable)';

COMMENT ON COLUMN "orders"."product_id" IS 'FK → products (frame)';

COMMENT ON COLUMN "orders"."product_variant_id" IS 'FK → product_variants (warna)';

COMMENT ON COLUMN "orders"."lens_id" IS 'FK → lenses (tipe lensa)';

COMMENT ON COLUMN "orders"."rx_re_sphere" IS 'Resep OD Sphere saat pesan';

COMMENT ON COLUMN "orders"."rx_re_cylinder" IS 'Resep OD Cylinder saat pesan';

COMMENT ON COLUMN "orders"."rx_re_axis" IS 'Resep OD Axis saat pesan';

COMMENT ON COLUMN "orders"."rx_le_sphere" IS 'Resep OS Sphere saat pesan';

COMMENT ON COLUMN "orders"."rx_le_cylinder" IS 'Resep OS Cylinder saat pesan';

COMMENT ON COLUMN "orders"."rx_le_axis" IS 'Resep OS Axis saat pesan';

COMMENT ON COLUMN "orders"."rx_pd" IS 'PD saat pesan (mm)';

COMMENT ON COLUMN "orders"."frame_price" IS 'Harga frame (IDR)';

COMMENT ON COLUMN "orders"."lens_price" IS 'Harga lensa (IDR)';

COMMENT ON COLUMN "orders"."service_fee" IS 'Biaya jasa pasang (IDR)';

COMMENT ON COLUMN "orders"."discount_amount" IS 'Diskon (IDR)';

COMMENT ON COLUMN "orders"."total_price" IS 'Subtotal sebelum diskon';

COMMENT ON COLUMN "orders"."status" IS 'pending | processing | ready | delivered | cancelled';

COMMENT ON COLUMN "orders"."estimated_ready" IS 'Estimasi kacamata jadi';

COMMENT ON COLUMN "orders"."completed_at" IS 'Tanggal pesanan selesai/diambil';

COMMENT ON COLUMN "orders"."handled_by" IS 'FK → users (staff yang menangani)';

COMMENT ON TABLE "blog_posts" IS 'Artikel blog tips kesehatan mata dan panduan gaya';

COMMENT ON COLUMN "blog_posts"."excerpt" IS 'Ringkasan untuk preview';

COMMENT ON COLUMN "blog_posts"."content" IS 'Konten artikel (Markdown)';

COMMENT ON COLUMN "blog_posts"."category" IS 'Tips Kesehatan | Panduan Gaya | Produk Baru';

COMMENT ON COLUMN "blog_posts"."author_id" IS 'FK → users (nullable)';

COMMENT ON COLUMN "blog_posts"."read_time" IS 'Estimasi waktu baca (menit)';

ALTER TABLE "categories" ADD FOREIGN KEY ("parent_id") REFERENCES "categories" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("brand_id") REFERENCES "brands" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "product_variants" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "lenses" ADD FOREIGN KEY ("brand_id") REFERENCES "brands" ("id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("customer_id") REFERENCES "customers" ("id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "eye_exam_history" ADD FOREIGN KEY ("customer_id") REFERENCES "customers" ("id");

ALTER TABLE "eye_exam_history" ADD FOREIGN KEY ("appointment_id") REFERENCES "appointments" ("id");

ALTER TABLE "eye_exam_history" ADD FOREIGN KEY ("optometrist_id") REFERENCES "optometrists" ("id");

ALTER TABLE "optometrists" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "appointment_slots" ADD FOREIGN KEY ("optometrist_id") REFERENCES "optometrists" ("id");

ALTER TABLE "appointments" ADD FOREIGN KEY ("customer_id") REFERENCES "customers" ("id");

ALTER TABLE "appointments" ADD FOREIGN KEY ("optometrist_id") REFERENCES "optometrists" ("id");

ALTER TABLE "appointments" ADD FOREIGN KEY ("slot_id") REFERENCES "appointment_slots" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("customer_id") REFERENCES "customers" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("appointment_id") REFERENCES "appointments" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("product_variant_id") REFERENCES "product_variants" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("lens_id") REFERENCES "lenses" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("handled_by") REFERENCES "users" ("id");

ALTER TABLE "blog_posts" ADD FOREIGN KEY ("author_id") REFERENCES "users" ("id");
