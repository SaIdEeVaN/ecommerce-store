"use client";

import React, { useState, useEffect } from "react";
import ProductImage from "@/components/ProductImage";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string | null;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
  orderItems: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: "COMPLETED" | "CANCELLED") => {
    if (!confirm(`Are you sure you want to mark this order as ${status === "COMPLETED" ? "COMPLETED" : "CANCELLED"}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order status");

      // Refetch
      fetchOrders();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
          Manage Orders
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Review buyer orders and update shipment/fulfillment statuses.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-250 dark:bg-red-950/20 dark:border-red-900 text-sm font-semibold text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        {loading ? (
          <p className="text-sm text-zinc-500 text-center py-10">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-10">No orders placed on the store yet.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-zinc-250 dark:border-zinc-800 bg-zinc-50/25 dark:bg-zinc-950/10 overflow-hidden shadow-sm"
                >
                  {/* Card Header metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-150 px-6 py-4 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40">
                    <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                      <div>
                        <p className="uppercase text-[9px] text-zinc-400 mb-0.5">Customer</p>
                        <p className="text-zinc-900 dark:text-zinc-100 font-bold">{order.user.name || "Guest"}</p>
                        <p className="text-zinc-400 text-[10px]">{order.user.email}</p>
                      </div>
                      <div>
                        <p className="uppercase text-[9px] text-zinc-400 mb-0.5">Order ID</p>
                        <p className="font-mono text-zinc-800 dark:text-zinc-200">{order.id}</p>
                      </div>
                      <div>
                        <p className="uppercase text-[9px] text-zinc-400 mb-0.5 font-bold">Placed Date</p>
                        <p className="text-zinc-900 dark:text-zinc-100 font-bold">{dateStr}</p>
                      </div>
                      <div>
                        <p className="uppercase text-[9px] text-zinc-400 mb-0.5">Total Sales</p>
                        <p className="text-zinc-900 dark:text-zinc-100 font-bold">${order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Status Badge & Action Buttons */}
                    <div className="flex items-center gap-4">
                      {/* Status indicator */}
                      <div>
                        {order.status === "COMPLETED" ? (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            Completed
                          </span>
                        ) : order.status === "CANCELLED" ? (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                            Cancelled
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 animate-pulse">
                            Pending
                          </span>
                        )}
                      </div>

                      {/* Controls */}
                      {order.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus(order.id, "COMPLETED")}
                            className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors uppercase cursor-pointer"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                            className="rounded bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors uppercase cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-zinc-200/50 bg-white dark:bg-zinc-900 dark:divide-zinc-850 px-6">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-4">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-zinc-50 border border-zinc-150 dark:bg-zinc-950 dark:border-zinc-800">
                          <ProductImage type={item.product.imageUrl} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{item.product.name}</p>
                          <p className="text-zinc-500 mt-1">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-xs font-black text-zinc-900 dark:text-zinc-50">
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
    </div>
  );
}
