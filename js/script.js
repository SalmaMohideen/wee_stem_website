// Function to set active menu item based on current page
function setActiveMenuItem() {
    // Get the current page name from the URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove .html extension and normalize
    const pageName = currentPage.replace('.html', '').toLowerCase();
    
    // Remove active class from all nav links and dropdown links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    dropdownLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Remove has-active class from all dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('has-active');
    });
    
    // Handle different pages
    if (pageName === 'index' || pageName === '') {
        // Home page
        const homeLink = document.querySelector('.nav-link[data-page="home"]');
        if (homeLink) homeLink.classList.add('active');
    } else if (pageName === 'contact') {
        // Contact page
        const contactLink = document.querySelector('.nav-link[href="contact.html"]');
        if (contactLink) contactLink.classList.add('active');
    } else if (pageName === 'wee-explorers' || pageName === 'junior-tinkerers') {
        // Our Classes sub-pages
        const dropdown = document.querySelector('.dropdown .nav-link[data-page="our-classes"]').closest('.dropdown');
        if (dropdown) dropdown.classList.add('has-active');
        const activeSubLink = document.querySelector(`.dropdown-link[href="${pageName}.html"]`);
        if (activeSubLink) activeSubLink.classList.add('active');
    } else if (pageName === 'our-team' || pageName === 'our-mission') {
        // About Us sub-pages
        const dropdown = document.querySelector('.dropdown .nav-link[data-page="about-us"]').closest('.dropdown');
        if (dropdown) dropdown.classList.add('has-active');
        const activeSubLink = document.querySelector(`.dropdown-link[href="${pageName}.html"]`);
        if (activeSubLink) activeSubLink.classList.add('active');
    }
    // For other pages (our-classes, about-us), the HTML already has the correct active states
}

// Sanitize input to prevent XSS attacks
function sanitizeInput(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Check for spam indicators
function isSpamCheck(text) {
    const spamPatterns = [
        /(http|https):\/\/[^\s]+/gi, // URLs
        /(click here|buy now|limited time)/gi, // Common spam phrases
    ];
    
    // Allow reasonable URLs and text, but flag excessive links
    const urlCount = (text.match(/(http|https):\/\/[^\s]+/gi) || []).length;
    if (urlCount > 3) {
        return true; // Too many URLs
    }
    
    return false;
}

// Rate limiting - prevent rapid submissions
let lastSubmissionTime = 0;
const MIN_SUBMISSION_INTERVAL = 10000; // 10 seconds between submissions

// Contact form handler with EmailJS integration
function handleContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Initialize EmailJS
        // IMPORTANT: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
        // Get this from https://dashboard.emailjs.com/admin/integration
        emailjs.init('CmxHrGPa2C8-37paz');
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('.contact-submit-btn');
            const originalButtonText = submitButton.innerHTML;
            
            // Rate limiting check
            const now = Date.now();
            if (now - lastSubmissionTime < MIN_SUBMISSION_INTERVAL) {
                alert('Please wait a moment before submitting again.');
                return;
            }
            
            // Get and sanitize form values
            const name = sanitizeInput(document.getElementById('name').value.trim());
            const email = document.getElementById('email').value.trim();
            const message = sanitizeInput(document.getElementById('message').value.trim());
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Length validation to prevent abuse
            if (name.length > 100) {
                alert('Name is too long. Please use 100 characters or less.');
                return;
            }
            
            if (message.length > 2000) {
                alert('Message is too long. Please use 2000 characters or less.');
                return;
            }
            
            if (message.length < 10) {
                alert('Message is too short. Please provide more details.');
                return;
            }
            
            // Spam check
            if (isSpamCheck(message) || isSpamCheck(name)) {
                alert('Your message contains content that appears to be spam. Please revise and try again.');
                return;
            }
            
            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';
            
            try {
                // reCAPTCHA v3 verification (invisible - runs in background)
                let recaptchaToken = '';
                if (typeof grecaptcha !== 'undefined') {
                    try {
                        // Execute reCAPTCHA v3 and get token
                        recaptchaToken = await grecaptcha.execute('6LdrRSAsAAAAABsYBNrtHtHgg5k8af_yRdEBkRR5', {action: 'submit'});
                    } catch (recaptchaError) {
                        console.error('reCAPTCHA Error:', recaptchaError);
                        // Continue without reCAPTCHA token if it fails (non-blocking)
                    }
                }
                
                // Send email using EmailJS
                // IMPORTANT: Replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID' with your actual IDs
                // See setup instructions in SECURITY.md
                const response = await emailjs.send(
                    'service_vo1rad4',  // EmailJS Service ID
                    'template_gqq8oj2', // EmailJS Template ID
                    {
                        from_name: name,
                        from_email: email,
                        message: message,
                        to_email: 'weestemboston@gmail.com',
                        recaptcha_token: recaptchaToken // Include reCAPTCHA token in email (for logging/verification)
                    }
                );
                
                // Success
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                lastSubmissionTime = Date.now();
                
            } catch (error) {
                console.error('EmailJS Error:', error);
                alert('Sorry, there was an error sending your message. Please try again later or email us directly at weestemboston@gmail.com');
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setActiveMenuItem();
    handleContactForm();
});

// Also run on page navigation (for single-page apps or if using history API)
window.addEventListener('popstate', function() {
    setActiveMenuItem();
});

