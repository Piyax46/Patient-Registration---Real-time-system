// ============================================
// Header Component — Shared navigation bar
// ============================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-200 transition-shadow group-hover:shadow-lg group-hover:shadow-blue-300">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            AGNOS
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link
            href="/patient"
            id="nav-patient"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              pathname === "/patient"
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-slate-500 hover:bg-blue-50/50 hover:text-blue-600"
            }`}
          >
            <span className="hidden sm:inline">Patient</span> Form
          </Link>
          <Link
            href="/staff"
            id="nav-staff"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              pathname === "/staff"
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-slate-500 hover:bg-blue-50/50 hover:text-blue-600"
            }`}
          >
            <span className="hidden sm:inline">Staff</span> View
          </Link>
        </nav>
      </div>
    </header>
  );
}
