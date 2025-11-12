/**
 * Email template utilities for contact form submissions
 * Provides HTML templates for notification and auto-reply emails
 */

export interface NotificationTemplateData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

export interface AutoReplyTemplateData {
  name: string;
}

/**
 * Generates plain text version of notification email
 */
export function getNotificationTextTemplate(
  data: NotificationTemplateData
): string {
  const { name, email, subject, message, timestamp } = data;

  return `NEW CONTACT FORM SUBMISSION

You have received a new message from your portfolio website contact form.

FROM: ${name} <${email}>

SUBJECT: ${subject}

MESSAGE:
${message}

RECEIVED: ${timestamp}

---
This message was sent from the contact form on webmorphism.com`;
}

/**
 * Generates plain text version of auto-reply email
 */
export function getAutoReplyTextTemplate(data: AutoReplyTemplateData): string {
  const { name } = data;

  return `Hi ${name},

Thank you for contacting me through my portfolio website. I've received your message and appreciate you taking the time to reach out.

⚠️ Please Note: This is an automated confirmation email. Please do not reply to this message.

I will review your message and get back to you as soon as possible, typically within 24 hours (often much sooner).

Looking forward to connecting with you!

Ivan Ivanov

---
This email was sent from ivanov@webmorphism.com`;
}

/**
 * Escapes HTML special characters to prevent injection
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Generates HTML template for notification email sent to portfolio owner
 */
export function getNotificationTemplate(
  data: NotificationTemplateData
): string {
  const { name, email, subject, message, timestamp } = data;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Contact Form Submission</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #374151;
        margin: 0;
        padding: 0;
        background-color: #f3f4f6;
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
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        background: white;
        padding: 30px;
        border: 1px solid #e5e7eb;
        border-top: none;
      }
      .intro {
        margin-bottom: 25px;
        font-size: 16px;
        color: #374151;
      }
      .field {
        margin-bottom: 20px;
      }
      .label {
        font-weight: 600;
        color: #374151;
        margin-bottom: 5px;
        display: block;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .value {
        color: #6b7280;
        font-size: 16px;
        word-wrap: break-word;
      }
      .message-value {
        white-space: pre-wrap;
        background: #f9fafb;
        padding: 15px;
        border-radius: 6px;
        border-left: 3px solid #667eea;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #9ca3af;
        font-size: 14px;
      }
      .footer a {
        color: #667eea;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Contact Form Submission</h1>
      </div>
      <div class="content">
        <p class="intro">You have received a new message from your portfolio website contact form.</p>
        
        <div class="field">
          <span class="label">From</span>
          <div class="value">${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</div>
        </div>
        <div class="field">
          <span class="label">Subject</span>
          <div class="value">${escapeHtml(subject)}</div>
        </div>
        <div class="field">
          <span class="label">Message</span>
          <div class="value message-value">${escapeHtml(message)}</div>
        </div>
        <div class="field">
          <span class="label">Received</span>
          <div class="value">${escapeHtml(timestamp)}</div>
        </div>
      </div>
      <div class="footer">
        This message was sent from the contact form on <a href="https://webmorphism.com">webmorphism.com</a>
      </div>
    </div>
  </body>
</html>`;
}

/**
 * Generates HTML template for auto-reply email sent to form submitter
 */
export function getAutoReplyTemplate(data: AutoReplyTemplateData): string {
  const { name } = data;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Thank You for Reaching Out</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Lavishly+Yours&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #374151;
        margin: 0;
        padding: 0;
        background-color: #f3f4f6;
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
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        background: white;
        padding: 40px 30px;
        border: 1px solid #e5e7eb;
        border-top: none;
      }
      .message {
        margin-bottom: 25px;
        font-size: 16px;
        color: #374151;
      }
      .notice {
        background: #fef3c7;
        border-left: 4px solid #f59e0b;
        padding: 15px;
        margin: 25px 0;
        border-radius: 4px;
      }
      .notice strong {
        color: #92400e;
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
        line-height: 1.2;
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
        <h1>✨ Thank You for Reaching Out!</h1>
      </div>
      <div class="content">
        <p class="message">Hi ${escapeHtml(name)},</p>

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
</html>`;
}
