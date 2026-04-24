// ============================================
// Staff Page — Real-time monitoring dashboard
// ============================================

import StaffDashboard from "@/components/StaffDashboard";
import Header from "@/components/Header";

export const metadata = {
  title: "Staff View | Agnos Health",
  description: "Monitor patient form submissions in real-time.",
};

export default function StaffPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-slate-50/50 to-white">
        {/* Page Header */}
        <div className="border-b border-blue-100/50 bg-white/60 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Staff Dashboard</h1>
                <p className="text-sm text-slate-400">Real-time patient form monitoring</p>
              </div>
            </div>
          </div>
        </div>
        <StaffDashboard />
      </main>
    </>
  );
}
