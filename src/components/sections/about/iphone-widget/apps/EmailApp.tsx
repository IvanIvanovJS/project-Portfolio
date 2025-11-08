'use client';

import React, { useState, FormEvent } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { PersonalInfo } from '../types';
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
 *
 * @param props - EmailApp props
 */
export interface EmailAppProps {
  personalInfo: PersonalInfo;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type ToastType = 'success' | 'error' | null;

export const EmailApp: React.FC<EmailAppProps> = ({ personalInfo }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
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
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
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
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      showToast('error', 'Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create mailto link with form data
      const mailtoLink = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
        formData.subject
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;

      // Open default mail client
      window.location.href = mailtoLink;

      // Show success message
      showToast('success', 'Opening your email client...');

      // Reset form after short delay
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending email:', error);
      showToast('error', 'Failed to open email client. Please try again.');
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
