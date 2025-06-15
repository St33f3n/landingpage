// navigation.js - Complete Navigation Logic

// Mouse position tracking for transition buttons
let mouseX = 0;
let mouseY = 0;

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    setupMouseTracking();
    setupNavbarNavigation();
});

function initializeNavigation() {
    // Setup initial page state
    const currentPath = window.location.pathname;
    let initialPage = 'strand';
    
    if (currentPath.includes('it-ocean') || currentPath.includes('ocean')) {
        initialPage = 'ocean';
    } else if (currentPath.includes('project-jungle') || currentPath.includes('jungle')) {
        initialPage = 'jungle';
    }
    
    showPage(initialPage);
    updateNavigationState(initialPage);
    
    console.log('Navigation initialized with page:', initialPage);
}

function setupMouseTracking() {
    // Track mouse position for transition button visibility
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        updateTransitionButtonVisibility();
    });
    
    // Hide buttons when mouse leaves window
    document.addEventListener('mouseleave', function() {
        hideTransitionButtons();
    });
}

function updateTransitionButtonVisibility() {
    const controls = document.querySelector('.transition-controls');
    if (!controls) return;
    
    const windowWidth = window.innerWidth;
    const leftZone = windowWidth * 0.15; // Left 15% of screen
    const rightZone = windowWidth * 0.85; // Right 15% of screen
    
    // Reset classes
    controls.classList.remove('mouse-left', 'mouse-right');
    
    if (mouseX <= leftZone) {
        controls.classList.add('mouse-left');
    } else if (mouseX >= rightZone) {
        controls.classList.add('mouse-right');
    }
}

function hideTransitionButtons() {
    const controls = document.querySelector('.transition-controls');
    if (controls) {
        controls.classList.remove('mouse-left', 'mouse-right');
    }
}

function setupNavbarNavigation() {
    // Add click handlers to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            let targetPage = 'strand';
            
            if (href.includes('ocean')) {
                targetPage = 'ocean';
            } else if (href.includes('jungle')) {
                targetPage = 'jungle';
            } else if (href.includes('strand')) {
                targetPage = 'strand';
            }
            
            console.log('Navbar navigation to:', targetPage);
            quickSwitchToPage(targetPage);
        });
    });
}

function quickSwitchToPage(targetPage) {
    if (isTransitioning) {
        console.log('Transition in progress, ignoring navigation');
        return;
    }
    
    console.log(`Quick switch to: ${targetPage}`);
    
    // Add CSS files if not already loaded
    ensurePageStyles(targetPage);
    
    // Instant switch without animation
    showPage(targetPage);
    updateURL(targetPage);
    updateNavigationState(targetPage);
    updateThemeClass(targetPage);
    
    // Add any page-specific elements
    addPageSpecificElements(targetPage);
}

function ensurePageStyles(page) {
    const existingLinks = document.querySelectorAll('link[rel="stylesheet"]');
    const loadedStyles = Array.from(existingLinks).map(link => 
        link.getAttribute('href')
    );
    
    const requiredStyles = {
        'ocean': 'assets/css/ocean.css',
        'jungle': 'assets/css/jungle.css',
        'strand': 'assets/css/strand.css'
    };
    
    if (requiredStyles[page] && !loadedStyles.includes(requiredStyles[page])) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = requiredStyles[page];
        document.head.appendChild(link);
        console.log(`Loaded styles for ${page}`);
    }
}

function addPageSpecificElements(page) {
    // Remove existing page-specific elements
    removePageSpecificElements();
    
    if (page === 'ocean') {
        addOceanElements();
    } else if (page === 'jungle') {
        addJungleElements();
    }
}

function removePageSpecificElements() {
    // Remove ocean-specific elements
    const oceanWaves = document.querySelector('.ocean-waves');
    const oceanParticles = document.querySelector('.ocean-particles');
    
    if (oceanWaves) oceanWaves.remove();
    if (oceanParticles) oceanParticles.remove();
    
    // Remove jungle-specific elements
    const jungleVines = document.querySelector('.jungle-vines');
    const jungleParticles = document.querySelector('.jungle-particles');
    
    if (jungleVines) jungleVines.remove();
    if (jungleParticles) jungleParticles.remove();
}

