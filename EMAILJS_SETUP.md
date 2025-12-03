# EmailJS Template Setup Guide

## Quick Setup

1. **Open the file**: `emailjs_template.html` in this project
2. **Copy all the HTML content** (Ctrl+A / Cmd+A, then Ctrl+C / Cmd+C)
3. **In EmailJS Dashboard**:
   - Go to **Email Templates**
   - Click **Create New Template**
   - **Subject**: `New Contact Form Submission from {{from_name}}`
   - **Content Type**: Select **HTML**
   - **Content**: Paste the HTML you copied
   - Click **Save**

## Template Variables

Make sure these variables are available in your template:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email address
- `{{message}}` - Message content
- `{{recaptcha_token}}` - reCAPTCHA v3 token (optional, for verification)

## Simple Plain Text Alternative

If you prefer a simpler plain text version, use this in EmailJS:

**Subject**: `New Contact Form Submission from {{from_name}}`

**Content** (select "Plain Text" instead of HTML):
```
You have received a new message from your website contact form.

Name: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
This email was sent from the contact form on your WeeCode website.
Reply directly to: {{from_email}}
```

## Template Features

The HTML template includes:
- ✅ Professional styling with your brand colors (blue, green)
- ✅ Responsive design (works on mobile)
- ✅ Clear formatting for easy reading
- ✅ Clickable email link
- ✅ reCAPTCHA token included for verification
- ✅ Email-safe HTML (uses tables for layout)

## After Setting Up

1. **Copy your Template ID** from EmailJS dashboard
2. **Update `js/script.js`** - replace `'YOUR_TEMPLATE_ID'` with your actual Template ID
3. **Test the form** on your website!

