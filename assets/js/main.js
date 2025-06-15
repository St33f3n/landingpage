// main.js - Core Website Functionality

// Global State
window.stefanSite = {
    currentPage: 'strand',
    isTransitioning: false,
    isMobile: window.innerWidth <= 768,
    mousePosition: { x: 0, y: 0 },
    initialized: false
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.stefanSite.initialized) return;
    
    console.log('🏝️ Stefan Simmeth Website - Initializing...');
    
    initializeCore();
    initializeMobileNavigation();
    initializeAccessibility();
    initializePerformanceOptimizations();
    
    window.stefanSite.initialized = true;
    console.log('✅ Website initialized successfully');
});

// Core Initialization
function initializeCore() {
    // Set initial page based on URL
    const path = window.location.pathname;
    let initialPage = 'strand';
    
    if (path.includes('ocean') || path.includes('it-ocean')) {
        initialPage = 'ocean';
    } else if (path.includes('jungle') || path.includes('project-jungle')) {
        initialPage = 'jungle';
    }
    
    // Ensure page is visible
    showInitialPage(initialPage);
    
    // Set up resize handler
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Prevent form submission on enter for search-like inputs
    preventDefaultFormSubmission();
}

// Mobile Navigation
function initializeMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileToggle) {
        // Create mobile toggle if it doesn't exist
        createMobileToggle();
        return;
    }
    
    mobileToggle.addEventListener('click', function() {
        navLinks.classList.toggle('open');
        
        // Update aria attributes
        const isOpen = navLinks.classList.contains('open');
        mobileToggle.setAttribute('aria-expanded', isOpen);
        mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.main-nav')) {
            navLinks.classList.remove('open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.innerHTML = '☰';
        }
    });
    
    // Close mobile menu on navigation
    navLinks.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link')) {
            navLinks.classList.remove('open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.innerHTML = '☰';
        }
    });
}

function createMobileToggle() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navContainer || !navLinks) return;
    
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.innerHTML = '☰';
    
    navContainer.appendChild(mobileToggle);
    
    // Re-initialize mobile navigation
    initializeMobileNavigation();
}

// Accessibility Features
function initializeAccessibility() {
    // Add skip navigation link
    addSkipNavigation();
    
    // Enhance keyboard navigation
    enhanceKeyboardNavigation();
    
    // Add ARIA labels where missing
    addMissingAriaLabels();
    
    // Handle reduced motion preferences
    handleReducedMotion();
}

function addSkipNavigation() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-navigation';
    skipLink.textContent = 'Skip to main content';
    
    // Add styles for skip link
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--sea-foam);
        color: var(--text-dark);
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 4px;
        transition: top 0.2s ease;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if missing
    const mainContent = document.querySelector('.content-container');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
}

function enhanceKeyboardNavigation() {
    // Make transition buttons keyboard accessible
    document.querySelectorAll('.transition-btn').forEach(btn => {
        btn.setAttribute('tabindex', '0');
        
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
    
    // Enhance CTA buttons
    document.querySelectorAll('.cta-btn').forEach(btn => {
        if (!btn.getAttribute('tabindex')) {
            btn.setAttribute('tabindex', '0');
        }
    });
}

function addMissingAriaLabels() {
    // Add aria-labels to icon buttons
    const oceanBtn = document.querySelector('.btn-ocean');
    const jungleBtn = document.querySelector('.btn-jungle');
    
    if (oceanBtn && !oceanBtn.getAttribute('aria-label')) {
        oceanBtn.setAttribute('aria-label', 'Navigate to IT Ocean section');
    }
    
    if (jungleBtn && !jungleBtn.getAttribute('aria-label')) {
        jungleBtn.setAttribute('aria-label', 'Navigate to Project Jungle section');
    }
    
    // Add aria-labels to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        if (!link.getAttribute('aria-label')) {
            const text = link.textContent.trim();
            link.setAttribute('aria-label', `Navigate to ${text} section`);
        }
    });
}

function handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function updateMotionPreference(mediaQuery) {
        if (mediaQuery.matches) {
            document.body.classList.add('reduced-motion');
            console.log('🎭 Reduced motion enabled');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }
    
    // Check initial preference
    updateMotionPreference(prefersReducedMotion);
    
    // Listen for changes
    prefersReducedMotion.addListener(updateMotionPreference);
}

// Performance Optimizations
function initializePerformanceOptimizations() {
    // Implement lazy loading for heavy elements
    implementLazyLoading();
    
    // Optimize scroll performance
    optimizeScrollPerformance();
    
    // Preload critical resources
    preloadCriticalResources();
}

