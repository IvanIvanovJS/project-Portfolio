# Requirements Document

## Introduction

This specification defines the integration of Resend API for email functionality in the portfolio website. The system will enable contact form submissions from both the main contact section and a new Mail app within the iPhone widget, with automatic reply functionality, spam protection, and secure API key handling.

## Glossary

- **Contact Form System**: The web forms that allow visitors to send messages through the website
- **Resend API**: Third-party email service provider used for sending transactional emails
- **Auto-Reply System**: Automated email response sent to form submitters acknowledging receipt
- **Rate Limiter**: Mechanism to prevent abuse by limiting submission frequency per IP address
- **Honeypot Field**: Hidden form field used to detect and block automated spam bots
- **API Route**: Next.js server-side endpoint that handles form submissions securely
- **Main Contact Form**: The contact form in the main contact section of the website
- **iPhone Mail App**: A new mail application within the iPhone widget component

## Requirements

### Requirement 1

**User Story:** As a website visitor, I want to send a message through the contact form, so that I can communicate with the portfolio owner

#### Acceptance Criteria

1. WHEN a visitor submits the main contact form with valid data, THE Contact Form System SHALL send the message to ivanov@webmorphism.com via Resend API
2. WHEN a visitor submits the iPhone Mail app form with valid data, THE Contact Form System SHALL send the message to ivanov@webmorphism.com via Resend API
3. WHEN a form submission is successful, THE Contact Form System SHALL display a success message to the visitor
4. WHEN a form submission fails, THE Contact Form System SHALL display an appropriate error message to the visitor
5. WHILE a form is being submitted, THE Contact Form System SHALL disable the submit button and show a loading indicator

### Requirement 2

**User Story:** As a form submitter, I want to receive an automatic confirmation email, so that I know my message was received

#### Acceptance Criteria

1. WHEN a form submission is successful, THE Auto-Reply System SHALL send a confirmation email to the submitter's email address
2. THE Auto-Reply System SHALL include a thank you message in the confirmation email
3. THE Auto-Reply System SHALL include a notice that the recipient should not reply to the automated email
4. THE Auto-Reply System SHALL include information that a response will be provided within 24 hours (usually sooner)
5. THE Auto-Reply System SHALL include a signature "Ivan Ivanov" styled with the Corinthia or Lavishly Yours font family positioned in the bottom right corner

### Requirement 3

**User Story:** As the portfolio owner, I want to protect my contact forms from spam, so that I only receive legitimate messages

#### Acceptance Criteria

1. THE Contact Form System SHALL implement a honeypot field that is hidden from human users
2. WHEN a submission includes data in the honeypot field, THE Contact Form System SHALL reject the submission silently
3. THE Contact Form System SHALL implement rate limiting that tracks submissions per IP address
4. WHEN an IP address exceeds 3 submissions within 60 minutes, THE Contact Form System SHALL reject additional submissions with a rate limit error
5. THE Contact Form System SHALL store rate limit data in memory with automatic expiration

### Requirement 4

**User Story:** As the portfolio owner, I want the API key to be secure, so that unauthorized users cannot access my Resend account

#### Acceptance Criteria

1. THE Contact Form System SHALL read the RESEND_API_KEY from environment variables only
2. THE Contact Form System SHALL process all email sending operations on the server side via Next.js API routes
3. THE Contact Form System SHALL never expose the RESEND_API_KEY in client-side code or network responses
4. THE Contact Form System SHALL validate that the RESEND_API_KEY exists before attempting to send emails
5. WHEN the RESEND_API_KEY is missing or invalid, THE Contact Form System SHALL return an appropriate error without exposing the key status

### Requirement 5

**User Story:** As a mobile user viewing the iPhone widget, I want to send a message through the Mail app, so that I can contact the portfolio owner directly from the widget

#### Acceptance Criteria

1. THE iPhone Mail App SHALL provide a form interface with fields for name, email, subject, and message
2. THE iPhone Mail App SHALL follow iOS Mail app design patterns with glassmorphism styling
3. WHEN a user opens the Mail app in the iPhone widget, THE iPhone Mail App SHALL display an empty compose form
4. THE iPhone Mail App SHALL validate form inputs before submission
5. THE iPhone Mail App SHALL integrate with the same API route as the main contact form

### Requirement 6

**User Story:** As a developer, I want clear validation messages, so that users understand what corrections are needed

#### Acceptance Criteria

1. WHEN a required field is empty, THE Contact Form System SHALL display "This field is required"
2. WHEN an email format is invalid, THE Contact Form System SHALL display "Please enter a valid email address"
3. WHEN a message is too short (less than 10 characters), THE Contact Form System SHALL display "Message must be at least 10 characters"
4. THE Contact Form System SHALL display validation errors inline below the relevant form field
5. THE Contact Form System SHALL clear validation errors when the user begins typing in the field

### Requirement 7

**User Story:** As the portfolio owner, I want to receive well-formatted emails, so that I can easily read and respond to inquiries

#### Acceptance Criteria

1. THE Contact Form System SHALL format notification emails with clear sections for name, email, subject, and message
2. THE Contact Form System SHALL include the submitter's email in the reply-to header
3. THE Contact Form System SHALL use a professional email template with proper HTML formatting
4. THE Contact Form System SHALL include the submission timestamp in the notification email
5. THE Contact Form System SHALL sanitize user input to prevent HTML injection in emails
