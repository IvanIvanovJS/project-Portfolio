# Design Document

## Overview

This design document outlines the implementation of email functionality using Resend API for the portfolio website. The system will handle contact form submissions from two sources: the main contact section and a new Mail app within the iPhone widget. The architecture emphasizes security, user experience, and spam prevention.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
│  ┌──────────────────┐         ┌──────────────────────┐     │
│  │ Main Contact     │         │ iPhone Mail App      │     │
│  │ Form Component   │         │ Component            │     │
│  └────────┬─────────┘         └──────────┬───────────┘     │
│           │                               │                  │
│           └───────────────┬───────────────┘                  │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (Next.js)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  POST /api/contact                                    │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │ Validation │→ │ Rate Limiter │→ │ Honeypot    │  │  │
│  │  └────────────┘  └──────────────┘  └─────────────┘  │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Email Service                                   │ │  │
│  │  │  ┌──────────────┐  ┌──────────────────────┐   │ │  │
│  │  │  │ Send to      │  │ Send Auto-Reply      │   │ │  │
│  │  │  │ Owner        │  │ to Submitter         │   │ │  │
│  │  │  └──────────────┘  └──────────────────────┘   │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  External Services                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Resend API                                           │  │
│  │  - Send notification to ivanov@webmorphism.com       │  │
│  │  - Send auto-reply to submitter                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Form Submission**: User fills out contact form (main or iPhone widget)
2. **Client Validation**: Basic validation on client side for UX
3. **API Request**: POST to `/api/contact` with form data + honeypot
4. **Server Validation**: Validate all inputs, check honeypot, apply rate limiting
5. **Email Sending**: Send notification to owner and auto-reply to submitter
6. **Response**: Return success/error status to client
7. **UI Update**: Display appropriate message to user

## Components and Interfaces

### 1. API Route Handler

**File**: `src/app/api/contact/route.ts`

```typescript
// Request body interface
interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  _honeypot?: string; // Hidden field for spam detection
}

// Response interface
interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Rate limit store (in-memory)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Main handler
export async function POST(request: Request): Promise<Response>;
```

**Responsibilities**:

- Parse and validate request body
- Check honeypot field
- Apply rate limiting per IP
- Send emails via Resend
- Return appropriate responses

### 2. Email Service

**File**: `src/lib/email/emailService.ts`

```typescript
interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
  replyTo?: string;
}

class EmailService {
  private resend: Resend;

  constructor(apiKey: string);

  async sendNotificationEmail(data: ContactRequest): Promise<void>;
  async sendAutoReplyEmail(data: ContactRequest): Promise<void>;
}
```

**Responsibilities**:

- Initialize Resend client
- Format and send notification emails to owner
- Format and send auto-reply emails to submitters
- Handle Resend API errors

### 3. Email Templates

**File**: `src/lib/email/templates.ts`

```typescript
interface NotificationTemplateData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

interface AutoReplyTemplateData {
  name: string;
}

function getNotificationTemplate(data: NotificationTemplateData): string;
function getAutoReplyTemplate(data: AutoReplyTemplateData): string;
```

