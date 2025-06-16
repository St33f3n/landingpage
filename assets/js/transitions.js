// transitions.js - Cleaned Animation Logic

// Animation Configuration
const ANIMATION_CONFIG = {
    ocean: {
        duration: 3000,  // 3 seconds
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth ease
        bubbleCount: {
            desktop: 8,
            mobile: 4
        }
    },
    jungle: {
        duration: 2200,  // 2.2 seconds  
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bounce ease
        leafCount: {
            desktop: 3,
            mobile: 2
        }
    }
};

// Animation State (shared with navigation.js)
let isTransitioning = false;
let currentPage = 'strand';
let transitionsInitialized = false;

// Initialize transitions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (transitionsInitialized) return;
    
    console.log('🎬 Initializing Transition System...');
    
    initializeTransitionSystem();
    setupAnimationContainer();
    
    transitionsInitialized = true;
    console.log('✅ Transition system ready');
});

function initializeTransitionSystem() {
    // Sync with global state if available
    if (window.stefanSite) {
        currentPage = window.stefanSite.currentPage || 'strand';
        
        // Share transition state
        Object.defineProperty(window.stefanSite, 'isTransitioning', {
            get: () => isTransitioning,
            set: (value) => { isTransitioning = value; }
        });
    }
    
    // Set up animation cleanup on page unload
    window.addEventListener('beforeunload', cleanupAllAnimations);
}

function setupAnimationContainer() {
    // Create animation container if it doesn't exist
    let container = document.getElementById('animationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'animationContainer';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(container);
    }
}

// Main Transition Functions
function startOceanTransition() {
    if (isTransitioning) {
        console.log('🚫 Ocean transition blocked - already transitioning');
        return;
    }
    
    console.log('🌊 Starting Ocean Transition');
    isTransitioning = true;
    
    // Disable interactions
    document.body.classList.add('transitioning');
    
    // Create and start wave animation
    createWaveOverlay();
    
    // Schedule content switch during animation
    setTimeout(() => {
        switchToPage('ocean');
    }, ANIMATION_CONFIG.ocean.duration * 0.7);
    
    // Complete transition
    setTimeout(() => {
        completeTransition('ocean');
    }, ANIMATION_CONFIG.ocean.duration * 0.9);
}

function startJungleTransition() {
    if (isTransitioning) {
        console.log('🚫 Jungle transition blocked - already transitioning');
        return;
    }
    
    console.log('🌿 Starting Jungle Transition');
    isTransitioning = true;
    
    // Disable interactions
    document.body.classList.add('transitioning');
    
    // Create and start palm leaves animation
    createPalmLeavesOverlay();
    
    // Schedule content switch during animation
    setTimeout(() => {
        switchToPage('jungle');
    }, ANIMATION_CONFIG.jungle.duration * 0.65);
    
    // Complete transition
    setTimeout(() => {
        completeTransition('jungle');
    }, ANIMATION_CONFIG.jungle.duration);
}

// Animation Creation Functions
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
    
    // Create bubbles with performance optimization
    const bubbleCount = window.innerWidth <= 768 ? 
        ANIMATION_CONFIG.ocean.bubbleCount.mobile : 
        ANIMATION_CONFIG.ocean.bubbleCount.desktop;
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.setProperty('--drift', `${(Math.random() - 0.5) * 100}px`);
        bubble.style.animationDelay = `${Math.random() * 2}s`;
        bubble.style.animationDuration = `${3 + Math.random() * 2}s`;
        bubble.style.animationTimingFunction = ANIMATION_CONFIG.ocean.easing;
        
        // Random bubble size with better variety
        const size = 3 + Math.random() * 10;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Add some opacity variation
        bubble.style.opacity = 0.6 + Math.random() * 0.4;
        
        overlay.appendChild(bubble);
    }
    
    // Add to DOM and trigger animation
    const container = document.getElementById('animationContainer');
    container.appendChild(overlay);
    
    // Force reflow then add active class for smooth animation start
    overlay.offsetHeight;
    overlay.classList.add('active');
}

function createPalmLeavesOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'palm-overlay';
    overlay.id = 'palmOverlay';
    
    // Reduce complexity on mobile for better performance
    const leafCount = window.innerWidth <= 768 ? 
        ANIMATION_CONFIG.jungle.leafCount.mobile : 
        ANIMATION_CONFIG.jungle.leafCount.desktop;
    
    // Create left side leaves
    for (let i = 1; i <= leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.className = `palm-leaf left-${i}`;
        leaf.style.animationTimingFunction = ANIMATION_CONFIG.jungle.easing;
        leaf.innerHTML = createOptimizedPalmLeaf('left', i);
        overlay.appendChild(leaf);
    }
    
    // Create right side leaves
    for (let i = 1; i <= leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.className = `palm-leaf right-${i}`;
        leaf.style.animationTimingFunction = ANIMATION_CONFIG.jungle.easing;
        leaf.innerHTML = createOptimizedPalmLeaf('right', i);
        overlay.appendChild(leaf);
    }
    
    // Create jungle background reveal
    const jungleReveal = document.createElement('div');
    jungleReveal.className = 'jungle-reveal';
    overlay.appendChild(jungleReveal);
    
    // Add to DOM and trigger animation
    const container = document.getElementById('animationContainer');
    container.appendChild(overlay);
    
    // Force reflow then add active class
    overlay.offsetHeight;
    overlay.classList.add('active');
}

function createOptimizedPalmLeaf(side, index) {
    const baseRotation = side === 'left' ? -15 : 15;
    const variation = (index - 2) * 5; // Add variety between leaves
    const rotation = baseRotation + variation;
    
    // Use SVG for crisp, scalable palm leaves
    return `
        <svg viewBox="0 0 200 300" style="
            width: 100%;
            height: 100%;
            transform: rotate(${rotation}deg) translateZ(0);
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
            will-change: transform;
        ">
            <!-- Main leaf shape -->
            <path d="M100 10 
                     C120 30, 140 60, 150 100
                     C155 140, 150 180, 140 220
                     C130 250, 110 270, 100 290
                     C90 270, 70 250, 60 220
                     C50 180, 45 140, 50 100
                     C60 60, 80 30, 100 10 Z" 
                  fill="url(#leafGradient${side}${index})" 
                  stroke="#065f46" 
                  stroke-width="2"/>
            
            <!-- Central vein -->
            <path d="M100 15 L100 285" 
                  stroke="#065f46" 
                  stroke-width="3" 
                  fill="none"/>
            
            <!-- Side veins -->
            <path d="M100 50 L80 70 M100 50 L120 70
                     M100 80 L75 100 M100 80 L125 100
                     M100 120 L70 140 M100 120 L130 140
                     M100 160 L75 180 M100 160 L125 180
                     M100 200 L80 220 M100 200 L120 220" 
                  stroke="#059669" 
                  stroke-width="1.5" 
                  fill="none" 
                  opacity="0.7"/>
            
            <!-- Gradient definition -->
            <defs>
                <linearGradient id="leafGradient${side}${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#16a34a;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#059669;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#065f46;stop-opacity:1" />
                </linearGradient>
            </defs>
        </svg>
    `;
}

// Page Switching (uses navigation.js functions when available)
function switchToPage(targetPage) {
    console.log(`🔄 Switching content to: ${targetPage}`);
    
    // Use navigation.js function if available, otherwise fallback
    if (window.navigationUtils && window.navigationUtils.showPage) {
        window.navigationUtils.showPage(targetPage);
        window.navigationUtils.updateThemeClass(targetPage);
    } else {
        // Fallback implementation
        fallbackShowPage(targetPage);
    }
    
    // Update URL without pushing to history (since this is mid-transition)
    updateURLSilently(targetPage);
    
    currentPage = targetPage;
    
    // Update global state
    if (window.stefanSite) {
        window.stefanSite.currentPage = targetPage;
    }
}

