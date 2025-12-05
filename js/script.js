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
        // Check if EmailJS is loaded
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS SDK is not loaded. Please check if the script is included in the HTML.');
            alert('Email service is not available. Please refresh the page and try again.');
            return;
        }
        
        // Initialize EmailJS
        try {
            emailjs.init('CmxHrGPa2C8-37paz');
            console.log('EmailJS initialized successfully');
        } catch (initError) {
            console.error('EmailJS initialization error:', initError);
            alert('Email service initialization failed. Please refresh the page and try again.');
            return;
        }
        
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
                // Template variables must match exactly what's in your EmailJS template
                // Template uses: {{name}}, {{email}}, {{title}}, {{from_name}}, {{from_email}}, {{message}}
                const templateParams = {
                    name: name,                    // Maps to {{name}} in template (From Name)
                    email: email,                  // Maps to {{email}} in template (Reply To)
                    title: 'Contact Form Submission', // Maps to {{title}} in template (Subject)
                    from_name: name,               // Maps to {{from_name}} in template (Content)
                    from_email: email,             // Maps to {{from_email}} in template (Content)
                    message: message               // Maps to {{message}} in template (Content)
                };
                
                // Only add recaptcha_token if you've configured it as a template variable
                // If your template doesn't use it, remove this line
                if (recaptchaToken) {
                    templateParams.recaptcha_token = recaptchaToken;
                }
                
                const response = await emailjs.send(
                    'service_vo1rad4',  // EmailJS Service ID
                    'template_gqq8oj2', // EmailJS Template ID
                    templateParams
                );
                
                // Success
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                lastSubmissionTime = Date.now();
                
            } catch (error) {
                // Log detailed error information
                console.error('EmailJS Error Details:', error);
                console.error('Error Status:', error.status);
                console.error('Error Text:', error.text);
                console.error('Error Message:', error.message);
                console.error('Template Params Sent:', {
                    name: name,
                    email: email,
                    message: message.substring(0, 50) + '...'
                });
                
                // Provide more helpful error message
                let errorMessage = 'Sorry, there was an error sending your message. ';
                if (error.text) {
                    errorMessage += `\n\nError: ${error.text}`;
                } else if (error.message) {
                    errorMessage += `\n\nError: ${error.message}`;
                }
                errorMessage += '\n\nPlease check the browser console (F12) for more details, or email us directly at weestemboston@gmail.com';
                
                alert(errorMessage);
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }
}

// Wait for EmailJS to be fully loaded before initializing
function waitForEmailJS(callback, maxAttempts = 50) {
    let attempts = 0;
    const checkInterval = setInterval(() => {
        attempts++;
        if (typeof emailjs !== 'undefined' && emailjs.init) {
            clearInterval(checkInterval);
            callback();
        } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            console.error('EmailJS failed to load after maximum attempts');
        }
    }, 100);
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setActiveMenuItem();
    
    // Wait for EmailJS to load before setting up the form
    if (document.getElementById('contactForm')) {
        waitForEmailJS(() => {
            handleContactForm();
        });
    } else {
        // If there's no contact form, just set up menu
        handleContactForm(); // Will return early if no form
    }
});

// Also run on page navigation (for single-page apps or if using history API)
window.addEventListener('popstate', function() {
    setActiveMenuItem();
});

