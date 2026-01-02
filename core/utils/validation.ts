/**
 * Standard frontend validation utilities for institutional forms.
 */

export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? null : "Invalid email format";
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return "Phone number is required";
  // Basic digits/common symbols check
  const regex = /^[\d\s\-\+\(\)]{7,20}$/;
  return regex.test(phone) ? null : "Invalid phone number";
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateField = (type: string, value: any, label: string): string | null => {
  switch (type) {
    case 'email':
      return validateEmail(value);
    case 'tel':
      return validatePhone(value);
    default:
      return validateRequired(value, label);
  }
};
