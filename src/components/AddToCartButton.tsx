"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    stock: number;
  };
  className?: string;
}

export default function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (product.stock <= 0) return;

    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <button
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={`relative flex items-center justify-center rounded-lg px-4 py-2.5 text-xs font-bold tracking-wide transition-all cursor-pointer ${
        isOutOfStock
          ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"
          : added
          ? "bg-emerald-600 text-white dark:bg-emerald-500 scale-102"
          : "bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 hover:shadow-lg active:scale-95"
      } ${className}`}
    >
      {isOutOfStock ? (
        "Out of Stock"
      ) : added ? (
        <span className="flex items-center gap-1 animate-pulse">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          Added!
        </span>
      ) : (
        "Add to Cart"
      )}
    </button>
  );
}
