"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils/format";

interface ProductCardProps {
    product: {
        id: string;
        slug: string;
        name: string;
        price: string;
        originalPrice: string | null;
        thumbnailUrl: string | null;
        images: unknown;
        gender: string | null;
        brand?: {
            name: string;
            slug: string;
        } | null;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const hasDiscount = product.originalPrice && Number(product.originalPrice) > Number(product.price);
    const brandSlug = product.brand?.slug ?? "";
    const brandImageMap: Record<string, string> = {
        "ray-ban": "/images/products/brands/ray-ban.svg",
        "oakley": "/images/products/brands/oakley.svg",
        "gucci": "/images/products/brands/gucci.svg",
        "tom-ford": "/images/products/brands/tom-ford.svg",
        "oliver-peoples": "/images/products/brands/oliver-peoples.svg",
    };
    const brandFallback = brandImageMap[brandSlug] ?? "/images/products/brands/default.svg";
    const imageSrc =
        product.thumbnailUrl ||
        (Array.isArray(product.images) ? product.images.find((img: unknown) => typeof img === "string") : null) ||
        brandFallback;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative"
        >
            <Link href={`/koleksi/${product.slug}`} className="block space-y-4">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-paper-mid border border-border/40 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-rose/10 group-hover:border-rose/20">
                    <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
                    />

                    {/* Badge */}
                    {hasDiscount && (
                        <div className="absolute top-6 left-6 bg-rose text-paper px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                            Sale
                        </div>
                    )}

                    {/* Quick Add Overlay (Optional aesthetic) */}
                    <div className="absolute inset-0 bg-ink/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-paper flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                            <span className="text-xl">↗</span>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-2 px-2">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose">
                            {product.brand?.name || 'Kareshi'}
                        </span>
                        <span className="text-[10px] font-medium text-ink-light uppercase tracking-widest">
                            {product.gender}
                        </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-ink group-hover:text-rose transition-colors line-clamp-1">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-3">
                        <span className="font-serif text-xl font-bold text-ink">
                            {formatPrice(product.price)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-ink-light line-through opacity-50">
                                {formatPrice(product.originalPrice!)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
