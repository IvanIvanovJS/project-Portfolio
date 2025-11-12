'use client';

import React, { useState, FormEvent } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './EmailApp.module.css';

/**
 * EmailApp Component
 *
 * Displays an iOS-style email composition interface with form validation.
 *
 * Features:
 * - Email composition form with input fields
 * - Form validation with inline error messages
 * - Send button with loading state
 * - Success/error feedback with glassmorphism toast
 * - iOS Mail app styling with glassmorphism
 * - Integration with /api/contact endpoint
 * - Honeypot spam protection
 * - Shake animation for validation errors
 */

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  _honeypot?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type ToastType = 'success' | 'error' | null;

export const EmailApp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    _honeypot: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string }>({
    type: null,
    message: '',
  });

  /**
   * Validate email format
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate form fields (matching main contact form validation)
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation (2-100 characters)
    if (!formData.name.trim()) {
      newErrors.name = 'This field is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must not exceed 100 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'This field is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Subject validation (3-200 characters)
    if (!formData.subject.trim()) {
      newErrors.subject = 'This field is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    } else if (formData.subject.trim().length > 200) {
      newErrors.subject = 'Subject must not exceed 200 characters';
    }

    // Message validation (10-5000 characters)
    if (!formData.message.trim()) {
      newErrors.message = 'This field is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 5000) {
      newErrors.message = 'Message must not exceed 5000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle input change
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Show toast notification
   */
  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast({ type: null, message: '' });
    }, 4000);
  };

  /**
   * Handle form submission via API endpoint
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Add shake animation to form
      const formElement = e.currentTarget;
      formElement.classList.add(styles.shake);
      setTimeout(() => formElement.classList.remove(styles.shake), 500);
      showToast('error', 'Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error types
        if (response.status === 429) {
          // Rate limit error
          const retryAfter = data.retryAfter || 60;
          const minutes = Math.ceil(retryAfter / 60);
          showToast(
            'error',
            `Too many attempts. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`
          );
        } else if (response.status === 400 && data.details) {
          // Validation errors from server
          setErrors(data.details);
          showToast('error', 'Please fix the errors in the form');
        } else {
          // Generic error
          showToast(
            'error',
            data.message || 'Failed to send message. Please try again.'
          );
        }
        setIsSubmitting(false);
        return;
      }

      // Success - show checkmark animation
      showToast('success', 'Message sent successfully!');

      // Reset form after short delay
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          _honeypot: '',
        });
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending email:', error);
      showToast(
        'error',
        'Network error. Please check your connection and try again.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.emailApp}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Mail size={24} strokeWidth={2} />
        </div>
        <h1 className={styles.headerTitle}>New Message</h1>
      </div>

      {/* Form */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Name Field */}
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <span id="name-error" className={styles.errorMessage} role="alert">
              {errors.name}
            </span>
          )}
        </div>

        {/* Email Field */}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            placeholder="your.email@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span id="email-error" className={styles.errorMessage} role="alert">
              {errors.email}
            </span>
          )}
        </div>

        {/* Subject Field */}
        <div className={styles.formGroup}>
          <label htmlFor="subject" className={styles.label}>
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
            placeholder="Message subject"
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
          />
          {errors.subject && (
            <span
              id="subject-error"
              className={styles.errorMessage}
              role="alert"
            >
              {errors.subject}
            </span>
          )}
        </div>

        {/* Message Field */}
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
            placeholder="Type your message here..."
            rows={6}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <span
              id="message-error"
              className={styles.errorMessage}
              role="alert"
            >
              {errors.message}
            </span>
          )}
        </div>

        {/* Honeypot Field - Hidden from users, visible to bots */}
        <input
          type="text"
          name="_honeypot"
          value={formData._honeypot}
          onChange={handleChange}
          className={styles.honeypot}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {/* Send Button */}
        <button
          type="submit"
          className={styles.sendButton}
          disabled={isSubmitting}
          aria-label="Send email"
        >
          {isSubmitting ? (
            <>
              <div className={styles.spinner} aria-hidden="true" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send size={20} strokeWidth={2} />
              <span>Send</span>
            </>
          )}
        </button>
      </form>

      {/* Toast Notification */}
      {toast.type && (
        <div
          className={`${styles.toast} ${styles[`toast${toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}`]}`}
          role="alert"
          aria-live="polite"
        >
          <div className={styles.toastIcon}>
            {toast.type === 'success' ? (
              <CheckCircle size={20} strokeWidth={2} />
            ) : (
              <AlertCircle size={20} strokeWidth={2} />
            )}
          </div>
          <span className={styles.toastMessage}>{toast.message}</span>
        </div>
      )}
    </div>
  );
};
