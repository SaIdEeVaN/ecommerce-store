import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProductImage from "@/components/ProductImage";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/orders");
  }

  // Fetch orders for this customer
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 flex-1 flex flex-col">
      <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight mb-8">
        Your Order History
      </h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 rounded-2xl shadow-sm">
          <svg className="h-16 w-16 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">No orders found</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">You haven&apos;t placed any orders with us yet.</p>
          <Link
            href="/"
            className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 shadow-md active:scale-95 transition-all uppercase tracking-wider"
          >
            Go to Catalog
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            });

            return (
              <div
                key={order.id}
                className="overflow-hidden border border-zinc-200 bg-white rounded-2xl dark:border-zinc-800 dark:bg-zinc-900 shadow-sm"
              >
                {/* Order Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950/20">
                  <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                    <div>
                      <p className="uppercase text-[10px] text-zinc-400 mb-0.5">Order Placed</p>
                      <p className="text-zinc-900 dark:text-zinc-100 font-bold">{dateStr}</p>
                    </div>
                    <div>
                      <p className="uppercase text-[10px] text-zinc-400 mb-0.5">Order ID</p>
                      <p className="font-mono text-zinc-800 dark:text-zinc-200">{order.id}</p>
                    </div>
                    <div>
                      <p className="uppercase text-[10px] text-zinc-400 mb-0.5">Total Paid</p>
                      <p className="text-zinc-900 dark:text-zinc-100 font-bold">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div>
                    {order.status === "COMPLETED" ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        Delivered
                      </span>
                    ) : order.status === "CANCELLED" ? (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                        Cancelled
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>

                {/* Items in this order */}
                <div className="divide-y divide-zinc-100 dark:divide-zinc-850">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 px-6 py-5">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-zinc-50 border border-zinc-150 dark:bg-zinc-950 dark:border-zinc-800">
                        <ProductImage type={item.product.imageUrl} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.productId}`} className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-zinc-500 mt-1">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-sm font-black text-zinc-900 dark:text-zinc-50">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
