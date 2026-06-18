"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register user");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-1 items-center justify-center py-20 px-4 bg-gradient-to-tr from-brand-900/10 via-transparent to-accent-500/10">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white/80 p-8 shadow-xl glass-card dark:border-zinc-800 dark:bg-zinc-900/80">
        
        <div className="text-center">
          <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-3xl font-black tracking-wider text-transparent dark:from-brand-500">
            VORTEX
          </span>
          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
            Create Account
          </h2>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Join VORTEX to place orders and track delivery.
          </p>
        </div>

        {success ? (
          <div className="mt-8 rounded-xl bg-emerald-50 p-6 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 text-center animate-pulse">
            <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase">Registration Successful!</h3>
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-500 font-semibold">Redirecting to login page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white/50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white/50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white/50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white/50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50"
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3.5 border border-red-200 dark:bg-red-950/20 dark:border-red-900 text-xs font-semibold text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-brand-600 py-3.5 text-xs font-bold text-white hover:bg-brand-700 dark:bg-brand-50 dark:hover:bg-brand-600 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider cursor-pointer"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-brand-600 hover:underline dark:text-brand-400">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
