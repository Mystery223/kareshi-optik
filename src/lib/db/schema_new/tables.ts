import { pgTable, uuid, varchar, text, boolean, integer, decimal, date, time, timestamp, pgEnum, jsonb, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// --- Enums ---
export const userRoleEnum = pgEnum('user_role', ['admin', 'staff', 'customer']);
export const lensTypeEnum = pgEnum('lens_type', ['single_vision', 'bifocal', 'progressive', 'photochromic', 'blue_light', 'sunglass']);
export const appointmentStatusEnum = pgEnum('appointment_status', ['pending', 'confirmed', 'completed', 'cancelled', 'no_show']);
export const sortOrderEnum = pgEnum('sort_order', ['asc', 'desc']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'processing', 'ready', 'completed', 'cancelled']);

// --- Tabel ---

export const brands = pgTable('brands', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    logoUrl: text('logo_url'),
    country: varchar('country', { length: 100 }),
    description: text('description'),
    website: varchar('website', { length: 255 }),
    isPremium: boolean('is_premium').default(false).notNull(),
    sortOrder: integer('sort_order').default(0),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const categories = pgTable('categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    description: text('description'),
    parentId: uuid('parent_id'),
    imageUrl: text('image_url'),
    sortOrder: integer('sort_order').default(0),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    sku: varchar('sku', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    brandId: uuid('brand_id').references(() => brands.id).notNull(),
    categoryId: uuid('category_id').references(() => categories.id),
    gender: varchar('gender', { length: 20 }),
    material: varchar('material', { length: 100 }),
    shape: varchar('shape', { length: 100 }),
    dimension: varchar('dimension', { length: 50 }),
    price: decimal('price', { precision: 12, scale: 2 }).notNull(),
    originalPrice: decimal('original_price', { precision: 12, scale: 2 }),
    description: text('description'),
    features: jsonb('features'),
    tags: jsonb('tags'),
    images: jsonb('images'),
    thumbnailUrl: text('thumbnail_url'),
    isActive: boolean('is_active').default(true).notNull(),
    itemSold: integer('item_sold').default(0).notNull(),
    rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'),
    reviewCount: integer('review_count').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    searchIndex: index('search_index').using('gin', sql`to_tsvector('indonesian', ${table.name} || ' ' || ${table.description})`),
}));

export const productVariants = pgTable('product_variants', {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    colorName: varchar('color_name', { length: 100 }),
    colorHex: varchar('color_hex', { length: 7 }),
    stock: integer('stock').default(0).notNull(),
    skuVariant: varchar('sku_variant', { length: 50 }).unique(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const lenses = pgTable('lenses', {
    id: uuid('id').defaultRandom().primaryKey(),
    brandId: uuid('brand_id').references(() => brands.id),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    type: lensTypeEnum('type').notNull(),
    coating: jsonb('coating'),
    indexVal: decimal('index_val', { precision: 3, scale: 2 }),
    price: decimal('price', { precision: 12, scale: 2 }).notNull(),
    description: text('description'),
    features: jsonb('features'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    role: userRoleEnum('role').default('staff').notNull(),
    avatarUrl: text('avatar_url'),
    isActive: boolean('is_active').default(true).notNull(),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const optometrists = pgTable('optometrists', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id),
    name: varchar('name', { length: 255 }).notNull(),
    title: varchar('title', { length: 100 }),
    licenseNo: varchar('license_no', { length: 100 }),
    photoUrl: text('photo_url'),
    specialization: text('specialization'),
    workDays: jsonb('work_days'),
    bio: text('bio'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const appointmentSlots = pgTable('appointment_slots', {
    id: uuid('id').defaultRandom().primaryKey(),
    dayOfWeek: integer('day_of_week'),
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    maxPatients: integer('max_patients').default(1).notNull(),
    date: date('date'),
    isAvailable: boolean('is_available').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const appointments = pgTable('appointments', {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingCode: varchar('booking_code', { length: 20 }).notNull().unique(),
    customerId: uuid('customer_id').references(() => customers.id),
    guestName: varchar('guest_name', { length: 100 }),
    guestPhone: varchar('guest_phone', { length: 20 }),
    guestEmail: varchar('guest_email', { length: 255 }),

    optometristId: uuid('optometrist_id').references(() => optometrists.id),
    appointmentDate: date('appointment_date').notNull(),
    appointmentTime: time('appointment_time').notNull(),
    serviceType: varchar('service_type', { length: 100 }).notNull(),
    status: appointmentStatusEnum('status').default('pending').notNull(),
    notes: text('notes'),

    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    cancellationReason: text('cancellation_reason'),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const customers = pgTable('customers', {
    id: uuid('id').defaultRandom().primaryKey(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }),
    email: varchar('email', { length: 255 }).unique(),
    phone: varchar('phone', { length: 20 }),
    birthDate: date('birth_date'),
    gender: varchar('gender', { length: 10 }),
    address: text('address'),
    city: varchar('city', { length: 100 }),
    lastEyeExam: date('last_eye_exam'),
    notes: text('notes'),
    totalOrders: integer('total_orders').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const eyeExamHistory = pgTable('eye_exam_history', {
    id: uuid('id').defaultRandom().primaryKey(),
    customerId: uuid('customer_id').references(() => customers.id).notNull(),
    appointmentId: uuid('appointment_id').references(() => appointments.id),
    optometristId: uuid('optometrist_id').references(() => optometrists.id),
    examDate: date('exam_date').notNull(),

    reSphere: decimal('re_sphere', { precision: 4, scale: 2 }),
    reCylinder: decimal('re_cylinder', { precision: 4, scale: 2 }),
    reAxis: integer('re_axis'),
    reAdd: decimal('re_add', { precision: 4, scale: 2 }),

    leSphere: decimal('le_sphere', { precision: 4, scale: 2 }),
    leCylinder: decimal('le_cylinder', { precision: 4, scale: 2 }),
    leAxis: integer('le_axis'),
    leAdd: decimal('le_add', { precision: 4, scale: 2 }),

    pd: decimal('pd', { precision: 4, scale: 2 }),
    notes: text('notes'),
    nextExamDate: date('next_exam_date'),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable('orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    orderCode: varchar('order_code', { length: 20 }).notNull().unique(),
    customerId: uuid('customer_id').references(() => customers.id),
    appointmentId: uuid('appointment_id').references(() => appointments.id),
    productId: uuid('product_id').references(() => products.id),
    productVariantId: uuid('product_variant_id').references(() => productVariants.id),
    lensId: uuid('lens_id').references(() => lenses.id),
    totalPrice: decimal('total_price', { precision: 15, scale: 2 }).notNull(),
    paymentMethod: varchar('payment_method', { length: 50 }),
    status: orderStatusEnum('status').default('pending').notNull(),
    estimatedReady: date('estimated_ready'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    notes: text('notes'),
    handledBy: uuid('handled_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const reviews = pgTable('reviews', {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    customerName: varchar('customer_name', { length: 100 }).notNull(),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    isVerified: boolean('is_verified').default(false).notNull(),
    isPublished: boolean('is_published').default(false).notNull(),
    helpfulCount: integer('helpful_count').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const blogPosts = pgTable('blog_posts', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    coverImage: text('cover_image'),
    category: varchar('category', { length: 100 }),
    authorId: uuid('author_id').references(() => users.id),
    tags: jsonb('tags'),
    isPublished: boolean('is_published').default(false).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    viewCount: integer('view_count').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
