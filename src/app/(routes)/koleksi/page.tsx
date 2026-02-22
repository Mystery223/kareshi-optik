import { getProducts } from "@/lib/db/queries/products";
import { getBrands, getCategories } from "@/lib/db/queries/filters";
import ProductCard from "@/components/product/ProductCard";
import RevealWrapper from "@/components/ui/RevealWrapper";
import Link from "next/link";
import { type GetProductsFilters } from "@/lib/db/queries/products";

interface KoleksiPageProps {
    searchParams: Promise<{
        category?: string;
        brand?: string;
        gender?: string;
        minPrice?: string;
        maxPrice?: string;
        search?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function KoleksiPage({ searchParams }: KoleksiPageProps) {
    const params = await searchParams;
    const sortParam = params.sort;
    const sort: GetProductsFilters["sort"] =
        sortParam === "price-asc" || sortParam === "price-desc" || sortParam === "popular" || sortParam === "newest"
            ? sortParam
            : "newest";

    const filters = {
        category: params.category,
        brand: params.brand,
        gender: params.gender,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        search: params.search,
        sort,
    };

    const page = Number(params.page) || 1;
    const { items, metadata } = await getProducts(filters, page, 16);

    const categories = await getCategories();
    const brands = await getBrands();

    return (
        <main className="min-h-screen bg-paper pt-32 pb-24">
            <div className="container mx-auto px-6">
                {/* Header */}
                <section className="mb-20 space-y-6">
                    <RevealWrapper>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                            Curated Collection
                        </span>
                    </RevealWrapper>
                    <RevealWrapper delay={0.2}>
                        <h1 className="font-serif text-6xl md:text-8xl font-bold text-ink">
                            Katalog <span className="italic text-rose">Kareshi</span>
                        </h1>
                    </RevealWrapper>
                </section>

                <div className="grid lg:grid-cols-4 gap-12 items-start">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block space-y-12 sticky top-40">
                        {/* Categories */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light border-b border-border pb-4">Categories</h4>
                            <ul className="space-y-4">
                                <li>
                                    <Link href="/koleksi" className="text-sm font-medium hover:text-rose transition-colors">Semua Produk</Link>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <Link
                                            href={`/koleksi?category=${cat.slug}`}
                                            className={`text-sm font-medium transition-colors ${filters.category === cat.slug ? 'text-rose' : 'hover:text-rose'}`}
                                        >
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Brands */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light border-b border-border pb-4">Featured Brands</h4>
                            <ul className="space-y-4">
                                {brands.map((brand) => (
                                    <li key={brand.id}>
                                        <Link
                                            href={`/koleksi?brand=${brand.slug}`}
                                            className={`text-sm font-medium transition-colors ${filters.brand === brand.slug ? 'text-rose' : 'hover:text-rose'}`}
                                        >
                                            {brand.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Gender */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light border-b border-border pb-4">Gender</h4>
                            <div className="flex flex-wrap gap-2">
                                {['pria', 'wanita', 'unisex', 'anak'].map((g) => (
                                    <Link
                                        key={g}
                                        href={`/koleksi?gender=${g}`}
                                        className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${filters.gender === g ? 'bg-ink text-paper border-ink' : 'border-border text-ink-mid hover:border-rose hover:text-rose'}`}
                                    >
                                        {g}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Grid */}
                    <div className="lg:col-span-3 space-y-16">
                        {/* Top Bar (Sort & Results) */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border">
                            <p className="text-sm text-ink-mid">
                                Menampilan <span className="font-bold text-ink">{items.length}</span> dari <span className="font-bold text-ink">{metadata.total}</span> produk
                            </p>

                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-ink-light">Urutkan:</span>
                                <select className="bg-transparent text-sm font-bold uppercase tracking-widest outline-none cursor-pointer hover:text-rose transition-colors">
                                    <option value="newest">Terbaru</option>
                                    <option value="price-asc">Harga Terendah</option>
                                    <option value="price-desc">Harga Tertinggi</option>
                                    <option value="popular">Terpopuler</option>
                                </select>
                            </div>
                        </div>

                        {/* Grid */}
                        {items.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                                {items.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center space-y-6">
                                <div className="text-6xl italic font-serif text-ink-light opacity-20">No results</div>
                                <h3 className="text-2xl font-serif font-bold text-ink">Kami tidak dapat menemukan produk yang sesuai.</h3>
                                <Link href="/koleksi" className="inline-block px-8 py-4 bg-ink text-paper rounded-full text-xs font-bold uppercase tracking-widest">
                                    Reset Filter
                                </Link>
                            </div>
                        )}

                        {/* Pagination Placeholder */}
                        {metadata.totalPages > 1 && (
                            <div className="flex justify-center gap-4 pt-12">
                                {[...Array(metadata.totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <Link
                                            key={pageNum}
                                            href={`/koleksi?page=${pageNum}`}
                                            className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${page === pageNum ? 'bg-ink text-paper scale-110 shadow-lg' : 'bg-paper-mid text-ink-mid hover:bg-rose hover:text-paper shadow-sm'}`}
                                        >
                                            {pageNum}
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
