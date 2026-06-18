"use client";

import React, { useState, useEffect } from "react";
import ProductImage from "@/components/ProductImage";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "keyboard",
    stock: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch products on mount
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl || "keyboard",
      stock: product.stock.toString()
    });
    setShowForm(true);
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      description: "",
      price: "",
      imageUrl: "keyboard",
      stock: ""
    });
    setShowForm(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setError(null);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete product");

      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
            Manage Products
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Create, update, and manage your inventory.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNewClick}
            className="rounded-lg bg-brand-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Add New Product
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-250 dark:bg-red-950/20 dark:border-red-900 text-sm font-semibold text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Product Creator/Editor Form */}
      {showForm && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm animate-fadeIn">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-6">
            {editingProduct ? `Edit ${editingProduct.name}` : "Create New Product"}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                placeholder="Apex Keyboard"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Visual Style Illustration</label>
              <select
                name="imageUrl"
                value={form.imageUrl || "keyboard"}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 cursor-pointer"
              >
                <option value="keyboard">Keyboard</option>
                <option value="headset">Headset</option>
                <option value="mouse">Mouse</option>
                <option value="monitor">Monitor</option>
                <option value="lamp">Smart Lamp</option>
                <option value="backpack">Backpack</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                required
                value={form.price}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                placeholder="99.99"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Stock Inventory</label>
              <input
                type="number"
                min="0"
                name="stock"
                required
                value={form.stock}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                placeholder="20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Long Description</label>
              <textarea
                name="description"
                rows={4}
                required
                value={form.description}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                placeholder="Describe product materials, specifications, and layout..."
              />
            </div>

            <div className="sm:col-span-2 flex gap-4 mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-brand-600 px-5 py-3 text-xs font-bold text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors uppercase tracking-wider cursor-pointer"
              >
                {submitting ? "Saving..." : "Save Product"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-zinc-200 px-5 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        {loading ? (
          <p className="text-sm text-zinc-500 text-center py-10">Loading products database...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-10">No products found. Click Add New Product above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/10">
                    <td className="py-4 px-4">
                      <div className="h-10 w-10 overflow-hidden rounded bg-zinc-100 border border-zinc-200 dark:border-zinc-800">
                        <ProductImage type={product.imageUrl} className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-zinc-900 dark:text-zinc-100 font-bold">{product.name}</p>
                      <p className="text-zinc-400 text-[10px] truncate max-w-xs mt-0.5">{product.description}</p>
                    </td>
                    <td className="py-4 px-4 text-zinc-900 dark:text-zinc-50 font-black">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      {product.stock === 0 ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                          Sold Out
                        </span>
                      ) : product.stock <= 5 ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                          Low: {product.stock}
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {product.stock}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right flex justify-end gap-3">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