function addOceanElements() {
    // Add ocean waves at top
    const oceanWaves = document.createElement('div');
    oceanWaves.className = 'ocean-waves';
    
    for (let i = 1; i <= 3; i++) {
        const wave = document.createElement('div');
        wave.className = `ocean-wave`;
        oceanWaves.appendChild(wave);
    }
    
    document.body.appendChild(oceanWaves);
    
    // Add floating particles
    const oceanParticles = document.createElement('div');
    oceanParticles.className = 'ocean-particles';
    
    // Create particles periodically
    setInterval(() => {
        if (currentPage === 'ocean' && document.querySelectorAll('.particle').length < 10) {
            createOceanParticle(oceanParticles);
        }
    }, 3000);
    
    document.body.appendChild(oceanParticles);
}

function createOceanParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 6 + 2; // 2-8px
    const left = Math.random() * 100; // 0-100%
    const duration = Math.random() * 10 + 10; // 10-20s
    
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = left + '%';
    particle.style.animationDuration = duration + 's';
    
    container.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, duration * 1000);
}

function addJungleElements() {
    // Add jungle vines
    const jungleVines = document.createElement('div');
    jungleVines.className = 'jungle-vines';
    
    for (let i = 1; i <= 4; i++) {
        const vine = document.createElement('div');
        vine.className = 'vine';
        vine.style.setProperty('--vine-height', (Math.random() * 100 + 100) + 'px');
        jungleVines.appendChild(vine);
    }
    
    document.body.appendChild(jungleVines);
    
    // Add falling leaves
    const jungleParticles = document.createElement('div');
    jungleParticles.className = 'jungle-particles';
    
    // Create leaves periodically
    setInterval(() => {
        if (currentPage === 'jungle' && document.querySelectorAll('.leaf-particle').length < 8) {
            createLeafParticle(jungleParticles);
        }
    }, 4000);
    
    document.body.appendChild(jungleParticles);
}

function createLeafParticle(container) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf-particle';
    
    // Random properties
    const left = Math.random() * 100; // 0-100%
    const duration = Math.random() * 5 + 8; // 8-13s
    const delay = Math.random() * 2; // 0-2s delay
    
    leaf.style.left = left + '%';
    leaf.style.animationDuration = duration + 's';
    leaf.style.animationDelay = delay + 's';
    
    container.appendChild(leaf);
    
    // Remove after animation
    setTimeout(() => {
        if (leaf.parentNode) {
            leaf.remove();
        }
    }, (duration + delay) * 1000);
}

function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    
    // Show target page
    const targetElement = document.getElementById(getPageElementId(page));
    if (targetElement) {
        targetElement.style.display = 'block';
        // Force reflow
        targetElement.offsetHeight;
        targetElement.classList.add('active');
        currentPage = page;
        
        console.log(`Showing page: ${page}`);
    } else {
        console.error(`Page element not found for: ${page}`);
    }
}

function updateNavigationState(activePage) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate the correct nav link
    const navMappings = {
        'strand': ['#strand', '#home', '/'],
        'ocean': ['#ocean', '#it-ocean'],
        'jungle': ['#jungle', '#project-jungle']
    };
    
    const possibleHrefs = navMappings[activePage] || [];
    
    for (const href of possibleHrefs) {
        const link = document.querySelector(`.nav-link[href="${href}"]`);
        if (link) {
            link.classList.add('active');
            break;
        }
    }
    
    console.log(`Updated navigation state for: ${activePage}`);
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    console.log('Popstate event:', event.state);
    
    if (event.state && event.state.page) {
        quickSwitchToPage(event.state.page);
    } else {
        // Determine page from URL
        const path = window.location.pathname;
        let page = 'strand';
        
        if (path.includes('ocean')) {
            page = 'ocean';
        } else if (path.includes('jungle')) {
            page = 'jungle';
        }
        
        quickSwitchToPage(page);
    }
});

// Handle direct URL access
window.addEventListener('load', function() {
    // Re-initialize based on current URL
    const path = window.location.pathname;
    let page = 'strand';
    
    if (path.includes('ocean')) {
        page = 'ocean';
    } else if (path.includes('jungle')) {
        page = 'jungle';
    }
    
    if (page !== 'strand') {
        quickSwitchToPage(page);
    }
});

// Expose functions globally
window.quickSwitchToPage = quickSwitchToPage;
window.updateNavigationState = updateNavigationState;