function fallbackShowPage(page) {
    // Fallback if navigation.js not available
    document.querySelectorAll('.page-content').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    
    const targetElement = document.getElementById(getPageElementId(page));
    if (targetElement) {
        targetElement.style.display = 'block';
        targetElement.offsetHeight; // Force reflow
        targetElement.classList.add('active');
        
        // Update theme
        document.body.classList.remove('strand-theme', 'ocean-theme', 'jungle-theme');
        document.body.classList.add(`${page}-theme`);
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

function updateURLSilently(page) {
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
    
    document.title = title;
    history.replaceState({ page: page }, title, url);
}

// Transition Completion
function completeTransition(targetPage) {
    console.log(`✅ Completing transition to: ${targetPage}`);
    
    // Clean up overlays
    cleanupOverlays();
    
    // Re-enable interactions
    document.body.classList.remove('transitioning');
    isTransitioning = false;
    
    // Update navigation state using navigation.js if available
    if (window.navigationUtils && window.navigationUtils.updateNavigationState) {
        window.navigationUtils.updateNavigationState(targetPage);
    }
    
    // Push final state to history
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
    
    history.pushState(
        { page: targetPage }, 
        titles[targetPage], 
        urls[targetPage]
    );
    
    console.log(`🎯 Transition to ${targetPage} completed successfully`);
}

function cleanupOverlays() {
    const container = document.getElementById('animationContainer');
    if (container) {
        // Fade out existing overlays before removing
        const overlays = container.querySelectorAll('.wave-overlay, .palm-overlay');
        
        overlays.forEach(overlay => {
            overlay.style.transition = 'opacity 0.3s ease';
            overlay.style.opacity = '0';
        });
        
        // Remove after fade
        setTimeout(() => {
            if (container) {
                container.innerHTML = '';
            }
        }, 300);
    }
}

function cleanupAllAnimations() {
    // Emergency cleanup for page unload
    const container = document.getElementById('animationContainer');
    if (container) {
        container.innerHTML = '';
    }
    
    document.body.classList.remove('transitioning');
    isTransitioning = false;
}

// Quick Navigation (for navbar - no animations)
function quickSwitchToPage(targetPage) {
    if (isTransitioning) {
        console.log('🚫 Quick switch blocked - transition in progress');
        return;
    }
    
    console.log(`⚡ Quick switch to: ${targetPage}`);
    
    // Use navigation.js for instant switching
    if (window.navigationUtils && window.navigationUtils.directNavigateTo) {
        window.navigationUtils.directNavigateTo(targetPage);
    } else {
        // Fallback
        fallbackQuickSwitch(targetPage);
    }
    
    currentPage = targetPage;
    
    if (window.stefanSite) {
        window.stefanSite.currentPage = targetPage;
    }
}

function fallbackQuickSwitch(targetPage) {
    fallbackShowPage(targetPage);
    updateURLSilently(targetPage);
    
    // Try to update navigation state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.nav-link[href="#${targetPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Performance monitoring for animations
function monitorAnimationPerformance() {
    if (!window.performance) return;
    
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
            if (entry.duration > 16.67) { // More than one frame at 60fps
                console.warn(`⚠️ Long animation frame detected: ${entry.duration}ms`);
            }
        });
    });
    
    observer.observe({ entryTypes: ['measure'] });
}

// Reduced motion support
function respectsReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Expose transition functions globally
window.startOceanTransition = startOceanTransition;
window.startJungleTransition = startJungleTransition;
window.quickSwitchToPage = quickSwitchToPage;

// Expose utilities for other scripts
window.transitionUtils = {
    isTransitioning: () => isTransitioning,
    currentPage: () => currentPage,
    forceComplete: () => {
        cleanupAllAnimations();
        console.log('🛠️ Forced animation cleanup');
    },
    respectsReducedMotion
};

// Initialize performance monitoring in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    monitorAnimationPerformance();
    
    // Debug helpers
    window.transitionDebug = {
        triggerOcean: startOceanTransition,
        triggerJungle: startJungleTransition,
        cleanup: cleanupAllAnimations,
        state: () => ({ isTransitioning, currentPage })
    };
    
    console.log('🛠️ Transition debug tools available: window.transitionDebug');
}

// Handle reduced motion preferences
if (respectsReducedMotion()) {
    console.log('♿ Reduced motion preference detected - animations will be simplified');
    
    // Override animation durations
    ANIMATION_CONFIG.ocean.duration = 300;
    ANIMATION_CONFIG.jungle.duration = 300;
}
