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

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setActiveMenuItem();
});

// Also run on page navigation (for single-page apps or if using history API)
window.addEventListener('popstate', function() {
    setActiveMenuItem();
});

