import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductImage from "@/components/ProductImage";
import AddToCartButton from "@/components/AddToCartButton";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Fetch product details from DB
  const product = await prisma.product.findUnique({
    where: { id }
  });

  // Handle product not found
  if (!product) {
    notFound();
  }

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-8">
        <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-400">/</span>
        <span className="text-zinc-400">Products</span>
        <span className="mx-2 text-zinc-400">/</span>
        <span className="text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main product card */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start border border-zinc-200 bg-white rounded-2xl p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        
        {/* Left Column: Premium Vector Image */}
        <div className="overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800">
          <ProductImage type={product.imageUrl} className="h-96 w-full object-cover" />
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-3xl font-black text-brand-600 dark:text-brand-400">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Description & Details */}
          <div className="py-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Description</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Availability Info */}
          <div className="border-t border-zinc-100 py-6 dark:border-zinc-850">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Availability</span>
              <div>
                {isOutOfStock ? (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                    Low Stock: Only {product.stock} units left
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    In Stock ({product.stock} available)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-zinc-150 pt-8 dark:border-zinc-800">
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Add to Cart button */}
              <AddToCartButton product={product} className="flex-1 py-4 text-sm font-bold uppercase tracking-wider" />
              
              <Link
                href="/"
                className="flex items-center justify-center rounded-lg border border-zinc-200 px-6 py-3.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-855 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                Back to Shop
              </Link>
            </div>
          </div>

          {/* Warranty / Benefits */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free express delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>2-Year warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89" />
              </svg>
              <span>30-Day returns policy</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Dedicated tech support</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
