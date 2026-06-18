import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductImage from "@/components/ProductImage";
import AddToCartButton from "@/components/AddToCartButton";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { search, category } = await searchParams;
  
  const searchVal = typeof search === "string" ? search : undefined;
  const categoryVal = typeof category === "string" ? category : undefined;

  // Build dynamic database query
  const query: any = {};
  const conditions: any[] = [];
  
  if (searchVal) {
    conditions.push({
      OR: [
        { name: { contains: searchVal, mode: "insensitive" } },
        { description: { contains: searchVal, mode: "insensitive" } }
      ]
    });
  }
  
  if (categoryVal) {
    if (categoryVal === "keyboards") {
      conditions.push({
        OR: [
          { name: { contains: "keyboard", mode: "insensitive" } },
          { description: { contains: "keyboard", mode: "insensitive" } }
        ]
      });
    } else if (categoryVal === "audio") {
      conditions.push({
        OR: [
          { name: { contains: "headset", mode: "insensitive" } },
          { name: { contains: "headphones", mode: "insensitive" } },
          { description: { contains: "headset", mode: "insensitive" } },
          { description: { contains: "headphones", mode: "insensitive" } }
        ]
      });
    } else if (categoryVal === "accessories") {
      conditions.push({
        OR: [
          { name: { contains: "mouse", mode: "insensitive" } },
          { name: { contains: "backpack", mode: "insensitive" } },
          { name: { contains: "lamp", mode: "insensitive" } },
          { description: { contains: "mouse", mode: "insensitive" } },
          { description: { contains: "backpack", mode: "insensitive" } },
          { description: { contains: "lamp", mode: "insensitive" } }
        ]
      });
    }
  }
  
  if (conditions.length > 0) {
    query.where = { AND: conditions };
  }
  
  query.orderBy = { createdAt: "desc" };

  const products = await prisma.product.findMany(query);

  const categories = [
    { name: "All", id: "" },
    { name: "Keyboards", id: "keyboards" },
    { name: "Audio", id: "audio" },
    { name: "Accessories", id: "accessories" }
  ];

  return (
    <div className="flex flex-col flex-1 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-tr from-brand-900 via-indigo-950 to-zinc-950 py-24 px-6 text-center sm:px-12 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl uppercase">
            Elevate Your Workspace
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-300">
            Discover precision-engineered mechanical keyboards, studio-grade audio components, and smart desk essentials designed to maximize your focus.
          </p>
        </div>
      </section>

      {/* Catalog Search & Filters */}
      <section className="mx-auto mt-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = (!categoryVal && cat.id === "") || (categoryVal === cat.id);
              return (
                <Link
                  key={cat.name}
                  href={{
                    pathname: "/",
                    query: {
                      ...(searchVal ? { search: searchVal } : {}),
                      ...(cat.id ? { category: cat.id } : {})
                    }
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all ${
                    isActive
                      ? "bg-brand-600 text-white shadow-md dark:bg-brand-500"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <form action="/" method="GET" className="flex w-full max-w-md items-center gap-2">
            <input
              type="text"
              name="search"
              placeholder="Search catalog..."
              defaultValue={searchVal || ""}
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-brand-500 dark:focus:ring-brand-500"
            />
            {categoryVal && <input type="hidden" name="category" value={categoryVal} />}
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

        </div>

        {/* Product Grid */}
        <div className="mt-8">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg className="h-16 w-16 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">No products found</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Try adjusting your filters or search terms.</p>
              <Link
                href="/"
                className="mt-6 rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {products.map((product) => {
                const isLowStock = product.stock > 0 && product.stock <= 5;
                const isOutOfStock = product.stock <= 0;
                
                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm hover-lift dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {/* Link around Image and Details */}
                    <Link href={`/products/${product.id}`} className="block">
                      <ProductImage type={product.imageUrl} className="h-48 w-full transition-transform duration-500 group-hover:scale-105" />
                      
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {product.name}
                          </h3>
                          <span className="text-base font-black text-zinc-900 dark:text-zinc-50">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </Link>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between border-t border-zinc-100 p-5 dark:border-zinc-850">
                      {/* Stock Indicator Badge */}
                      <div>
                        {isOutOfStock ? (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                            Sold Out
                          </span>
                        ) : isLowStock ? (
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                            Only {product.stock} left
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            In Stock
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Interactive Button */}
                      <AddToCartButton product={product} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
