// ============================================
// Form Validation Utilities
// ============================================

import { PatientFormData, PatientFormField, REQUIRED_FIELDS } from "@/types/form";

export type ValidationErrors = Partial<Record<PatientFormField, string>>;

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone number validation - accepts international formats
const PHONE_REGEX = /^[\+]?[0-9\s\-\(\)]{7,20}$/;

/**
 * Validate a single field
 */
export function validateField(
  field: PatientFormField,
  value: string
): string | null {
  // Check required fields
  if (REQUIRED_FIELDS.includes(field) && !value.trim()) {
    return "This field is required";
  }

  // Field-specific validation
  switch (field) {
    case "email":
      if (value && !EMAIL_REGEX.test(value)) {
        return "Please enter a valid email address";
      }
      break;
    case "phoneNumber":
      if (value && !PHONE_REGEX.test(value)) {
        return "Please enter a valid phone number";
      }
      break;
    case "dateOfBirth":
      if (value) {
        const dob = new Date(value);
        const today = new Date();
        if (dob > today) {
          return "Date of birth cannot be in the future";
        }
        if (dob.getFullYear() < 1900) {
          return "Please enter a valid date of birth";
        }
      }
      break;
  }

  return null;
}

/**
 * Validate the entire form
 */
export function validateForm(data: PatientFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  (Object.keys(data) as PatientFormField[]).forEach((field) => {
    const error = validateField(field, data[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}

/**
 * Check if form has any errors
 */
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
