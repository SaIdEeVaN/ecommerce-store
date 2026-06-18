"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import ProductImage from "@/components/ProductImage";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  const shippingCost = cartTotal > 150 ? 0 : cartTotal > 0 ? 15 : 0;
  const estimatedTax = cartTotal * 0.08; // 8% mock tax
  const orderTotal = cartTotal + shippingCost + estimatedTax;

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <svg className="h-16 w-16 text-zinc-300 dark:text-zinc-700 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="mt-4 text-xl font-extrabold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
            Your Cart is Empty
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-lg bg-brand-600 px-6 py-3 text-xs font-bold text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 shadow-md active:scale-95 transition-transform"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1 flex flex-col">
      <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight mb-8">
        Shopping Cart ({cartCount})
      </h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 sm:gap-6 border border-zinc-200 bg-white rounded-xl p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm"
            >
              {/* Product illustration */}
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-100 dark:border-zinc-800">
                <ProductImage type={item.imageUrl} className="h-full w-full object-cover" />
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <Link href={`/products/${item.id}`} className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Price: ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Price total and delete button */}
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <span className="text-sm font-black text-zinc-900 dark:text-zinc-50">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm flex flex-col gap-5">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Order Summary
            </h2>
            
            <div className="flex flex-col gap-3 border-y border-zinc-100 py-4 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-900 dark:text-zinc-50 font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-zinc-900 dark:text-zinc-50 font-bold">
                  {shippingCost === 0 ? "Free Shipping" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="text-zinc-900 dark:text-zinc-50 font-bold">${estimatedTax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-sm font-black text-zinc-900 dark:text-zinc-50">
              <span>Total Amount</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-brand-600 py-3.5 text-xs font-bold text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 hover:shadow-lg active:scale-95 transition-all text-center uppercase tracking-wider"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/"
              className="text-center text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
