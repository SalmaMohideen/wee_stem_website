# Security Documentation for WeeCode Website

## Current Security Measures Implemented

### 1. Input Validation & Sanitization
- ✅ **XSS Protection**: All user inputs are sanitized before processing
- ✅ **Email Format Validation**: Regex validation for email addresses
- ✅ **Length Limits**: Name (100 chars), Message (10-2000 chars) to prevent abuse
- ✅ **Spam Detection**: Basic pattern matching for common spam indicators (excessive URLs, spam phrases)

### 2. Rate Limiting
- ✅ **Submission Throttling**: 10-second minimum interval between form submissions per user
- ✅ Prevents rapid-fire spam submissions

### 3. EmailJS Integration
- ✅ **Client-Side Email Service**: Secure email sending without exposing credentials
- ⚠️ **REQUIRES SETUP**: You need to configure EmailJS (see setup instructions below)

---

## EmailJS Setup Instructions

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account (200 emails/month free tier)

### Step 2: Create Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** as your email service
4. Connect your `weestemboston@gmail.com` Gmail account
5. Save your **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. **Subject Line**: `New Contact Form Submission from {{from_name}}`
4. **Content Type**: Select **HTML** (not plain text)
5. **Email Content**: Copy and paste the HTML from `emailjs_template.html` file in this project
   - Or use this simple version if you prefer plain text:
     ```
     Subject: New Contact Form Submission from {{from_name}}
     
     From: {{from_name}}
     Email: {{from_email}}
     
     Message:
     {{message}}
     ```
6. **Template Variables**: Make sure these are set up:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{message}}` - Message content
   - `{{recaptcha_token}}` - Optional: reCAPTCHA token (for verification)
7. Save your **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key** (starts with something like `abcDEF123`)

### Step 5: Update the Code
Open `js/script.js` and replace these placeholders:
- Replace `'YOUR_PUBLIC_KEY'` with your EmailJS Public Key
- Replace `'YOUR_SERVICE_ID'` with your Service ID
- Replace `'YOUR_TEMPLATE_ID'` with your Template ID

---

## Additional Security Recommendations

### 🔴 HIGH PRIORITY

#### 1. HTTPS/SSL Certificate
**Why**: Encrypts all data transmitted between users and your website
**How**:
- If hosting on GitHub Pages: HTTPS is automatic
- If using custom hosting: Get SSL certificate (free via Let's Encrypt)
- **Action Required**: Ensure your hosting provider enables HTTPS

#### 2. Content Security Policy (CSP) ✅ IMPLEMENTED
**Why**: Prevents XSS attacks by controlling which resources can be loaded
**Status**: ✅ Added as meta tag to all HTML pages (GitHub Pages doesn't support HTTP headers)
**Implementation**: CSP meta tag added to `<head>` of all pages:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://api.emailjs.com;">
```
**Note**: Meta tag CSP is less secure than HTTP headers (can be bypassed by some older browsers), but it's the best option for GitHub Pages. For production, consider migrating to a hosting service that supports HTTP headers.

#### 3. Google reCAPTCHA ✅ IMPLEMENTED
**Why**: Adds bot protection to your contact form
**Status**: ✅ Implemented with reCAPTCHA v3 (invisible)
**Site Key**: `6LdrRSAsAAAAABsYBNrtHtHgg5k8af_yRdEBkRR5`
**Implementation**: 
- reCAPTCHA v3 runs invisibly in the background
- No visible widget - better user experience
- Generates token on form submission for bot detection
- Token included in email submission for verification
- CSP updated to allow reCAPTCHA scripts
**Note**: reCAPTCHA v3 provides a score (0.0-1.0) indicating bot likelihood. Currently runs client-side; for production, consider server-side token verification.

### 🟡 MEDIUM PRIORITY

#### 4. Server-Side Validation
**Why**: Client-side validation can be bypassed
**Current**: Using EmailJS (they handle server-side)
**Action**: EmailJS provides some server-side validation, but consider adding a backend if volume increases

#### 5. Input Length Restrictions (Already Implemented)
- ✅ Name: max 100 characters
- ✅ Message: 10-2000 characters

#### 6. Regular Security Updates
- Keep EmailJS SDK updated
- Monitor for security advisories
- Review form submissions for patterns

### 🟢 LOW PRIORITY (But Still Important)

#### 7. Honeypot Field
**Why**: Catches bots that auto-fill forms
**Status**: Can be added if spam becomes an issue

#### 8. Security Headers
Add these HTTP headers on your server:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

#### 9. Regular Backups
- Backup your website files regularly
- Keep backups of form submissions (EmailJS logs these)

#### 10. Monitor EmailJS Dashboard
- Check the EmailJS dashboard regularly for unusual activity
- Set up email alerts if available

---

## Current Security Status

| Security Measure | Status | Priority |
|-----------------|--------|----------|
| Input Sanitization | ✅ Implemented | High |
| Email Validation | ✅ Implemented | High |
| Rate Limiting | ✅ Implemented | High |
| HTTPS/SSL | ⚠️ Depends on Hosting | Critical |
| CSP (Meta Tag) | ✅ Implemented | High |
| reCAPTCHA | ✅ Implemented | Medium |
| Server-Side Validation | ⚠️ Via EmailJS | Medium |
| Security Headers | ❌ Not Set (GitHub Pages limitation) | Medium |

---

## Testing Your Security

1. **Test the Form**: Submit a test message to verify EmailJS works
2. **Test Rate Limiting**: Try submitting twice within 10 seconds
3. **Test Validation**: Try submitting invalid emails, empty fields
4. **Check HTTPS**: Verify your site loads with `https://` in the URL
5. **Browser Console**: Check for any security warnings

---

## What EmailJS Provides

✅ **Built-in Security Features**:
- Server-side processing (credentials never exposed)
- Built-in spam filtering
- Rate limiting on their end
- Email delivery tracking

⚠️ **Limitations**:
- Free tier: 200 emails/month
- Client-side SDK (can be viewed in page source, but keys are meant to be public)
- Requires internet connection

---

## If You Experience Issues

### Form Not Sending Emails
1. Check EmailJS dashboard for errors
2. Verify Service ID, Template ID, and Public Key are correct
3. Check browser console for JavaScript errors
4. Ensure Gmail account is properly connected in EmailJS

### Too Much Spam
1. Enable reCAPTCHA (contact me to implement)
2. Consider upgrading EmailJS plan for better spam filtering
3. Add honeypot field
4. Review and tighten spam detection patterns

### Security Concerns
1. Review this document
2. Implement high-priority items
3. Consider hiring a security consultant for enterprise-level sites
4. Keep software dependencies updated

---

## Questions or Need Help?

If you need help implementing any of these security measures, let me know which ones you'd like to prioritize!

