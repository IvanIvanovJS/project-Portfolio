'use client';

import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, CheckCircle, Clock, WifiOff } from 'lucide-react';
import styles from './ContactForm.module.css';

// Props interface - onSubmit will be used in subtask 3.3
interface ContactFormProps {
  onSubmit?: (data: FormData) => Promise<void>;
}

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

export const ContactForm: React.FC<ContactFormProps> = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    _honeypot: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error' | 'rate-limit' | 'network-error'
  >('idle');
  const [rateLimitResetAt, setRateLimitResetAt] = useState<number | null>(null);
  const [retryAfter, setRetryAfter] = useState<number>(0);

  // Countdown timer for rate limiting
  useEffect(() => {
    if (submitStatus === 'rate-limit' && rateLimitResetAt) {
      const interval = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.ceil((rateLimitResetAt - Date.now()) / 1000)
        );
        setRetryAfter(remaining);

        if (remaining === 0) {
          setSubmitStatus('idle');
          setRateLimitResetAt(null);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [submitStatus, rateLimitResetAt]);

  // Auto-hide success, network-error, and error messages after 5 seconds
  useEffect(() => {
    if (
      submitStatus === 'success' ||
      submitStatus === 'network-error' ||
      submitStatus === 'error'
    ) {
      const timer = setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous status
    setSubmitStatus('idle');
    setErrors({});

    // Client-side validation
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'This field is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'This field is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'This field is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'This field is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
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

      if (response.ok) {
        // Success
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          _honeypot: '',
        });
      } else if (response.status === 429) {
        // Rate limit error
        setSubmitStatus('rate-limit');
        const retryAfterSeconds = data.retryAfter || 3600;
        setRetryAfter(retryAfterSeconds);
        setRateLimitResetAt(Date.now() + retryAfterSeconds * 1000);
      } else if (response.status === 400) {
        // Validation errors
        if (data.details) {
          setErrors(data.details);
        } else {
          setSubmitStatus('error');
        }
      } else {
        // Server error
        setSubmitStatus('error');
      }
    } catch (error) {
      // Network error
      console.error('Form submission error:', error);
      setSubmitStatus('network-error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Name Field */}
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          placeholder="Your full name"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.name && (
          <span id="name-error" className={styles.errorMessage} role="alert">
            <AlertCircle size={14} />
            {errors.name}
          </span>
        )}
      </div>

      {/* Email Field */}
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email <span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          placeholder="your.email@example.com"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.email && (
          <span id="email-error" className={styles.errorMessage} role="alert">
            <AlertCircle size={14} />
            {errors.email}
          </span>
        )}
      </div>

      {/* Subject Field */}
      <div className={styles.formGroup}>
        <label htmlFor="subject" className={styles.label}>
          Subject <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
          placeholder="What is this about?"
          aria-required="true"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.subject && (
          <span id="subject-error" className={styles.errorMessage} role="alert">
            <AlertCircle size={14} />
            {errors.subject}
          </span>
        )}
      </div>

      {/* Message Field */}
      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>
          Message <span className={styles.required}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
          placeholder="Tell me about your project or inquiry..."
          rows={6}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.message && (
          <span id="message-error" className={styles.errorMessage} role="alert">
            <AlertCircle size={14} />
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

      {/* Submit Button */}
      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className={styles.spinner} />
            Sending...
          </>
        ) : (
          <>
            <Send size={18} />
            Send Message
          </>
        )}
      </button>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className={styles.successMessage} role="status">
          <CheckCircle size={18} />
          <span>
            Message sent successfully! I&apos;ll get back to you soon.
          </span>
        </div>
      )}

      {submitStatus === 'rate-limit' && (
        <div className={styles.rateLimitMessage} role="alert">
          <Clock size={18} />
          <span>
            Too many attempts. Please wait {Math.floor(retryAfter / 60)}:
            {String(retryAfter % 60).padStart(2, '0')} before trying again.
          </span>
        </div>
      )}

      {submitStatus === 'network-error' && (
        <div className={styles.errorMessageBox} role="alert">
          <div className={styles.errorContent}>
            <WifiOff size={18} />
            <p>Connection lost. Please check your internet and try again.</p>
          </div>
          <button
            type="button"
            onClick={() => setSubmitStatus('idle')}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className={styles.errorMessageBox} role="alert">
          <div className={styles.errorContent}>
            <AlertCircle size={18} />
            <p>
              Something went wrong on our end. Please try again or contact me
              directly at ivanov@webmorphism.com
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSubmitStatus('idle')}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      )}
    </form>
  );
};

export default ContactForm;
