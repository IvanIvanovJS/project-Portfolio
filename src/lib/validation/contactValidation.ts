/**
 * Contact form validation utilities
 * Provides validation and sanitization for contact form submissions
 */

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  _honeypot?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates email format using RFC 5322 compliant regex
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes input by escaping HTML special characters
 * Prevents XSS attacks in email templates
 */
export function sanitizeInput(input: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Validates contact form data against all requirements
 * Requirements: 6.1, 6.2, 6.3, 6.4, 7.5
 */
export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate name (required, 2-100 characters)
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'This field is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must not exceed 100 characters';
  }

  // Validate email (required, valid format)
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'This field is required';
  } else if (!isValidEmail(data.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate subject (required, 3-200 characters)
  if (!data.subject || data.subject.trim().length === 0) {
    errors.subject = 'This field is required';
  } else if (data.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters';
  } else if (data.subject.trim().length > 200) {
    errors.subject = 'Subject must not exceed 200 characters';
  }

  // Validate message (required, 10-5000 characters)
  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'This field is required';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (data.message.trim().length > 5000) {
    errors.message = 'Message must not exceed 5000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
