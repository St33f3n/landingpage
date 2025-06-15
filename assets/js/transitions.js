// transitions.js - Animation Logic (Prototype Version)

// Animation Configuration
const ANIMATION_CONFIG = {
    ocean: {
        duration: 2000,  // 2 seconds (faster than original plan)
        easing: 'ease-out'
    },
    jungle: {
        duration: 2200,  // 2.2 seconds  
        easing: 'ease-out'
    }
};

// Animation State Management
let isTransitioning = false;
let currentPage = 'strand';

// Initialize transitions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTransitions();
    setupEventListeners();
});

function initializeTransitions() {
    // Ensure only strand content is visible initially
    showPage('strand');
    
    // Setup transition button event listeners
    const diveBtn = document.getElementById('diveInBtn');
    const exploreBtn = document.getElementById('exploreBtn');
    
    if (diveBtn) {
        diveBtn.addEventListener('click', startOceanTransition);
    }
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', startJungleTransition);
    }
    
    // Setup CTA button listeners
    setupCTAButtons();
}

function setupCTAButtons() {
    document.querySelectorAll('.ocean-cta').forEach(btn => {
        btn.addEventListener('click', startOceanTransition);
    });
    
    document.querySelectorAll('.jungle-cta').forEach(btn => {
        btn.addEventListener('click', startJungleTransition);
    });
}

function setupEventListeners() {
    // Handle browser back/forward
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            quickSwitchToPage(event.state.page);
        }
    });
}

// Main Transition Functions
function startOceanTransition() {
    if (isTransitioning) return;
    
    console.log('🌊 Starting Ocean Transition');
    isTransitioning = true;
    
    // Disable interactions
    document.body.classList.add('transitioning');
    
    // Create and start wave animation
    createWaveOverlay();
    
    // Switch content after wave animation starts
    setTimeout(() => {
        switchToPage('ocean');
    }, ANIMATION_CONFIG.ocean.duration * 0.6); // 60% through animation
    
    // Complete transition
    setTimeout(() => {
        completeTransition('ocean');
    }, ANIMATION_CONFIG.ocean.duration);
}

function startJungleTransition() {
    if (isTransitioning) return;
    
    console.log('🌿 Starting Jungle Transition');
    isTransitioning = true;
    
    // Disable interactions
    document.body.classList.add('transitioning');
    
    // Create and start palm leaves animation
    createPalmLeavesOverlay();
    
    // Switch content after animation starts
    setTimeout(() => {
        switchToPage('jungle');
    }, ANIMATION_CONFIG.jungle.duration * 0.65); // 65% through animation
    
    // Complete transition
    setTimeout(() => {
        completeTransition('jungle');
    }, ANIMATION_CONFIG.jungle.duration);
}

// Wave Overlay Creation (Ocean Transition)
function createWaveOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'wave-overlay';
    overlay.id = 'waveOverlay';
    
    // Create wave elements
    for (let i = 0; i < 3; i++) {
        const wave = document.createElement('div');
        wave.className = `wave-element wave-${i + 1}`;
        overlay.appendChild(wave);
    }
    
    // Create bubbles
    for (let i = 0; i < 8; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDelay = `${Math.random() * 2}s`;
        bubble.style.animationDuration = `${3 + Math.random() * 2}s`;
        overlay.appendChild(bubble);
    }
    
    // Add to DOM and trigger animation
    document.getElementById('animationContainer').appendChild(overlay);
    
    // Force reflow then add active class
    overlay.offsetHeight;
    overlay.classList.add('active');
}

