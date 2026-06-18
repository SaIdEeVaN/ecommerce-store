"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
      <div>
        <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
          Email Address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white/50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Password
          </label>
        </div>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white/50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-brand-600 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50"
          placeholder="••••••••"
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
        className="mt-2 flex w-full items-center justify-center rounded-lg bg-brand-600 py-3.5 text-xs font-bold text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider cursor-pointer"
      >
        {loading ? "Logging In..." : "Log In"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center py-20 px-4 bg-gradient-to-tr from-brand-900/10 via-transparent to-accent-500/10">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white/80 p-8 shadow-xl glass-card dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="text-center">
          <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-3xl font-black tracking-wider text-transparent dark:from-brand-500">
            VORTEX
          </span>
          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
            Welcome Back
          </h2>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Log in with <code className="text-brand-600 dark:text-brand-400 font-bold">user@store.com</code> / <code className="text-brand-600 dark:text-brand-400 font-bold">user123</code> or create a new account.
          </p>
        </div>

        <Suspense fallback={<div className="mt-8 text-center text-xs text-zinc-500">Loading form...</div>}>
          <LoginForm />
        </Suspense>

        <p className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-brand-600 hover:underline dark:text-brand-400">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
