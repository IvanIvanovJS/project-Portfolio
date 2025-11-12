/**
 * Contact form API route handler
 * Handles form submissions with validation, spam protection, and email sending
 * Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 3.1, 3.2, 3.3, 3.4, 4.2, 4.3, 4.4, 4.5
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  validateContactForm,
  sanitizeInput,
  type ContactFormData,
} from '@/lib/validation/contactValidation';
import { rateLimiter } from '@/lib/security/rateLimiter';
import { createEmailService } from '@/lib/email/emailService';

/**
 * Response interface for contact form submissions
 */
interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
  errorCode?: string;
  details?: Record<string, string>;
  retryAfter?: number;
}

/**
 * Extracts IP address from request headers
 * Checks multiple headers for proxy/CDN compatibility
 */
function getClientIP(request: NextRequest): string {
  // Check common headers for IP address (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  // Use the first available IP
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, use the first one
    return forwardedFor.split(',')[0].trim();
  }

  // Fallback to a default identifier
  return 'unknown';
}

/**
 * POST handler for contact form submissions
 * Validates input, checks spam protection, and sends emails
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let body: ContactFormData;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format',
          errorCode: 'INVALID_JSON',
        } as ContactResponse,
        { status: 400 }
      );
    }

    // Check honeypot field (spam detection)
    // Requirement 3.1, 3.2: Reject submissions with honeypot data silently
    if (body._honeypot && body._honeypot.trim().length > 0) {
      // Return success to avoid revealing spam detection
      return NextResponse.json(
        {
          success: true,
          message: 'Message sent successfully',
        } as ContactResponse,
        { status: 200 }
      );
    }

    // Validate form data
    // Requirement 6.1, 6.2, 6.3, 6.4: Validate all fields
    const validation = validateContactForm(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please check the highlighted fields',
          errorCode: 'VALIDATION_ERROR',
          details: validation.errors,
        } as ContactResponse,
        { status: 400 }
      );
    }

    // Extract IP address for rate limiting
    const clientIP = getClientIP(request);

    // Apply rate limiting
    // Requirement 3.3, 3.4: Limit to 3 requests per 60 minutes per IP
    const rateLimitResult = rateLimiter.check(clientIP);
    if (!rateLimitResult.allowed) {
      const retryAfterSeconds = Math.ceil(
        (rateLimitResult.resetAt - Date.now()) / 1000
      );

      return NextResponse.json(
        {
          success: false,
          error: `Too many attempts. Please wait ${Math.ceil(retryAfterSeconds / 60)} minutes before trying again`,
          errorCode: 'RATE_LIMIT_EXCEEDED',
          retryAfter: retryAfterSeconds,
        } as ContactResponse,
        {
          status: 429,
          headers: {
            'Retry-After': retryAfterSeconds.toString(),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
          },
        }
      );
    }

    // Sanitize inputs for email templates
    // Requirement 7.5: Prevent HTML injection
    const sanitizedData = {
      name: sanitizeInput(body.name.trim()),
      email: body.email.trim(),
      subject: sanitizeInput(body.subject.trim()),
      message: sanitizeInput(body.message.trim()),
    };

    // Create email service
    // Requirement 4.1, 4.4: Validate API key exists
    const emailService = createEmailService();
    if (!emailService) {
      console.error('Email service initialization failed: Missing API key');
      return NextResponse.json(
        {
          success: false,
          error:
            'Email service is currently unavailable. Please try again later or contact me directly at ivanov@webmorphism.com',
          errorCode: 'SERVICE_UNAVAILABLE',
        } as ContactResponse,
        { status: 500 }
      );
    }

    // Send emails in parallel
    // Requirement 1.1, 1.2, 2.1: Send notification and auto-reply
    try {
      await emailService.sendContactFormEmails(sanitizedData);
    } catch (error) {
      console.error('Failed to send emails:', error);
      return NextResponse.json(
        {
          success: false,
          error:
            'Failed to send your message. Please try again or contact me directly at ivanov@webmorphism.com',
          errorCode: 'EMAIL_SEND_FAILED',
        } as ContactResponse,
        { status: 500 }
      );
    }

    // Return success response
    // Requirement 1.3: Display success message
    return NextResponse.json(
      {
        success: true,
        message:
          'Thank you for your message! I will get back to you as soon as possible.',
      } as ContactResponse,
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '3',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
        },
      }
    );
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in contact API route:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          'An unexpected error occurred. Please try again or contact me directly at ivanov@webmorphism.com',
        errorCode: 'INTERNAL_ERROR',
      } as ContactResponse,
      { status: 500 }
    );
  }
}