function implementLazyLoading() {
    // Lazy load background images and heavy elements
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Load background images
                if (target.dataset.bgImage) {
                    target.style.backgroundImage = `url(${target.dataset.bgImage})`;
                    target.removeAttribute('data-bg-image');
                }
                
                // Trigger animations
                if (target.classList.contains('animate-on-scroll')) {
                    target.classList.add('animated');
                }
                
                // Load SVG icons
                if (target.dataset.svgSrc) {
                    loadSVGIcon(target, target.dataset.svgSrc);
                    target.removeAttribute('data-svg-src');
                }
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    // Observe elements with lazy loading attributes
    document.querySelectorAll('[data-bg-image], [data-svg-src], .animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

function loadSVGIcon(element, svgPath) {
    fetch(svgPath)
        .then(response => response.text())
        .then(svgContent => {
            element.innerHTML = svgContent;
        })
        .catch(error => {
            console.warn(`Failed to load SVG: ${svgPath}`, error);
        });
}

function optimizeScrollPerformance() {
    let ticking = false;
    
    function updateScrollPosition() {
        // Only update necessary scroll-dependent elements
        updateNavigationOpacity();
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    });
}

function updateNavigationOpacity() {
    const nav = document.querySelector('.main-nav');
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        nav.style.background = 'rgba(15, 23, 42, 0.95)';
    } else {
        nav.style.background = 'rgba(15, 23, 42, 0.9)';
    }
}

function preloadCriticalResources() {
    // Preload fonts
    const fontUrls = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];
    
    fontUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
    });
}

// Event Handlers
function handleResize() {
    const wasMobile = window.stefanSite.isMobile;
    window.stefanSite.isMobile = window.innerWidth <= 768;
    
    // Update mobile state change
    if (wasMobile !== window.stefanSite.isMobile) {
        console.log(`📱 View changed: ${window.stefanSite.isMobile ? 'Mobile' : 'Desktop'}`);
        
        // Reset navigation state
        const navLinks = document.querySelector('.nav-links');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navLinks) navLinks.classList.remove('open');
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.innerHTML = '☰';
        }
    }
    
    // Update CSS custom property for viewport height
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

function handleVisibilityChange() {
    if (document.hidden) {
        // Pause heavy animations when tab is not visible
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
    }
}

function preventDefaultFormSubmission() {
    // Prevent accidental form submissions
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.type !== 'submit') {
            // Allow enter in textareas
            if (e.target.tagName === 'TEXTAREA') return;
            
            // Prevent enter from triggering unintended actions
            const form = e.target.closest('form');
            if (form && !form.classList.contains('allow-enter-submit')) {
                e.preventDefault();
            }
        }
    });
}

// Page Utilities
function showInitialPage(page) {
    // Hide all pages first
    document.querySelectorAll('.page-content').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    
    // Show initial page
    const pageElement = document.getElementById(getPageElementId(page));
    if (pageElement) {
        pageElement.style.display = 'block';
        // Force reflow
        pageElement.offsetHeight;
        pageElement.classList.add('active');
        
        window.stefanSite.currentPage = page;
        updateBodyTheme(page);
    }
}

function getPageElementId(page) {
    const ids = {
        'strand': 'strandPage',
        'ocean': 'oceanPage', 
        'jungle': 'junglePage'
    };
    return ids[page] || 'strandPage';
}

function updateBodyTheme(page) {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('strand-theme', 'ocean-theme', 'jungle-theme');
    
    // Add new theme class
    body.classList.add(`${page}-theme`);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Enhanced Error Handling
window.addEventListener('error', function(e) {
    console.error('🚨 Website Error:', e.error);
    
    // Try to gracefully recover from common errors
    if (e.error.message.includes('transition') || e.error.message.includes('animation')) {
        console.log('🔄 Attempting to recover from animation error...');
        
        // Reset animation state
        if (window.transitionUtils && window.transitionUtils.forceComplete) {
            window.transitionUtils.forceComplete();
        }
        
        // Reset CSS classes
        document.body.classList.remove('transitioning');
    }
    
    // Send error to analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: e.error.toString(),
            fatal: false
        });
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('🚨 Unhandled Promise Rejection:', e.reason);
    
    // Prevent the default browser error page
    e.preventDefault();
    
    // Try to recover gracefully
    if (e.reason && e.reason.toString().includes('fetch')) {
        console.log('🔄 Network request failed, continuing without external resource');
    }
});

// Monitor for memory leaks in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setInterval(() => {
        if (performance.memory) {
            const used = performance.memory.usedJSHeapSize / 1048576; // Convert to MB
            if (used > 50) { // Warn if using more than 50MB
                console.warn(`⚠️ High memory usage detected: ${used.toFixed(2)}MB`);
            }
        }
    }, 30000); // Check every 30 seconds
}

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            console.log(`⚡ Page load time: ${loadTime}ms`);
            
            if (loadTime > 3000) {
                console.warn('⚠️ Slow page load detected. Consider optimizing resources.');
            }
        }, 0);
    });
}

// Expose utilities globally for other scripts
window.stefanUtils = {
    debounce,
    throttle,
    getPageElementId,
    updateBodyTheme,
    showInitialPage
};

// Development helpers (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.stefanDebug = {
        state: () => window.stefanSite,
        resetPage: (page) => showInitialPage(page),
        theme: (themeName) => updateBodyTheme(themeName),
        mobile: () => {
            window.stefanSite.isMobile = !window.stefanSite.isMobile;
            console.log(`Mobile mode: ${window.stefanSite.isMobile}`);
        }
    };
    
    console.log('🛠️ Debug tools available: window.stefanDebug');
}
