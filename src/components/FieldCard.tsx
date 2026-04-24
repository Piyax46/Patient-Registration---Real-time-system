// ============================================
// FieldCard Component — Displays a single form field value
// Used in Staff View to show live data
// ============================================

"use client";

import { PatientFormField, FIELD_LABELS, REQUIRED_FIELDS } from "@/types/form";

interface FieldCardProps {
  field: PatientFormField;
  value: string;
  isActive: boolean;
}

export default function FieldCard({ field, value, isActive }: FieldCardProps) {
  const label = FIELD_LABELS[field];
  const isRequired = REQUIRED_FIELDS.includes(field);

  return (
    <div
      id={`field-card-${field}`}
      className={`group relative rounded-xl border p-4 transition-all duration-300 ${
        isActive
          ? "border-blue-300 bg-blue-50/50 shadow-md shadow-blue-100 ring-2 ring-blue-200"
          : value
          ? "border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-200"
          : "border-slate-100 bg-slate-50/50"
      }`}
    >
      {/* Active typing indicator */}
      {isActive && (
        <div className="absolute -top-1 -right-1">
          <span className="relative flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-blue-500" />
          </span>
        </div>
      )}

      {/* Field label */}
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {isRequired && (
          <span className="text-[10px] font-medium text-blue-400">Required</span>
        )}
      </div>

      {/* Field value */}
      <div className={`min-h-[1.75rem] text-sm leading-relaxed ${
        value ? "text-slate-800 font-medium" : "text-slate-300 italic"
      }`}>
        {value || "—"}
        {isActive && (
          <span className="inline-block w-0.5 h-4 bg-blue-500 animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </div>
  );
}
