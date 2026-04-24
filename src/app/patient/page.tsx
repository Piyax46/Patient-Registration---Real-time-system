// ============================================
// Patient Page — Form for patients to fill in
// ============================================

import PatientForm from "@/components/PatientForm";
import Header from "@/components/Header";

export const metadata = {
  title: "Patient Form | Agnos Health",
  description: "Fill in your patient information securely. Real-time form with validation.",
};

export default function PatientPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-blue-50/30 to-white">
        {/* Page Header */}
        <div className="border-b border-blue-100/50 bg-white/60 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Patient Registration</h1>
                <p className="text-sm text-slate-400">Please fill in your information below</p>
              </div>
            </div>
          </div>
        </div>
        <PatientForm />
      </main>
    </>
  );
}
