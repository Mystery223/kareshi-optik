import { db } from './index';
import * as schema from './schema';

async function seed() {
    console.log('🌱 Seeding database...');

    // 1. Brands
    const brandsData = [
        { name: 'Ray-Ban', slug: 'ray-ban', country: 'Italy', description: 'Timeless style, authenticity and freedom of expression are the core values of Ray-Ban.' },
        { name: 'Oakley', slug: 'oakley', country: 'USA', description: 'The leader in performance eyewear and sport specialized goggles.' },
        { name: 'Gucci', slug: 'gucci', country: 'Italy', description: 'Influential, innovative and progressive, Gucci is reinventing a wholly modern approach to fashion.' },
        { name: 'Tom Ford', slug: 'tom-ford', country: 'USA', description: 'Tom Ford is the first true luxury brand of the 21st century.' },
        { name: 'Oliver Peoples', slug: 'oliver-peoples', country: 'USA', description: 'Vintage-inspired eyewear handcrafted from the finest quality materials.' },
    ];

    const brandRows = await db.insert(schema.brands).values(brandsData).returning();
    console.log(`✅ Seeded ${brandRows.length} brands`);

    // 2. Categories
    const categoriesData = [
        { name: 'Kacamata Pria', slug: 'pria', description: 'Koleksi bingkai kacamata khusus pria.' },
        { name: 'Kacamata Wanita', slug: 'wanita', description: 'Koleksi bingkai kacamata khusus wanita.' },
        { name: 'Kacamata Anak', slug: 'anak', description: 'Bingkai kacamata yang aman dan nyaman untuk anak.' },
        { name: 'Sunglasses', slug: 'sunglasses', description: 'Kacamata hitam dengan perlindungan UV maksimal.' },
        { name: 'Sport', slug: 'sport', description: 'Kacamata khusus olahraga dengan durabilitas tinggi.' },
    ];

    const catRows = await db.insert(schema.categories).values(categoriesData).returning();
    console.log(`✅ Seeded ${catRows.length} categories`);

    // 3. User & Optometrists
    const userRows = await db.insert(schema.users).values([
        {
            name: 'Admin Kareshi',
            email: 'admin@kareshi-optik.com',
            password: 'hashed_password_here', // In real app, hash this
            role: 'admin',
        },
        {
            name: 'Dr. Andi Pratama',
            email: 'andi@kareshi-optik.com',
            password: 'hashed_password_here',
            role: 'staff',
        }
    ]).returning();

    await db.insert(schema.optometrists).values([
        {
            userId: userRows[1].id,
            name: 'Dr. Andi Pratama, Opt.',
            title: 'Senior Optometrist',
            licenseNo: 'STR-123456789',
            specialization: 'Pemeriksaan Mata Anak & Lensa Kontak',
            workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        }
    ]);
    console.log('✅ Seeded users and optometrists');

    // 4. Products & Variants (Sample)
    const rayBanBrand = brandRows.find(b => b.name === 'Ray-Ban');
    const priaCat = catRows.find(c => c.name === 'Kacamata Pria');

    if (rayBanBrand && priaCat) {
        const productRows = await db.insert(schema.products).values([
            {
                sku: 'RB-CLB-MSTR-01',
                name: 'Clubmaster Classic',
                slug: 'clubmaster-classic',
                brandId: rayBanBrand.id,
                categoryId: priaCat.id,
                gender: 'pria',
                material: 'Acetate & Metal',
                shape: 'kotak',
                price: '2150000',
                description: 'Ray-Ban Clubmaster Classic sunglasses are retro and timeless.',
                isActive: true,
            }
        ]).returning();

        await db.insert(schema.productVariants).values([
            {
                productId: productRows[0].id,
                colorName: 'Black on Gold',
                colorHex: '#000000',
                stock: 5,
                skuVariant: 'RB-CLB-MSTR-01-BKGD',
            },
            {
                productId: productRows[0].id,
                colorName: 'Tortoise on Gold',
                colorHex: '#5C4033',
                stock: 3,
                skuVariant: 'RB-CLB-MSTR-01-TRGD',
            }
        ]);
    }

    console.log('✅ Seeded sample products and variants');
    console.log('🌱 Seeding complete!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
