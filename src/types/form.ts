// ============================================
// Shared TypeScript Types for Patient Form
// ============================================

export interface PatientFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  preferredLanguage: string;
  nationality: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  religion: string;
}

export type PatientFormField = keyof PatientFormData;

export const INITIAL_FORM_DATA: PatientFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phoneNumber: "",
  email: "",
  address: "",
  preferredLanguage: "",
  nationality: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  religion: "",
};

// Field display labels for UI
export const FIELD_LABELS: Record<PatientFormField, string> = {
  firstName: "First Name",
  middleName: "Middle Name",
  lastName: "Last Name",
  dateOfBirth: "Date of Birth",
  gender: "Gender",
  phoneNumber: "Phone Number",
  email: "Email",
  address: "Address",
  preferredLanguage: "Preferred Language",
  nationality: "Nationality",
  emergencyContactName: "Emergency Contact Name",
  emergencyContactRelationship: "Emergency Contact Relationship",
  religion: "Religion",
};

// Required fields for validation
export const REQUIRED_FIELDS: PatientFormField[] = [
  "firstName",
  "lastName",
  "dateOfBirth",
  "gender",
  "phoneNumber",
  "email",
  "address",
  "preferredLanguage",
  "nationality",
];

// Patient status types
export type PatientStatus = "idle" | "active" | "inactive" | "submitted";

// Pusher event types
export interface FormUpdateEvent {
  field: PatientFormField;
  value: string;
  activeField: PatientFormField | null;
  timestamp: number;
}

export interface StatusChangeEvent {
  status: PatientStatus;
  timestamp: number;
}

export interface FormSubmitEvent {
  data: PatientFormData;
  timestamp: number;
}

// Gender options
export const GENDER_OPTIONS = [
  { value: "", label: "Select Gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-Binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
  { value: "other", label: "Other" },
];

// Language options
export const LANGUAGE_OPTIONS = [
  { value: "", label: "Select Language" },
  { value: "english", label: "English" },
  { value: "thai", label: "Thai (ไทย)" },
  { value: "chinese", label: "Chinese (中文)" },
  { value: "japanese", label: "Japanese (日本語)" },
  { value: "korean", label: "Korean (한국어)" },
  { value: "spanish", label: "Spanish (Español)" },
  { value: "french", label: "French (Français)" },
  { value: "german", label: "German (Deutsch)" },
  { value: "arabic", label: "Arabic (العربية)" },
  { value: "hindi", label: "Hindi (हिन्दी)" },
  { value: "other", label: "Other" },
];
