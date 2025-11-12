/**
 * Email service for sending contact form notifications and auto-replies
 * Uses Resend API for transactional email delivery
 */

import { Resend } from 'resend';
import {
  getNotificationTemplate,
  getNotificationTextTemplate,
  getAutoReplyTemplate,
  getAutoReplyTextTemplate,
  type NotificationTemplateData,
  type AutoReplyTemplateData,
} from './templates';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Email service class for handling contact form email operations
 */
export class EmailService {
  private resend: Resend;
  private readonly ownerEmail = 'ivanov@webmorphism.com';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Resend API key is required');
    }
    this.resend = new Resend(apiKey);
  }

  /**
   * Sends notification email to portfolio owner
   * @param data Contact form submission data
   * @throws Error if email sending fails
   */
  async sendNotificationEmail(data: ContactFormData): Promise<void> {
    try {
      const timestamp = new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'long',
      });

      const templateData: NotificationTemplateData = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        timestamp,
      };

      const html = getNotificationTemplate(templateData);
      const text = getNotificationTextTemplate(templateData);

      await this.resend.emails.send({
        from: 'Ivan Ivanov <ivanov@webmorphism.com>',
        to: this.ownerEmail,
        subject: `New Contact: ${data.subject}`,
        html,
        text,
        replyTo: data.email,
      });
    } catch (error) {
      console.error('Failed to send notification email:', error);
      throw new Error('Failed to send notification email');
    }
  }

  /**
   * Sends auto-reply confirmation email to form submitter
   * @param data Contact form submission data
   * @throws Error if email sending fails
   */
  async sendAutoReplyEmail(data: ContactFormData): Promise<void> {
    try {
      const templateData: AutoReplyTemplateData = {
        name: data.name,
      };

      const html = getAutoReplyTemplate(templateData);
      const text = getAutoReplyTextTemplate(templateData);

      await this.resend.emails.send({
        from: 'Ivan Ivanov <ivanov@webmorphism.com>',
        to: data.email,
        subject: 'Thank you for reaching out!',
        html,
        text,
      });
    } catch (error) {
      console.error('Failed to send auto-reply email:', error);
      throw new Error('Failed to send auto-reply email');
    }
  }

  /**
   * Sends both notification and auto-reply emails in parallel
   * @param data Contact form submission data
   * @returns Promise that resolves when both emails are sent
   * @throws Error if either email fails to send
   */
  async sendContactFormEmails(data: ContactFormData): Promise<void> {
    try {
      await Promise.all([
        this.sendNotificationEmail(data),
        this.sendAutoReplyEmail(data),
      ]);
    } catch (error) {
      console.error('Failed to send contact form emails:', error);
      throw error;
    }
  }
}

/**
 * Creates and returns an EmailService instance
 * @returns EmailService instance or null if API key is not configured
 */
export function createEmailService(): EmailService | null {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('RESEND_API_KEY environment variable is not set');
    return null;
  }

  return new EmailService(apiKey);
}
