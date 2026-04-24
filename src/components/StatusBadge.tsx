// ============================================
// StatusBadge Component — Shows patient activity status
// ============================================

"use client";

import { PatientStatus } from "@/types/form";

interface StatusBadgeProps {
  status: PatientStatus;
}

const STATUS_CONFIG: Record<
  PatientStatus,
  { label: string; dotClass: string; bgClass: string; textClass: string; icon: string }
> = {
  idle: {
    label: "Waiting",
    dotClass: "bg-slate-400",
    bgClass: "bg-slate-50 border-slate-200",
    textClass: "text-slate-600",
    icon: "⏳",
  },
  active: {
    label: "Actively Filling In",
    dotClass: "bg-emerald-500 animate-pulse",
    bgClass: "bg-emerald-50 border-emerald-200",
    textClass: "text-emerald-700",
    icon: "✏️",
  },
  inactive: {
    label: "Inactive",
    dotClass: "bg-amber-500",
    bgClass: "bg-amber-50 border-amber-200",
    textClass: "text-amber-700",
    icon: "💤",
  },
  submitted: {
    label: "Submitted",
    dotClass: "bg-blue-500",
    bgClass: "bg-blue-50 border-blue-200",
    textClass: "text-blue-700",
    icon: "✅",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div
      id="status-badge"
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${config.bgClass} ${config.textClass}`}
    >
      <span className="text-base">{config.icon}</span>
      <span className={`h-2.5 w-2.5 rounded-full ${config.dotClass}`} />
      <span>{config.label}</span>
    </div>
  );
}
