import { db } from '@/lib/db';
import { brands, categories } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function getCategories() {
    return await db.query.categories.findMany({
        where: eq(categories.isActive, true),
        orderBy: asc(categories.sortOrder)
    });
}

export async function getBrands() {
    return await db.query.brands.findMany({
        where: eq(brands.isActive, true),
        orderBy: asc(brands.name)
    });
}
