# How to Find Your EmailJS Service ID

## Step-by-Step Instructions

### 1. Log into EmailJS Dashboard
Go to: https://dashboard.emailjs.com/

### 2. Navigate to Email Services
- In the left sidebar, click on **"Email Services"**
- Or go directly to: https://dashboard.emailjs.com/admin

### 3. Find Your Gmail Service
- You should see a list of your connected email services
- Look for the service connected to **Gmail** or `weestemboston@gmail.com`
- It might be named something like "Gmail", "gmail", or a custom name you gave it

### 4. Copy the Service ID
- Click on your Gmail service
- The **Service ID** will be displayed in the service details
- It looks like: `service_abc123` or `service_xyz789`
- **Copy this ID** (click the copy button or select and copy)

### 5. If You Don't Have a Service Yet
If you don't see a Gmail service:
1. Click **"Add New Service"** button
2. Select **"Gmail"** from the list
3. Click **"Connect Account"**
4. Sign in with `weestemboston@gmail.com`
5. Authorize EmailJS to send emails
6. Give it a name (e.g., "WeeCode Contact Form")
7. Click **"Create Service"**
8. Your Service ID will be displayed - copy it!

## After You Get Your Service ID

Update `js/script.js`:
- Find the line: `'YOUR_SERVICE_ID'`
- Replace it with your actual Service ID (e.g., `'service_abc123'`)

## Example:
```javascript
const response = await emailjs.send(
    'service_abc123',        // Your Service ID here
    'template_gqq8oj2',      // Your Template ID (already updated!)
    {
        // ... rest of the code
    }
);
```

## You Also Need Your Public Key

Don't forget to also update:
- `emailjs.init('YOUR_PUBLIC_KEY');` 

To find your Public Key:
1. Go to **Account** → **General** in EmailJS dashboard
2. Scroll down to **"Public Key"**
3. Copy it and replace `'YOUR_PUBLIC_KEY'` in `js/script.js`