**Notification Email Template**:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px;
        border-radius: 8px 8px 0 0;
      }
      .content {
        background: white;
        padding: 30px;
        border: 1px solid #e5e7eb;
      }
      .field {
        margin-bottom: 20px;
      }
      .label {
        font-weight: 600;
        color: #374151;
        margin-bottom: 5px;
      }
      .value {
        color: #6b7280;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #9ca3af;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Contact Form Submission</h1>
      </div>
      <div class="content">
        <div class="field">
          <div class="label">From:</div>
          <div class="value">{name} ({email})</div>
        </div>
        <div class="field">
          <div class="label">Subject:</div>
          <div class="value">{subject}</div>
        </div>
        <div class="field">
          <div class="label">Message:</div>
          <div class="value">{message}</div>
        </div>
        <div class="field">
          <div class="label">Received:</div>
          <div class="value">{timestamp}</div>
        </div>
      </div>
      <div class="footer">Sent from your portfolio contact form</div>
    </div>
  </body>
</html>
```

**Auto-Reply Email Template**:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Corinthia:wght@400;700&family=Lavishly+Yours&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        line-height: 1.6;
        color: #374151;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px;
        border-radius: 8px 8px 0 0;
        text-align: center;
      }
      .content {
        background: white;
        padding: 40px 30px;
        border: 1px solid #e5e7eb;
      }
      .message {
        margin-bottom: 25px;
        font-size: 16px;
      }
      .notice {
        background: #fef3c7;
        border-left: 4px solid #f59e0b;
        padding: 15px;
        margin: 25px 0;
        border-radius: 4px;
      }
      .signature-container {
        text-align: right;
        margin-top: 40px;
      }
      .signature {
        font-family: 'Lavishly Yours', cursive;
        font-size: 36px;
        color: #667eea;
        margin: 0;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #9ca3af;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Thank You for Reaching Out!</h1>
      </div>
      <div class="content">
        <p class="message">Hi {name},</p>

        <p class="message">
          Thank you for contacting me through my portfolio website. I've
          received your message and appreciate you taking the time to reach out.
        </p>

        <div class="notice">
          <strong>⚠️ Please Note:</strong> This is an automated confirmation
          email. Please do not reply to this message.
        </div>

        <p class="message">
          I will review your message and get back to you as soon as possible,
          typically within 24 hours (often much sooner).
        </p>

        <p class="message">Looking forward to connecting with you!</p>

        <div class="signature-container">
          <p class="signature">Ivan Ivanov</p>
        </div>
      </div>
      <div class="footer">This email was sent from ivanov@webmorphism.com</div>
    </div>
  </body>
</html>
```

### 4. Rate Limiter

**File**: `src/lib/security/rateLimiter.ts`

```typescript
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig);

  check(identifier: string): {
    allowed: boolean;
    remaining: number;
    resetAt: number;
  };
  cleanup(): void; // Remove expired entries
}
```

**Configuration**:

- Max requests: 3 per IP
- Time window: 60 minutes (3600000 ms)
- Storage: In-memory Map (sufficient for single-instance deployment)
- Cleanup: Automatic on each check

### 5. Validation Utilities

**File**: `src/lib/validation/contactValidation.ts`

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

function validateContactForm(data: ContactRequest): ValidationResult;
function sanitizeInput(input: string): string;
function isValidEmail(email: string): boolean;
```

**Validation Rules**:

- Name: Required, 2-100 characters, alphanumeric + spaces
- Email: Required, valid email format
- Subject: Required, 3-200 characters
- Message: Required, 10-5000 characters
- Honeypot: Must be empty

### 6. Main Contact Form Updates

**File**: `src/components/sections/contact/ContactForm.tsx`

**Implementation Notes**:

- **MINIMAL UI CHANGES**: Keep existing visual design, enhance error handling UX
- Add hidden honeypot field (visually hidden with CSS)
- Implement form submission to `/api/contact`
- **Enhanced Error Handling**:
  - Improved inline validation error messages with icons
  - Network error messages with retry button
  - Rate limit errors with countdown timer
  - Server error messages with helpful guidance
  - Loading states with progress indication
- Display appropriate feedback messages (enhance existing message components)
- Clear form on successful submission
- Add toast notifications for better feedback
- Smooth transitions for error/success states

### 7. iPhone Mail App Component

**File**: `src/components/sections/about/iphone-widget/apps/MailApp.tsx`

```typescript
interface MailAppProps {
  // Props if needed
}

export const MailApp: React.FC<MailAppProps>;
```

**Implementation Notes**:

- **MINIMAL UI CHANGES**: Keep existing visual design, enhance error handling UX
- Add hidden honeypot field to existing form
- Implement form submission to `/api/contact` endpoint
- **Enhanced Error Handling**:
  - iOS-style alert dialogs for errors
  - Inline validation with shake animations
  - Loading overlay with spinner
  - Success confirmation with checkmark animation
  - Network error with retry option
  - Rate limit errors with clear messaging
- Form validation matching main contact form
- All functionality should match main contact form
- Smooth iOS-style transitions for states

## Data Models

### Contact Form Data

```typescript
interface ContactFormData {
  name: string; // 2-100 characters
  email: string; // Valid email format
  subject: string; // 3-200 characters
  message: string; // 10-5000 characters
  _honeypot?: string; // Should be empty
}
```

### Rate Limit Entry

```typescript
interface RateLimitEntry {
  count: number; // Number of requests
  resetAt: number; // Timestamp when limit resets
}
```

### Email Metadata

```typescript
interface EmailMetadata {
  submittedAt: string; // ISO timestamp
  ipAddress?: string; // For logging (not stored long-term)
  userAgent?: string; // For logging
  source: 'main-form' | 'iphone-widget';
}
```

## Error Handling

### Client-Side Errors

1. **Validation Errors**:
   - Display inline below each field with error icon
   - Red border on invalid fields
   - Smooth fade-in animation
   - Clear on user input

2. **Network Errors**:
   - Display error banner with retry button
   - Show connection status
   - Automatic retry with exponential backoff
   - Offline detection

3. **Rate Limit Errors**:
   - Display message with countdown timer
   - Show time until reset
   - Disable submit button during cooldown
   - Visual progress indicator

4. **Server Errors**:
   - Display user-friendly error message
   - Provide alternative contact methods
   - Log technical details for debugging
   - Show error ID for support reference

### Enhanced Error UI Components

**Error Message Component**:

```typescript
interface ErrorMessageProps {
  type: 'validation' | 'network' | 'rate-limit' | 'server';
  message: string;
  field?: string;
  retryAfter?: number;
  onRetry?: () => void;
}
```

**Visual Enhancements**:

- Error icons (AlertCircle, WifiOff, Clock, XCircle)
- Color-coded messages (red for errors, yellow for warnings)
- Smooth animations (fade, slide, shake)
- Toast notifications for non-blocking feedback
- Progress indicators for async operations

### Server-Side Errors

1. **Validation Failures**: Return 400 with specific field errors
2. **Rate Limit Exceeded**: Return 429 with retry-after header
3. **Honeypot Triggered**: Return 400 silently (no specific message)
4. **Resend API Errors**: Log error, return 500 with generic message
5. **Missing API Key**: Log error, return 500 with generic message

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: string;
  errorCode?: string; // For client-side handling
  details?: Record<string, string>; // Field-specific errors
  retryAfter?: number; // For rate limiting (seconds)
  timestamp?: string; // For logging
}
```

### Error Messages

**User-Friendly Messages**:

- Validation: "Please check the highlighted fields"
- Network: "Connection lost. Please check your internet and try again"
- Rate Limit: "Too many attempts. Please wait {time} before trying again"
- Server: "Something went wrong on our end. Please try again or contact me directly at ivanov@webmorphism.com"

## Testing Strategy

### Unit Tests

1. **Validation Functions**
   - Test all validation rules
   - Test edge cases (empty, too long, special characters)
   - Test email format validation

2. **Rate Limiter**
   - Test request counting
   - Test time window expiration
   - Test cleanup functionality

3. **Email Templates**
   - Test template rendering with various inputs
   - Test HTML escaping/sanitization

### Integration Tests

1. **API Route**
   - Test successful submission flow
   - Test validation error responses
   - Test rate limiting behavior
   - Test honeypot detection

2. **Email Service**
   - Test with Resend test mode
   - Verify email formatting
   - Test error handling

### Manual Testing

1. **Main Contact Form**
   - Submit valid form
   - Test validation errors
   - Verify email receipt
   - Test rate limiting

2. **iPhone Mail App**
   - Submit from widget
   - Test mobile interactions
   - Verify same functionality as main form

3. **Auto-Reply**
   - Verify receipt of auto-reply
   - Check formatting and signature
   - Test with various email clients

## Security Considerations

### API Key Protection

- Store in `.env.local` (not committed)
- Access only in server-side code
- Never expose in client bundles or API responses
- Validate presence before use

### Input Sanitization

- Escape HTML in all user inputs
- Prevent XSS in email templates
- Validate all fields server-side
- Limit input lengths

### Rate Limiting

- Track by IP address
- Implement exponential backoff
- Clear old entries periodically
- Consider Redis for production scaling

### Honeypot Implementation

- Hidden with CSS (not display:none)
- Named generically (\_honeypot)
- Positioned off-screen
- Fail silently when triggered

### CORS and Headers

- Restrict API to same origin
- Set appropriate security headers
- Use HTTPS in production
- Implement CSRF protection if needed

## Performance Optimization

### Email Sending

- Send both emails in parallel using Promise.all()
- Set reasonable timeouts
- Implement retry logic for transient failures

### Rate Limiting

- Use efficient Map data structure
- Cleanup expired entries on each check
- Consider LRU cache for high traffic

### Client-Side

- Debounce validation
- Show loading states immediately
- Optimize form re-renders
- Lazy load Mail app component

## Dependencies

### Required NPM Packages

The following packages need to be installed:

```bash
npm install resend
```

**Package Details**:

- `resend`: Official Resend SDK for Node.js - handles email sending via Resend API
- Version: Latest stable (^3.0.0 or higher recommended)

### Optional Packages (for enhanced features)

```bash
npm install @chakra-ui/toast  # If not already installed for toast notifications
```

**Note**: Check existing dependencies before installing. Some packages may already be available in the project.

## Deployment Considerations

### Environment Variables

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_CONTACT_EMAIL=ivanov@webmorphism.com
```

### Vercel Configuration

- Ensure environment variables are set
- Configure serverless function timeout (10s recommended)
- Monitor function execution logs
- Set up error tracking (Sentry, etc.)

### Monitoring

- Track email delivery success rate
- Monitor rate limit triggers
- Log honeypot detections
- Alert on API failures

## Future Enhancements

1. **Database Storage**: Store submissions for backup/analytics
2. **Admin Dashboard**: View submissions, manage spam
3. **Email Templates**: Allow customization without code changes
4. **Advanced Spam Detection**: Integrate with services like Akismet
5. **File Attachments**: Support resume/portfolio uploads
6. **Multi-language**: Support auto-replies in multiple languages
7. **Read Receipts**: Track when emails are opened
8. **Response Templates**: Quick replies for common inquiries