// Palm Leaves Overlay Creation (Jungle Transition)
function createPalmLeavesOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'palm-overlay';
    overlay.id = 'palmOverlay';
    
    // Create left side leaves
    for (let i = 1; i <= 3; i++) {
        const leaf = document.createElement('div');
        leaf.className = `palm-leaf left-${i}`;
        leaf.innerHTML = createCSSPalmLeaf('left');
        overlay.appendChild(leaf);
    }
    
    // Create right side leaves
    for (let i = 1; i <= 3; i++) {
        const leaf = document.createElement('div');
        leaf.className = `palm-leaf right-${i}`;
        leaf.innerHTML = createCSSPalmLeaf('right');
        overlay.appendChild(leaf);
    }
    
    // Create jungle background reveal
    const jungleReveal = document.createElement('div');
    jungleReveal.className = 'jungle-reveal';
    overlay.appendChild(jungleReveal);
    
    // Add to DOM and trigger animation
    document.getElementById('animationContainer').appendChild(overlay);
    
    // Force reflow then add active class
    overlay.offsetHeight;
    overlay.classList.add('active');
}

// Create CSS-based palm leaf (temporary until SVG)
function createCSSPalmLeaf(side) {
    const rotation = side === 'left' ? -15 : 15;
    return `
        <div style="
            width: 100%;
            height: 100%;
            background: linear-gradient(
                ${rotation}deg,
                #059669 0%,
                #16a34a 50%,
                #065f46 100%
            );
            border-radius: 0 90% 0 90%;
            transform: rotate(${rotation}deg);
            position: relative;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        ">
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                width: 2px;
                height: 80%;
                background: #065f46;
                transform: translate(-50%, -50%);
            "></div>
        </div>
    `;
}

// Page Switching Logic
function switchToPage(targetPage) {
    console.log(`Switching to: ${targetPage}`);
    
    // Hide current page
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetElement = document.getElementById(getPageElementId(targetPage));
    if (targetElement) {
        targetElement.classList.add('active');
        
        // Update body theme class
        updateThemeClass(targetPage);
        
        // Update URL
        updateURL(targetPage);
        
        currentPage = targetPage;
    }
}

function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(p => {
        p.classList.remove('active');
    });
    
    // Show target page
    const targetElement = document.getElementById(getPageElementId(page));
    if (targetElement) {
        targetElement.classList.add('active');
        updateThemeClass(page);
        currentPage = page;
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

function updateThemeClass(page) {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('strand-theme', 'ocean-theme', 'jungle-theme');
    
    // Add new theme class
    body.classList.add(`${page}-theme`);
}

function updateURL(page) {
    const urls = {
        'strand': '/',
        'ocean': '/it-ocean',
        'jungle': '/project-jungle'
    };
    
    const title = {
        'strand': 'Stefan Simmeth - Engineering the Space Between Bits and Atoms',
        'ocean': 'IT Ocean - Stefan Simmeth',
        'jungle': 'Project Dschungel - Stefan Simmeth'
    };
    
    history.pushState(
        { page: page }, 
        title[page], 
        urls[page]
    );
}

// Transition Completion
function completeTransition(targetPage) {
    console.log(`✅ Completed transition to: ${targetPage}`);
    
    // Clean up overlay elements
    cleanupOverlays();
    
    // Re-enable interactions
    document.body.classList.remove('transitioning');
    isTransitioning = false;
    
    // Update navigation active states
    updateNavigationState(targetPage);
}

function cleanupOverlays() {
    const container = document.getElementById('animationContainer');
    if (container) {
        container.innerHTML = '';
    }
}

function updateNavigationState(activePage) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    const activeLink = document.querySelector(`.nav-link[href="#${activePage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Quick Navigation (for navbar clicks)
function quickSwitchToPage(targetPage) {
    if (isTransitioning) return;
    
    console.log(`Quick switch to: ${targetPage}`);
    
    // Instant switch without animation
    showPage(targetPage);
    updateURL(targetPage);
    updateNavigationState(targetPage);
}

// Expose functions globally for HTML onclick attributes
window.startOceanTransition = startOceanTransition;
window.startJungleTransition = startJungleTransition;
window.quickSwitchToPage = quickSwitchToPage;

// Debug functions (remove in production)
window.debugTransitions = {
    currentPage: () => currentPage,
    isTransitioning: () => isTransitioning,
    forceReset: () => {
        isTransitioning = false;
        document.body.classList.remove('transitioning');
        cleanupOverlays();
    }
};
