// ============================================
// PatientForm Component — Full patient intake form
// Sends real-time updates via Pusher on every keystroke
// ============================================

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  PatientFormData,
  PatientFormField,
  INITIAL_FORM_DATA,
  GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/types/form";
import { validateForm, validateField, hasErrors, ValidationErrors } from "@/lib/validation";

const DEBOUNCE_MS = 80;
const INACTIVITY_MS = 5000;

export default function PatientForm() {
  const [formData, setFormData] = useState<PatientFormData>({ ...INITIAL_FORM_DATA });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<PatientFormField>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeField, setActiveField] = useState<PatientFormField | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityRef = useRef<NodeJS.Timeout | null>(null);
  const hasNotifiedActive = useRef(false);

  const sendEvent = useCallback(async (event: string, data: Record<string, unknown>) => {
    try {
      await fetch("/api/pusher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, data }),
      });
    } catch (err) {
      console.error("Failed to send event:", err);
    }
  }, []);

  const resetInactivity = useCallback(() => {
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => {
      sendEvent("status-change", { status: "inactive", timestamp: Date.now() });
      hasNotifiedActive.current = false;
    }, INACTIVITY_MS);
  }, [sendEvent]);

  const handleChange = useCallback((field: PatientFormField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched.has(field)) {
      const error = validateField(field, value);
      setErrors((prev) => {
        const n = { ...prev };
        if (error) n[field] = error; else delete n[field];
        return n;
      });
    }
    if (!hasNotifiedActive.current) {
      sendEvent("status-change", { status: "active", timestamp: Date.now() });
      hasNotifiedActive.current = true;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      sendEvent("form-update", { field, value, activeField: field, timestamp: Date.now() });
    }, DEBOUNCE_MS);
    resetInactivity();
  }, [touched, sendEvent, resetInactivity]);

  const handleFocus = useCallback((field: PatientFormField) => {
    setActiveField(field);
    if (!hasNotifiedActive.current) {
      sendEvent("status-change", { status: "active", timestamp: Date.now() });
      hasNotifiedActive.current = true;
    }
    resetInactivity();
  }, [sendEvent, resetInactivity]);

  const handleBlur = useCallback((field: PatientFormField) => {
    setTouched((prev) => new Set(prev).add(field));
    setActiveField(null);
    const error = validateField(field, formData[field]);
    setErrors((prev) => {
      const n = { ...prev };
      if (error) n[field] = error; else delete n[field];
      return n;
    });
    sendEvent("form-update", { field, value: formData[field], activeField: null, timestamp: Date.now() });
  }, [formData, sendEvent]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const allFields = Object.keys(formData) as PatientFormField[];
    setTouched(new Set(allFields));
    const formErrors = validateForm(formData);
    setErrors(formErrors);
    if (hasErrors(formErrors)) {
      const first = allFields.find((f) => formErrors[f]);
      if (first) document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setIsSubmitting(true);
    await sendEvent("form-submitted", { data: formData, timestamp: Date.now() });
    await sendEvent("status-change", { status: "submitted", timestamp: Date.now() });
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    setIsSubmitting(false);
    setIsSubmitted(true);
  }, [formData, sendEvent]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
    };
  }, []);

  const ic = (field: PatientFormField) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 transition-all duration-200 outline-none ${
      errors[field] && touched.has(field)
        ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : activeField === field
        ? "border-blue-400 bg-white ring-2 ring-blue-100 shadow-sm"
        : "border-slate-200 bg-white hover:border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
    }`;

  const lc = "block text-sm font-semibold text-slate-600 mb-1.5";
  const errIcon = <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
  const errMsg = (field: PatientFormField) =>
    errors[field] && touched.has(field) ? (
      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">{errIcon}{errors[field]}</p>
    ) : null;

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
          <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-800">Form Submitted Successfully!</h2>
        <p className="mb-8 max-w-md text-slate-500">Thank you for providing your information. Our staff has received your details.</p>
        <button
          onClick={() => { setFormData({ ...INITIAL_FORM_DATA }); setErrors({}); setTouched(new Set()); setIsSubmitted(false); hasNotifiedActive.current = false; }}
          className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0"
        >
          Fill Another Form
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8 sm:px-6" id="patient-form">
      {/* Section 1: Personal */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-600">1</span>
          Personal Information
        </h2>
        <p className="text-sm text-slate-400 ml-9">Fields marked with <span className="text-red-400">*</span> are required</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div id="field-firstName">
          <label htmlFor="firstName" className={lc}>First Name <span className="text-red-400">*</span></label>
          <input id="firstName" type="text" placeholder="John" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} onFocus={() => handleFocus("firstName")} onBlur={() => handleBlur("firstName")} className={ic("firstName")} />
          {errMsg("firstName")}
        </div>
        <div id="field-middleName">
          <label htmlFor="middleName" className={lc}>Middle Name</label>
          <input id="middleName" type="text" placeholder="Optional" value={formData.middleName} onChange={(e) => handleChange("middleName", e.target.value)} onFocus={() => handleFocus("middleName")} onBlur={() => handleBlur("middleName")} className={ic("middleName")} />
        </div>
        <div id="field-lastName">
          <label htmlFor="lastName" className={lc}>Last Name <span className="text-red-400">*</span></label>
          <input id="lastName" type="text" placeholder="Doe" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} onFocus={() => handleFocus("lastName")} onBlur={() => handleBlur("lastName")} className={ic("lastName")} />
          {errMsg("lastName")}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div id="field-dateOfBirth">
          <label htmlFor="dateOfBirth" className={lc}>Date of Birth <span className="text-red-400">*</span></label>
          <input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => handleChange("dateOfBirth", e.target.value)} onFocus={() => handleFocus("dateOfBirth")} onBlur={() => handleBlur("dateOfBirth")} className={ic("dateOfBirth")} />
          {errMsg("dateOfBirth")}
        </div>
        <div id="field-gender">
          <label htmlFor="gender" className={lc}>Gender <span className="text-red-400">*</span></label>
          <select id="gender" value={formData.gender} onChange={(e) => handleChange("gender", e.target.value)} onFocus={() => handleFocus("gender")} onBlur={() => handleBlur("gender")} className={ic("gender")}>
            {GENDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {errMsg("gender")}
        </div>
      </div>

      {/* Section 2: Contact */}
      <div className="space-y-1 pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-600">2</span>
          Contact Information
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div id="field-phoneNumber">
          <label htmlFor="phoneNumber" className={lc}>Phone Number <span className="text-red-400">*</span></label>
          <input id="phoneNumber" type="tel" placeholder="+66 12 345 6789" value={formData.phoneNumber} onChange={(e) => handleChange("phoneNumber", e.target.value)} onFocus={() => handleFocus("phoneNumber")} onBlur={() => handleBlur("phoneNumber")} className={ic("phoneNumber")} />
          {errMsg("phoneNumber")}
        </div>
        <div id="field-email">
          <label htmlFor="email" className={lc}>Email <span className="text-red-400">*</span></label>
          <input id="email" type="email" placeholder="john.doe@email.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} onFocus={() => handleFocus("email")} onBlur={() => handleBlur("email")} className={ic("email")} />
          {errMsg("email")}
        </div>
      </div>
      <div id="field-address">
        <label htmlFor="address" className={lc}>Address <span className="text-red-400">*</span></label>
        <textarea id="address" rows={3} placeholder="123 Main Street, Bangkok, Thailand 10100" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} onFocus={() => handleFocus("address")} onBlur={() => handleBlur("address")} className={`${ic("address")} resize-none`} />
        {errMsg("address")}
      </div>

      {/* Section 3: Additional */}
      <div className="space-y-1 pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-600">3</span>
          Additional Information
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div id="field-preferredLanguage">
          <label htmlFor="preferredLanguage" className={lc}>Preferred Language <span className="text-red-400">*</span></label>
          <select id="preferredLanguage" value={formData.preferredLanguage} onChange={(e) => handleChange("preferredLanguage", e.target.value)} onFocus={() => handleFocus("preferredLanguage")} onBlur={() => handleBlur("preferredLanguage")} className={ic("preferredLanguage")}>
            {LANGUAGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {errMsg("preferredLanguage")}
        </div>
        <div id="field-nationality">
          <label htmlFor="nationality" className={lc}>Nationality <span className="text-red-400">*</span></label>
          <input id="nationality" type="text" placeholder="Thai" value={formData.nationality} onChange={(e) => handleChange("nationality", e.target.value)} onFocus={() => handleFocus("nationality")} onBlur={() => handleBlur("nationality")} className={ic("nationality")} />
          {errMsg("nationality")}
        </div>
      </div>

      <div id="field-religion">
        <label htmlFor="religion" className={lc}>Religion <span className="text-slate-300 text-xs font-normal">(Optional)</span></label>
        <input id="religion" type="text" placeholder="Optional" value={formData.religion} onChange={(e) => handleChange("religion", e.target.value)} onFocus={() => handleFocus("religion")} onBlur={() => handleBlur("religion")} className={ic("religion")} />
      </div>

      {/* Section 4: Emergency Contact */}
      <div className="space-y-1 pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-600">4</span>
          Emergency Contact <span className="text-slate-300 text-xs font-normal">(Optional)</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div id="field-emergencyContactName">
          <label htmlFor="emergencyContactName" className={lc}>Contact Name</label>
          <input id="emergencyContactName" type="text" placeholder="Jane Doe" value={formData.emergencyContactName} onChange={(e) => handleChange("emergencyContactName", e.target.value)} onFocus={() => handleFocus("emergencyContactName")} onBlur={() => handleBlur("emergencyContactName")} className={ic("emergencyContactName")} />
        </div>
        <div id="field-emergencyContactRelationship">
          <label htmlFor="emergencyContactRelationship" className={lc}>Relationship</label>
          <input id="emergencyContactRelationship" type="text" placeholder="Spouse, Parent, etc." value={formData.emergencyContactRelationship} onChange={(e) => handleChange("emergencyContactRelationship", e.target.value)} onFocus={() => handleFocus("emergencyContactRelationship")} onBlur={() => handleBlur("emergencyContactRelationship")} className={ic("emergencyContactRelationship")} />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-6 border-t border-slate-100">
        <button type="submit" id="submit-btn" disabled={isSubmitting}
          className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-10 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
              Submitting...
            </span>
          ) : "Submit Form"}
        </button>
      </div>
    </form>
  );
}
