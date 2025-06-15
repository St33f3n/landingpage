// navigation.js - Fixed Navigation Logic

// Navigation State
let mouseX = 0;
let mouseY = 0;
let navigationInitialized = false;

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (navigationInitialized) return;
    
    console.log('🧭 Initializing Navigation System...');
    
    initializeNavigation();
    setupMouseTracking();
    setupNavigationLinks();
    setupTransitionButtons();
    
    navigationInitialized = true;
    console.log('✅ Navigation system ready');
});

function initializeNavigation() {
    // Fix navigation href attributes to match actual page IDs
    fixNavigationLinks();
    
    // Set initial page state based on URL
    const currentPath = window.location.pathname;
    let initialPage = determinePageFromPath(currentPath);
    
    // Update URL if necessary
    updateURL(initialPage, false); // false = don't push to history
    
    // Set initial navigation state
    updateNavigationState(initialPage);
    
    console.log(`Navigation initialized with page: ${initialPage}`);
}

function fixNavigationLinks() {
    // Map old href values to correct ones
    const linkMappings = {
        '#strand': 'strand',
        '#ocean': 'ocean', 
        '#jungle': 'jungle',
        '#': 'strand'
    };
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (linkMappings[href]) {
            // Update href to be more semantic
            link.setAttribute('href', `#${linkMappings[href]}`);
            link.setAttribute('data-page', linkMappings[href]);
        }
    });
}

function determinePageFromPath(path) {
    if (path.includes('ocean') || path.includes('it-ocean')) {
        return 'ocean';
    } else if (path.includes('jungle') || path.includes('project-jungle')) {
        return 'jungle';
    }
    return 'strand';
}

function setupMouseTracking() {
    // Only setup mouse tracking on desktop
    if (window.innerWidth <= 768) return;
    
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
    
    // Show/hide based on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            showMobileTransitionButtons();
        } else {
            updateTransitionButtonVisibility();
        }
    });
}

function updateTransitionButtonVisibility() {
    const controls = document.querySelector('.transition-controls');
    if (!controls || window.innerWidth <= 768) return;
    
    const windowWidth = window.innerWidth;
    const leftZone = windowWidth * 0.15; // Left 15% of screen
    const rightZone = windowWidth * 0.85; // Right 15% of screen
    
    // Reset classes
    controls.classList.remove('mouse-left', 'mouse-right');
    controls.style.opacity = '0';
    
    if (mouseX <= leftZone) {
        controls.classList.add('mouse-left');
        controls.style.opacity = '1';
    } else if (mouseX >= rightZone) {
        controls.classList.add('mouse-right');
        controls.style.opacity = '1';
    }
}

function hideTransitionButtons() {
    const controls = document.querySelector('.transition-controls');
    if (controls && window.innerWidth > 768) {
        controls.classList.remove('mouse-left', 'mouse-right');
        controls.style.opacity = '0';
    }
}

function showMobileTransitionButtons() {
    const controls = document.querySelector('.transition-controls');
    if (controls) {
        controls.style.opacity = '1';
        controls.classList.remove('mouse-left', 'mouse-right');
    }
}

function setupNavigationLinks() {
    // Setup navbar navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        // Remove any existing event listeners by cloning
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page') || 
                              this.getAttribute('href').replace('#', '') || 
                              'strand';
            
            console.log(`🔗 Navbar navigation to: ${targetPage}`);
            
            // Use global navigation function
            if (window.quickSwitchToPage) {
                window.quickSwitchToPage(targetPage);
            } else {
                // Fallback if transitions.js not loaded
                directNavigateTo(targetPage);
            }
        });
    });
}

