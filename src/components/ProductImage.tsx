"use client";

import React from "react";

interface ProductImageProps {
  type: string | null;
  className?: string;
}

export default function ProductImage({ type, className = "h-48 w-full" }: ProductImageProps) {
  const normalizedType = type?.toLowerCase() || "";

  // Dynamic vector illustrations instead of plain placeholders
  if (normalizedType.includes("keyboard")) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-tr from-slate-900 to-indigo-950 p-6 ${className}`}>
        <svg className="w-4/5 h-3/4 drop-shadow-xl" viewBox="0 0 200 120" fill="none">
          <defs>
            <linearGradient id="kbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
            <linearGradient id="keyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          {/* Keyboard Body */}
          <rect x="10" y="20" width="180" height="80" rx="8" fill="url(#kbGrad)" stroke="#4338ca" strokeWidth="2" />
          {/* Key Rows */}
          {/* Row 1 */}
          <rect x="20" y="32" width="12" height="10" rx="2" fill="#3730a3" />
          <rect x="36" y="32" width="12" height="10" rx="2" fill="#312e81" />
          <rect x="52" y="32" width="12" height="10" rx="2" fill="#312e81" />
          <rect x="68" y="32" width="12" height="10" rx="2" fill="#312e81" />
          <rect x="84" y="32" width="12" height="10" rx="2" fill="#312e81" />
          <rect x="100" y="32" width="12" height="10" rx="2" fill="#312e81" />
          <rect x="116" y="32" width="12" height="10" rx="2" fill="#312e81" />
          <rect x="132" y="32" width="12" height="10" rx="2" fill="#312e81" />
          <rect x="148" y="32" width="12" height="10" rx="2" fill="#312e81" />
          <rect x="164" y="32" width="16" height="10" rx="2" fill="url(#keyGrad)" />

          {/* Row 2 */}
          <rect x="20" y="46" width="16" height="10" rx="2" fill="#312e81" />
          <rect x="40" y="46" width="12" height="10" rx="2" fill="#3730a3" />
          <rect x="56" y="46" width="12" height="10" rx="2" fill="#3730a3" />
          <rect x="72" y="46" width="12" height="10" rx="2" fill="url(#keyGrad)" />
          <rect x="88" y="46" width="12" height="10" rx="2" fill="#3730a3" />
          <rect x="104" y="46" width="12" height="10" rx="2" fill="#3730a3" />
          <rect x="120" y="46" width="12" height="10" rx="2" fill="#3730a3" />
          <rect x="136" y="46" width="12" height="10" rx="2" fill="#3730a3" />
          <rect x="152" y="46" width="12" height="10" rx="2" fill="#312e81" />
          <rect x="168" y="46" width="12" height="10" rx="2" fill="#312e81" />

          {/* Row 3 */}
          <rect x="20" y="60" width="12" height="10" rx="2" fill="#312e81" />
          <rect x="36" y="60" width="12" height="10" rx="2" fill="#3730a3" />
          <rect x="52" y="60" width="12" height="10" rx="2" fill="#3730a3" />
          <rect x="68" y="60" width="12" height="10" rx="2" fill="#3730a3" />
          <rect x="84" y="60" width="12" height="10" rx="2" fill="#3730a3" />
          <rect x="100" y="60" width="12" height="10" rx="2" fill="#3730a3" />
          <rect x="116" y="60" width="12" height="10" rx="2" fill="url(#keyGrad)" />
          <rect x="132" y="60" width="12" height="10" rx="2" fill="#3730a3" />
          <rect x="148" y="60" width="32" height="10" rx="2" fill="#312e81" />

          {/* Row 4 (Spacebar row) */}
          <rect x="20" y="74" width="22" height="10" rx="2" fill="#312e81" />
          <rect x="46" y="74" width="12" height="10" rx="2" fill="#312e81" />
          <rect x="62" y="74" width="70" height="10" rx="2" fill="url(#keyGrad)" />
          <rect x="136" y="74" width="12" height="10" rx="2" fill="#312e81" />
          <rect x="152" y="74" width="12" height="10" rx="2" fill="#312e81" />
          <rect x="168" y="74" width="12" height="10" rx="2" fill="#312e81" />
        </svg>
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-indigo-300 opacity-60">PRO BOARD</div>
      </div>
    );
  }

  if (normalizedType.includes("headset")) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-tr from-purple-950 to-indigo-950 p-6 ${className}`}>
        <svg className="w-3/5 h-3/4 drop-shadow-xl" viewBox="0 0 160 160" fill="none">
          <defs>
            <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          {/* Headband */}
          <path d="M30 90 C 30 20, 130 20, 130 90" stroke="#4b5563" strokeWidth="8" strokeLinecap="round" />
          <path d="M35 85 C 35 25, 125 25, 125 85" stroke="url(#headGrad)" strokeWidth="4" strokeLinecap="round" />
          
          {/* Earcups */}
          <rect x="15" y="75" width="22" height="42" rx="11" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
          <rect x="21" y="80" width="10" height="32" rx="5" fill="#a855f7" opacity="0.6" />
          
          <rect x="123" y="75" width="22" height="42" rx="11" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
          <rect x="129" y="80" width="10" height="32" rx="5" fill="#a855f7" opacity="0.6" />

          {/* Connectors */}
          <rect x="23" y="65" width="6" height="15" rx="2" fill="#9ca3af" />
          <rect x="131" y="65" width="6" height="15" rx="2" fill="#9ca3af" />
        </svg>
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-purple-300 opacity-60">HI-FI AUDIO</div>
      </div>
    );
  }

  if (normalizedType.includes("mouse")) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-tr from-slate-900 to-slate-800 p-6 ${className}`}>
        <svg className="w-2/5 h-3/4 drop-shadow-xl" viewBox="0 0 100 160" fill="none">
          <defs>
            <linearGradient id="mouseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* Mouse Shell */}
          <path d="M50 10 C 20 10, 15 110, 50 150 C 85 110, 80 10, 50 10 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
          {/* Ergonomic Accent */}
          <path d="M50 10 C 35 10, 30 75, 50 100" stroke="#3f3f46" strokeWidth="2" />
          <path d="M50 10 C 65 10, 70 75, 50 100" stroke="#3f3f46" strokeWidth="2" />
          {/* Scroll Wheel */}
          <rect x="47" y="25" width="6" height="20" rx="3" fill="url(#mouseGrad)" className="animate-pulse" />
          {/* Side Buttons */}
          <path d="M16 65 C 16 55, 18 50, 18 50" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-cyan-300 opacity-60">PRECISION</div>
      </div>
    );
  }

  if (normalizedType.includes("monitor")) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-tr from-zinc-950 to-zinc-900 p-6 ${className}`}>
        <svg className="w-11/12 h-3/4 drop-shadow-xl" viewBox="0 0 220 140" fill="none">
          <defs>
            <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* Stand */}
          <path d="M100 110 L90 135 L130 135 L120 110 Z" fill="#27272a" />
          <rect x="105" y="95" width="10" height="20" fill="#3f3f46" />
          {/* Screen Outer */}
          <rect x="10" y="10" width="200" height="100" rx="4" fill="#09090b" stroke="#3f3f46" strokeWidth="2" />
          {/* Screen Inner */}
          <rect x="14" y="14" width="192" height="92" rx="2" fill="url(#screenGrad)" />
          {/* Wallpaper Graphic */}
          <path d="M30 90 L80 50 L130 80 L190 30" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        </svg>
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-zinc-300 opacity-60">CURVED IPS</div>
      </div>
    );
  }

  if (normalizedType.includes("lamp")) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-tr from-amber-950 to-stone-900 p-6 ${className}`}>
        <svg className="w-2/5 h-3/4 drop-shadow-xl" viewBox="0 0 100 160" fill="none">
          <defs>
            <radialGradient id="lampGlow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Light Glow */}
          <circle cx="50" cy="40" r="30" fill="url(#lampGlow)" />
          
          {/* Base */}
          <rect x="30" y="130" width="40" height="8" rx="4" fill="#292524" />
          {/* Rod */}
          <rect x="48" y="65" width="4" height="65" fill="#78716c" />
          
          {/* Lamp Head */}
          <path d="M50 30 L25 65 L75 65 Z" fill="#44403c" stroke="#57534e" strokeWidth="1" />
          {/* Glowing bulb */}
          <circle cx="50" cy="58" r="6" fill="#fef08a" />
        </svg>
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-amber-300 opacity-60">WARM LIGHT</div>
      </div>
    );
  }

  if (normalizedType.includes("backpack")) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-tr from-neutral-900 to-indigo-950 p-6 ${className}`}>
        <svg className="w-3/5 h-3/4 drop-shadow-xl" viewBox="0 0 120 160" fill="none">
          {/* Shoulder Straps (bg) */}
          <path d="M25 40 C 25 15, 40 10, 50 15" stroke="#171717" strokeWidth="6" strokeLinecap="round" />
          <path d="M95 40 C 95 15, 80 10, 70 15" stroke="#171717" strokeWidth="6" strokeLinecap="round" />
          
          {/* Backpack Main */}
          <rect x="25" y="30" width="70" height="110" rx="20" fill="#262626" stroke="#404040" strokeWidth="2" />
          {/* Front Pocket */}
          <rect x="35" y="85" width="50" height="45" rx="8" fill="#171717" stroke="#404040" strokeWidth="1" />
          {/* Zippers */}
          <path d="M35 85 L85 85" stroke="#737373" strokeWidth="2" strokeDasharray="3 2" />
          <path d="M25 55 C 25 55, 95 55, 95 55" stroke="#525252" strokeWidth="2" strokeDasharray="3 2" />
          
          {/* Carry handle */}
          <path d="M50 30 C 50 20, 70 20, 70 30" stroke="#404040" strokeWidth="4" />
        </svg>
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-indigo-300 opacity-60">VOYAGE</div>
      </div>
    );
  }

  // Fallback geometric patterns
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-brand-600 to-accent-600 ${className}`}>
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <span className="mt-2 block text-xs font-semibold text-white/90 uppercase tracking-widest">{type || "Product"}</span>
      </div>
    </div>
  );
}
