// ============================================
// StaffDashboard Component — Real-time monitoring view
// Displays live form data from patient via Pusher
// ============================================

"use client";

import { usePusher } from "@/hooks/usePusher";
import { PatientFormField, FIELD_LABELS } from "@/types/form";
import StatusBadge from "./StatusBadge";
import FieldCard from "./FieldCard";

// Grouped fields for better visual organization
const FIELD_GROUPS: { title: string; icon: string; fields: PatientFormField[] }[] = [
  {
    title: "Personal Information",
    icon: "👤",
    fields: ["firstName", "middleName", "lastName", "dateOfBirth", "gender"],
  },
  {
    title: "Contact Information",
    icon: "📞",
    fields: ["phoneNumber", "email", "address"],
  },
  {
    title: "Additional Information",
    icon: "🌐",
    fields: ["preferredLanguage", "nationality", "religion"],
  },
  {
    title: "Emergency Contact",
    icon: "🚨",
    fields: ["emergencyContactName", "emergencyContactRelationship"],
  },
];

export default function StaffDashboard() {
  const { formData, activeField, status, isConnected, lastUpdate } = usePusher();

  // Count filled fields
  const filledCount = Object.values(formData).filter((v) => v.trim() !== "").length;
  const totalFields = Object.keys(formData).length;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6" id="staff-dashboard">
      {/* Dashboard Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Patient Monitor</h1>
          <p className="mt-1 text-sm text-slate-400">Real-time patient form data</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={status} />
          {/* Connection indicator */}
          <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
            isConnected
              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
              : "border-red-200 bg-red-50 text-red-600"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`} />
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Status</p>
          <p className="mt-1 text-lg font-bold text-slate-800 capitalize">{status}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Fields Filled</p>
          <p className="mt-1 text-lg font-bold text-slate-800">{filledCount} / {totalFields}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Active Field</p>
          <p className="mt-1 text-lg font-bold text-blue-600 truncate">
            {activeField ? FIELD_LABELS[activeField] : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Last Update</p>
          <p className="mt-1 text-lg font-bold text-slate-800">
            {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : "—"}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">Completion Progress</span>
          <span className="text-xs font-bold text-blue-600">{Math.round((filledCount / totalFields) * 100)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${(filledCount / totalFields) * 100}%` }}
          />
        </div>
      </div>

      {/* Field Groups */}
      <div className="space-y-8">
        {FIELD_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 text-sm font-bold text-slate-500 flex items-center gap-2">
              <span>{group.icon}</span>
              {group.title}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.fields.map((field) => (
                <FieldCard
                  key={field}
                  field={field}
                  value={formData[field]}
                  isActive={activeField === field}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