function setupTransitionButtons() {
    // Setup transition buttons (these trigger animations)
    const diveBtn = document.getElementById('diveInBtn');
    const exploreBtn = document.getElementById('exploreBtn');
    
    if (diveBtn) {
        // Remove existing listeners
        const newDiveBtn = diveBtn.cloneNode(true);
        diveBtn.parentNode.replaceChild(newDiveBtn, diveBtn);
        
        newDiveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🌊 Dive In button clicked');
            
            if (window.startOceanTransition) {
                window.startOceanTransition();
            } else {
                directNavigateTo('ocean');
            }
        });
    }
    
    if (exploreBtn) {
        // Remove existing listeners
        const newExploreBtn = exploreBtn.cloneNode(true);
        exploreBtn.parentNode.replaceChild(newExploreBtn, exploreBtn);
        
        newExploreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🌿 Explore button clicked');
            
            if (window.startJungleTransition) {
                window.startJungleTransition();
            } else {
                directNavigateTo('jungle');
            }
        });
    }
    
    // Setup CTA buttons
    document.querySelectorAll('.ocean-cta').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.startOceanTransition) {
                window.startOceanTransition();
            } else {
                directNavigateTo('ocean');
            }
        });
    });
    
    document.querySelectorAll('.jungle-cta').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.startJungleTransition) {
                window.startJungleTransition();
            } else {
                directNavigateTo('jungle');
            }
        });
    });
}

// Direct navigation without animations (fallback)
function directNavigateTo(targetPage) {
    if (window.stefanSite && window.stefanSite.isTransitioning) {
        console.log('Transition in progress, ignoring navigation');
        return;
    }
    
    console.log(`Direct navigation to: ${targetPage}`);
    
    // Show target page
    showPage(targetPage);
    
    // Update URL and navigation state
    updateURL(targetPage);
    updateNavigationState(targetPage);
    updateThemeClass(targetPage);
    
    // Update global state if available
    if (window.stefanSite) {
        window.stefanSite.currentPage = targetPage;
    }
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
        
        console.log(`Page switched to: ${page}`);
        return true;
    } else {
        console.error(`Page element not found for: ${page}`);
        return false;
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

function updateNavigationState(activePage) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    const activeLink = document.querySelector(`.nav-link[data-page="${activePage}"]`) ||
                      document.querySelector(`.nav-link[href="#${activePage}"]`);
    
    if (activeLink) {
        activeLink.classList.add('active');
        console.log(`Navigation state updated for: ${activePage}`);
    } else {
        console.warn(`No navigation link found for page: ${activePage}`);
    }
}

function updateThemeClass(page) {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('strand-theme', 'ocean-theme', 'jungle-theme');
    
    // Add new theme class
    body.classList.add(`${page}-theme`);
    
    console.log(`Theme updated to: ${page}-theme`);
}

function updateURL(page, pushState = true) {
    const urls = {
        'strand': '/',
        'ocean': '/it-ocean',
        'jungle': '/project-jungle'
    };
    
    const titles = {
        'strand': 'Stefan Simmeth - Engineering the Space Between Bits and Atoms',
        'ocean': 'IT Ocean - Stefan Simmeth Professional Portfolio', 
        'jungle': 'Project Dschungel - Stefan Simmeth Labs & Experiments'
    };
    
    const url = urls[page] || '/';
    const title = titles[page] || titles['strand'];
    
    // Update document title
    document.title = title;
    
    if (pushState) {
        // Only push to history if not initial load
        history.pushState({ page: page }, title, url);
    } else {
        // Replace current state (for initial load)
        history.replaceState({ page: page }, title, url);
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    console.log('🔄 Browser navigation detected:', event.state);
    
    let targetPage = 'strand';
    
    if (event.state && event.state.page) {
        targetPage = event.state.page;
    } else {
        // Fallback: determine from URL
        targetPage = determinePageFromPath(window.location.pathname);
    }
    
    // Use direct navigation for browser navigation
    directNavigateTo(targetPage);
});

// Handle page load with specific URL
window.addEventListener('load', function() {
    const path = window.location.pathname;
    const page = determinePageFromPath(path);
    
    if (page !== 'strand') {
        console.log(`🔗 Direct URL access to: ${page}`);
        directNavigateTo(page);
    }
});

// Expose navigation functions globally
window.navigationUtils = {
    directNavigateTo,
    updateNavigationState,
    updateThemeClass,
    showPage,
    getPageElementId,
    determinePageFromPath
};

// Initialize mobile navigation on resize
window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        showMobileTransitionButtons();
    } else {
        setupMouseTracking();
    }
});

// Initial mobile check
if (window.innerWidth <= 768) {
    document.addEventListener('DOMContentLoaded', function() {
        showMobileTransitionButtons();
    });
}
