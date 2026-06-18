import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  // 1. Fetch count stats
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const customersCount = await prisma.user.count({
    where: { role: "USER" }
  });

  // 2. Fetch completed/pending sales totals
  const nonCancelledOrders = await prisma.order.findMany({
    where: {
      status: {
        not: "CANCELLED"
      }
    },
    select: {
      totalAmount: true
    }
  });
  
  const totalSales = nonCancelledOrders.reduce((acc, o) => acc + o.totalAmount, 0);

  // 3. Fetch 5 recent orders
  const recentOrders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 5
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
          Admin Overview
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Monitor your store metrics and track sales activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Sales Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mt-1">${totalSales.toFixed(2)}</p>
          </div>
          <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Orders Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mt-1">{ordersCount}</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>

        {/* Products Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Products</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mt-1">{productsCount}</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        {/* Customers Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Customers</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mt-1">{customersCount}</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>

      </div>

      {/* Recent Activity Section */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-6">
          Recent Orders
        </h2>
        
        {recentOrders.length === 0 ? (
          <p className="text-sm text-zinc-500 py-4 text-center">No orders placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 font-bold">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/10">
                    <td className="py-4 px-4 font-mono text-zinc-700 dark:text-zinc-300">{order.id}</td>
                    <td className="py-4 px-4">
                      <p className="text-zinc-900 dark:text-zinc-100 font-bold">{order.user.name || "Guest"}</p>
                      <p className="text-zinc-400 text-[10px] mt-0.5">{order.user.email}</p>
                    </td>
                    <td className="py-4 px-4 text-zinc-900 dark:text-zinc-50 font-black">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      {order.status === "COMPLETED" ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          Delivered
                        </span>
                      ) : order.status === "CANCELLED" ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                          Cancelled
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                          In Progress
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link href="/admin/orders" className="text-brand-600 dark:text-brand-400 hover:underline">
                        Manage
                      </Link>
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
