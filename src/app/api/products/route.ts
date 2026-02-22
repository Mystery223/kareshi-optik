import { NextRequest, NextResponse } from 'next/server';
import { getProducts, type GetProductsFilters } from '@/lib/db/queries/products';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const gender = searchParams.get('gender') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const search = searchParams.get('search') || undefined;
    const rawSort = searchParams.get('sort');
    const sort: GetProductsFilters['sort'] =
        rawSort === 'price-asc' || rawSort === 'price-desc' || rawSort === 'popular' || rawSort === 'newest'
            ? rawSort
            : 'newest';
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;

    try {
        const results = await getProducts(
            { category, brand, gender, minPrice, maxPrice, search, sort },
            page,
            limit
        );

        return NextResponse.json(results);
    } catch (error) {
        console.error('[PRODUCTS_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
