// ============================================
// Landing Page — Navigate to Patient Form or Staff View
// ============================================

import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-2xl">
          {/* Logo Icon */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-200">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">
            Agnos{" "}
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              Health
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            Smart patient registration with real-time monitoring.
            <br className="hidden sm:block" />
            Secure, seamless, and instant.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid w-full max-w-xl grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Patient Card */}
          <Link
            href="/patient"
            id="go-patient"
            className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1 hover:border-blue-200"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-800">Patient Form</h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Fill in your registration details with real-time validation.
              </p>
              <div className="mt-4 flex items-center text-sm font-semibold text-blue-500 group-hover:text-blue-600">
                Get Started
                <svg className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Staff Card */}
          <Link
            href="/staff"
            id="go-staff"
            className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1 hover:border-blue-200"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-800">Staff View</h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Monitor patient data in real-time as they fill in the form.
              </p>
              <div className="mt-4 flex items-center text-sm font-semibold text-blue-500 group-hover:text-blue-600">
                Open Dashboard
                <svg className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer text */}
        <p className="mt-12 text-xs text-slate-300">
          Powered by Next.js • Pusher • TailwindCSS
        </p>
      </main>
    </>
  );
}
