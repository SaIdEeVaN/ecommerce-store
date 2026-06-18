"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import ProductImage from "@/components/ProductImage";

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
  });

  const [payment, setPayment] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  const shippingCost = cartTotal > 150 ? 0 : 15;
  const estimatedTax = cartTotal * 0.08;
  const orderTotal = cartTotal + shippingCost + estimatedTax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, section: "shipping" | "payment") => {
    const { name, value } = e.target;
    if (section === "shipping") {
      setShipping((prev) => ({ ...prev, [name]: value }));
    } else {
      setPayment((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!shipping.name || !shipping.address || !shipping.city || !shipping.postalCode) {
      setError("Please fill out all shipping fields.");
      setLoading(false);
      return;
    }

    if (!payment.cardNumber || !payment.expiry || !payment.cvc) {
      setError("Please fill out all payment fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount: orderTotal,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      // Order placed successfully
      setPlacedOrder(data);
      clearCart();
    } catch (err: any) {
      setError(err.message || "An error occurred while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (placedOrder) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-20">
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 rounded-2xl shadow-lg">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <svg className="h-10 w-10 animate-scaleIn" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="mt-6 text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-wide">
            Order Confirmed!
          </h2>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Thank you for shopping with VORTEX. Your order has been placed successfully.
          </p>

          <div className="mt-6 w-full rounded-xl bg-zinc-50 p-4 border border-zinc-150 dark:bg-zinc-950/50 dark:border-zinc-850 text-left text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <div className="flex justify-between border-b border-zinc-200 pb-2 mb-2 dark:border-zinc-800">
              <span className="font-semibold text-zinc-500">Order ID:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{placedOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-zinc-500">Total Paid:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">${orderTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
            <Link
              href="/orders"
              className="flex-1 rounded-lg bg-brand-600 py-3 text-xs font-bold text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-center uppercase tracking-wider"
            >
              Track Order
            </Link>
            <Link
              href="/"
              className="flex-1 rounded-lg border border-zinc-200 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 text-center uppercase tracking-wider"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Cart empty fallback (if they navigate directly here)
  if (cartItems.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">No items to checkout</h2>
        <p className="mt-2 text-zinc-500">Please add items to your cart first.</p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 text-xs font-bold text-white hover:bg-brand-700">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight mb-8">
        Secure Checkout
      </h1>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200 dark:bg-red-950/20 dark:border-red-900 text-sm font-semibold text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
        
        {/* Shipping & Payment Fields */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Shipping Form */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6 uppercase tracking-wide">
              1. Shipping Address
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={shipping.name}
                  onChange={(e) => handleInputChange(e, "shipping")}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={shipping.address}
                  onChange={(e) => handleInputChange(e, "shipping")}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                  placeholder="123 Creator Lane"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shipping.city}
                  onChange={(e) => handleInputChange(e, "shipping")}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                  placeholder="San Francisco"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={shipping.postalCode}
                  onChange={(e) => handleInputChange(e, "shipping")}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                  placeholder="94103"
                />
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6 uppercase tracking-wide">
              2. Payment Method (Simulation)
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  required
                  maxLength={19}
                  value={payment.cardNumber}
                  onChange={(e) => handleInputChange(e, "payment")}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                  placeholder="4111 2222 3333 4444"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  required
                  maxLength={5}
                  value={payment.expiry}
                  onChange={(e) => handleInputChange(e, "payment")}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">CVC</label>
                <input
                  type="text"
                  name="cvc"
                  required
                  maxLength={4}
                  value={payment.cvc}
                  onChange={(e) => handleInputChange(e, "payment")}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                  placeholder="123"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Order Review Sidebar */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm flex flex-col gap-5">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Review Items
            </h2>

            {/* List mini items */}
            <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 flex-shrink-0 rounded bg-zinc-100 border border-zinc-200 overflow-hidden dark:border-zinc-800">
                    <ProductImage type={item.imageUrl} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{item.name}</p>
                    <p className="text-zinc-500 mt-0.5">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-y border-zinc-100 py-4 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-900 dark:text-zinc-50 font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-zinc-900 dark:text-zinc-50 font-bold">
                  {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
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

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-brand-600 py-3.5 text-xs font-bold text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider cursor-pointer"
            >
              {loading ? "Processing..." : `Pay $${orderTotal.toFixed(2)}`}
            </button>
            
            <Link
              href="/cart"
              className="text-center text-xs font-bold text-zinc-500 hover:underline"
            >
              Edit Cart
            </Link>
          </div>
        </div>

      </form>
    </div>
  );
}
