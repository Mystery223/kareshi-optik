import { getProductBySlug, getRelatedProducts } from "@/lib/db/queries/products";
import { notFound } from "next/navigation";
import RevealWrapper from "@/components/ui/RevealWrapper";
import { formatPrice } from "@/lib/utils/format";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import Image from "next/image";

interface ProductDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const brandImageMap: Record<string, string> = {
        "ray-ban": "/images/products/brands/ray-ban.svg",
        "oakley": "/images/products/brands/oakley.svg",
        "gucci": "/images/products/brands/gucci.svg",
        "tom-ford": "/images/products/brands/tom-ford.svg",
        "oliver-peoples": "/images/products/brands/oliver-peoples.svg",
    };
    const brandFallback = brandImageMap[product.brand?.slug || ""] || "/images/products/brands/default.svg";
    const rawImages = Array.isArray(product.images)
        ? product.images.filter((item): item is string => typeof item === "string")
        : [];
    const galleryImages = Array.from(new Set([product.thumbnailUrl, ...rawImages].filter(Boolean))) as string[];
    const mainImage = galleryImages[0] || brandFallback;
    const thumbImages = (galleryImages.length > 0 ? galleryImages : [brandFallback]).slice(0, 4);

    const relatedProducts = await getRelatedProducts(product.id, product.categoryId, 4);

    return (
        <main className="min-h-screen bg-paper pt-32 pb-32">
            <div className="container mx-auto px-6">
                {/* Breadcrumbs */}
                <nav className="mb-12 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-ink-light">
                    <Link href="/" className="hover:text-ink">Home</Link>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <Link href="/koleksi" className="hover:text-ink">Koleksi</Link>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span className="text-rose">{product.name}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    {/* Left: Gallery */}
                    <RevealWrapper direction="left">
                        <div className="space-y-6">
                            <div className="relative aspect-[4/5] bg-paper-mid rounded-[40px] border border-border/40 overflow-hidden">
                                <Image
                                    src={mainImage}
                                    alt={product.name}
                                    fill
                                    priority
                                    sizes="(min-width: 1024px) 40vw, 100vw"
                                    className="object-cover"
                                />
                            </div>

                            {/* Thumbnail Row */}
                            <div className="grid grid-cols-4 gap-4">
                                {thumbImages.map((img, i) => (
                                    <div key={`${img}-${i}`} className="relative aspect-square bg-paper-mid rounded-2xl border border-border/20 overflow-hidden">
                                        <Image
                                            src={img}
                                            alt={`${product.name} thumbnail ${i + 1}`}
                                            fill
                                            sizes="12vw"
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RevealWrapper>

                    {/* Right: Info */}
                    <div className="space-y-12">
                        <RevealWrapper className="space-y-6">
                            <div className="space-y-2">
                                <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                                    {product.brand?.name} — {product.gender}
                                </span>
                                <h1 className="font-serif text-5xl md:text-7xl font-bold text-ink leading-[1.1]">
                                    {product.name}
                                </h1>
                            </div>

                            <div className="flex items-center gap-6">
                                <span className="font-serif text-4xl font-bold text-ink">
                                    {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                                    <span className="text-xl text-ink-light line-through opacity-50 font-serif">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                )}
                            </div>

                            <p className="text-ink-mid text-lg leading-relaxed max-w-xl">
                                {product.description || "Kacamata kurasi premium dengan desain kontemporer yang memberikan kenyamanan maksimal bagi pemakainya."}
                            </p>
                        </RevealWrapper>

                        {/* Variants */}
                        <RevealWrapper delay={0.2} className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light border-b border-border pb-4">Select Color Variant</h4>
                            <div className="flex gap-4">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        className="group flex flex-col items-center gap-3 outline-none"
                                    >
                                        <div
                                            className="h-10 w-10 rounded-full border-2 border-paper ring-1 ring-border group-hover:ring-rose transition-all"
                                            style={{ backgroundColor: variant.colorHex || '#ccc' }}
                                        />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-ink-mid opacity-0 group-hover:opacity-100 transition-opacity">
                                            {variant.colorName}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </RevealWrapper>

                        {/* Specs */}
                        <RevealWrapper delay={0.4} className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light border-b border-border pb-4">Specifications</h4>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-ink-light mb-1">SKU</p>
                                    <p className="text-sm font-bold text-ink">{product.sku}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-ink-light mb-1">Material</p>
                                    <p className="text-sm font-bold text-ink">{product.material || "High-grade Acetate"}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-ink-light mb-1">Shape</p>
                                    <p className="text-sm font-bold text-ink capitalize">{product.shape || "Classic"}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-ink-light mb-1">Dimension</p>
                                    <p className="text-sm font-bold text-ink">{product.dimension || "52-18-140"}</p>
                                </div>
                            </div>
                        </RevealWrapper>

                        {/* Action */}
                        <RevealWrapper delay={0.6} className="pt-8">
                            <button className="w-full bg-ink text-paper py-6 rounded-full font-bold uppercase tracking-[0.3em] text-xs hover:bg-rose transition-colors active:scale-95 shadow-xl shadow-ink/10">
                                Pre-Order / Konsultasi
                            </button>
                            <p className="text-center mt-6 text-[10px] text-ink-light font-medium uppercase tracking-[0.1em]">
                                Gratis periksa mata untuk setiap pembelian frame
                            </p>
                        </RevealWrapper>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-48 pt-32 border-t border-border">
                        <RevealWrapper className="mb-16">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose">You Might Also Like</span>
                            <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink mt-2">Koleksi <span className="italic">Serupa</span></h2>
                        </RevealWrapper>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
