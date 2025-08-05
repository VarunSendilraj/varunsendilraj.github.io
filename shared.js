// Shared JavaScript for Varun Sendilraj's Website

// Theme Management System
class ThemeManager {
    constructor() {
        this.lastToggleTime = 0;
        this.init();
    }
    
    init() {
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        // Set up theme toggle - wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
            // Try to attach immediately
            this.attachThemeToggle();
            
            // Also try again after a short delay in case components are still rendering
            setTimeout(() => {
                this.attachThemeToggle();
            }, 200);
            
            // Fallback: Use event delegation to catch theme toggle clicks
            this.setupEventDelegation();
        });
    }
    
    attachThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle && !themeToggle.dataset.listenerAttached) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Theme toggle clicked via direct listener');
                this.toggleTheme();
            });
            themeToggle.dataset.listenerAttached = 'true';
            console.log('Theme toggle direct listener attached successfully');
        }
    }
    
    setupEventDelegation() {
        // Use event delegation to catch theme toggle clicks regardless of timing
        document.addEventListener('click', (e) => {
            const themeToggle = e.target.closest('#theme-toggle');
            if (themeToggle) {
                // Only use event delegation if no direct listener is attached
                if (!themeToggle.dataset.listenerAttached) {
                    console.log('Theme toggle clicked via event delegation');
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleTheme();
                }
            }
        });
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update moon/sun icon based on theme
        const themeIcon = document.querySelector('#theme-toggle svg path');
        if (themeIcon) {
            if (theme === 'dark') {
                // Sun icon for light mode toggle
                themeIcon.setAttribute('d', 'M12 2v2m0 16v2m10-10h-2M4 12H2m15.071-7.071l-1.414 1.414M6.343 17.657l-1.414 1.414m12.728 0L16.243 17.657M6.343 6.343L4.929 4.929');
            } else {
                // Moon icon for dark mode toggle
                themeIcon.setAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z');
            }
        }
    }
    
    toggleTheme() {
        // Add timestamp to track if this is being called multiple times rapidly
        const timestamp = Date.now();
        if (this.lastToggleTime && (timestamp - this.lastToggleTime) < 100) {
            console.warn('⚠️  Theme toggle called multiple times rapidly! Ignoring duplicate call.');
            return;
        }
        this.lastToggleTime = timestamp;
        
        console.log('🎨 Theme toggle clicked!');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        console.log(`Switching from ${currentTheme} to ${newTheme}`);
        this.setTheme(newTheme);
    }
    
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }
    
    // Method to manually re-initialize theme toggle (useful for dynamic content)
    reinitialize() {
        this.attachThemeToggle();
    }
    
    // Method to clear listener flags (for debugging)
    clearListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            delete themeToggle.dataset.listenerAttached;
            console.log('Cleared theme toggle listener flags');
        }
    }
}

// Smooth Scrolling System
// Provides buttery-smooth, eased scrolling similar to cursor effects
// Configuration options:
// - this.ease: Controls smoothness (0.05 = very smooth, 0.15 = snappy, 0.08 = balanced)
// - delta multiplier: Controls scroll sensitivity (0.5 = slow, 1.2 = fast, 0.6 = balanced)
class SmoothScroll {
    constructor() {
        this.isScrolling = false;
        this.targetY = 0;
        this.currentY = 0;
        this.ease = 0.08; // Adjust for smoother/snappier feel (0.05 = very smooth, 0.15 = snappy)
        this.enabled = false; // Will be set to true if conditions are met
        this.init();
    }
    
    init() {
        // Only initialize on desktop - mobile scrolling should remain native
        if (window.matchMedia("(hover: hover)").matches && window.innerWidth > 768) {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupSmoothScrolling();
            });
        }
    }
    
    setupSmoothScrolling() {
        this.enabled = true;
        
        // Disable default scrolling behavior on body
        document.body.style.height = '100%';
        
        // Get total scroll height
        const updateScrollHeight = () => {
            const scrollHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            return scrollHeight - window.innerHeight;
        };
        
        let maxScrollY = updateScrollHeight();
        
        // Update on window resize
        window.addEventListener('resize', () => {
            maxScrollY = updateScrollHeight();
        });
        
        // Handle wheel events
        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            // Adjust scroll speed and direction
            // Multiplier controls sensitivity: 0.5 = very slow, 1.2 = very fast
            const delta = e.deltaY * 0.6; // Smooth, controlled scrolling
            this.targetY = Math.max(0, Math.min(maxScrollY, this.targetY + delta));
            
            if (!this.isScrolling) {
                this.startScrollAnimation();
            }
        }, { passive: false });
        
        // Handle keyboard scrolling
        window.addEventListener('keydown', (e) => {
            let delta = 0;
            
            switch(e.key) {
                case 'ArrowDown':
                    delta = 100;
                    break;
                case 'ArrowUp':
                    delta = -100;
                    break;
                case 'PageDown':
                    delta = window.innerHeight * 0.8;
                    break;
                case 'PageUp':
                    delta = -window.innerHeight * 0.8;
                    break;
                case 'Home':
                    this.targetY = 0;
                    break;
                case 'End':
                    this.targetY = maxScrollY;
                    break;
                default:
                    return;
            }
            
            if (delta !== 0) {
                e.preventDefault();
                this.targetY = Math.max(0, Math.min(maxScrollY, this.targetY + delta));
                
                if (!this.isScrolling) {
                    this.startScrollAnimation();
                }
            }
        });
        
        // Initialize current position
        this.currentY = window.pageYOffset;
        this.targetY = this.currentY;
    }
    
    startScrollAnimation() {
        this.isScrolling = true;
        this.animateScroll();
    }
    
    animateScroll() {
        // Smooth interpolation
        this.currentY += (this.targetY - this.currentY) * this.ease;
        
        // Apply the scroll
        window.scrollTo(0, this.currentY);
        
        // Check if we're close enough to stop
        const diff = Math.abs(this.targetY - this.currentY);
        
        if (diff > 0.5) {
            requestAnimationFrame(() => this.animateScroll());
        } else {
            // Snap to final position and stop
            window.scrollTo(0, this.targetY);
            this.currentY = this.targetY;
            this.isScrolling = false;
        }
    }
    
    // Method to smoothly scroll to a specific element
    scrollToElement(element, offset = 0) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
            this.targetY = Math.max(0, elementTop - offset);
            
            if (!this.isScrolling) {
                this.startScrollAnimation();
            }
        }
    }
    
    // Method to disable/enable smooth scrolling
    toggle(enabled = null) {
        if (enabled === null) {
            enabled = !this.enabled;
        }
        
        this.enabled = enabled;
        
        if (!enabled) {
            // Re-enable default scrolling
            document.body.style.height = 'auto';
        } else {
            // Re-disable default scrolling
            document.body.style.height = '100%';
        }
    }
}

// Cursor Effects System
class CursorEffects {
    constructor() {
        this.init();
    }
    
    init() {
        // Only initialize on desktop with hover capability
        if (!window.matchMedia("(hover: hover)").matches) {
            return;
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            this.setupCursorElements();
            this.setupCursorTracking();
            this.setupHoverEffects();
        });
    }
    
    setupCursorElements() {
        // Create cursor elements if they don't exist
        let cursorDot = document.querySelector('.cursor-dot');
        let cursorRing = document.querySelector('.cursor-ring');
        
        if (!cursorDot) {
            cursorDot = document.createElement('div');
            cursorDot.className = 'cursor-dot';
            document.body.appendChild(cursorDot);
        }
        
        if (!cursorRing) {
            cursorRing = document.createElement('div');
            cursorRing.className = 'cursor-ring';
            document.body.appendChild(cursorRing);
        }
        
        this.cursorDot = cursorDot;
        this.cursorRing = cursorRing;
        this.mouseX = 0;
        this.mouseY = 0;
        this.ringX = 0;
        this.ringY = 0;
    }
    
    setupCursorTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            this.cursorDot.style.left = this.mouseX - 4 + 'px';
            this.cursorDot.style.top = this.mouseY - 4 + 'px';
            this.cursorDot.style.opacity = '1';
            this.cursorRing.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            this.cursorDot.style.opacity = '0';
            this.cursorRing.style.opacity = '0';
        });
        
        // Smooth ring follow
        this.animateRing();
    }
    
    animateRing() {
        this.ringX += (this.mouseX - this.ringX) * 0.1;
        this.ringY += (this.mouseY - this.ringY) * 0.1;
        
        this.cursorRing.style.left = this.ringX - 16 + 'px';
        this.cursorRing.style.top = this.ringY - 16 + 'px';
        
        requestAnimationFrame(() => this.animateRing());
    }
    
    setupHoverEffects() {
        // Enhanced hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('.nav-icon, .link-style, a[href]');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursorRing.style.transform = 'scale(1.5)';
                this.cursorDot.style.transform = 'scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursorRing.style.transform = 'scale(1)';
                this.cursorDot.style.transform = 'scale(1)';
            });
        });
    }
    
    // Method to refresh hover effects for dynamically added elements
    refreshHoverEffects() {
        this.setupHoverEffects();
    }
}

// Utility Functions
const Utils = {
    // Initialize staggered animations for elements
    initStaggeredAnimations(elements, baseDelay = 0.5, increment = 0.1) {
        elements.forEach((element, index) => {
            if (element) {
                element.style.animationDelay = `${baseDelay + (index * increment)}s`;
            }
        });
    },
    
    // Smooth scroll to element (uses custom smooth scrolling if available)
    scrollTo(elementId, offset = 0) {
        if (window.SharedJS && window.SharedJS.pageManager.smoothScroll) {
            // Use custom smooth scrolling
            const element = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
            window.SharedJS.pageManager.smoothScroll.scrollToElement(element, offset);
        } else {
            // Fallback to CSS smooth scrolling
            const element = document.getElementById(elementId);
            if (element) {
                const elementPosition = element.offsetTop - offset;
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        }
    },
    
    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Add loading state to buttons/links
    addLoadingState(element, text = 'Loading...') {
        if (element) {
            element.dataset.originalText = element.textContent;
            element.textContent = text;
            element.style.opacity = '0.6';
            element.style.pointerEvents = 'none';
        }
    },
    
    // Remove loading state
    removeLoadingState(element) {
        if (element && element.dataset.originalText) {
            element.textContent = element.dataset.originalText;
            element.style.opacity = '1';
            element.style.pointerEvents = 'auto';
            delete element.dataset.originalText;
        }
    }
};

// Page Initialization System
class PageManager {
    constructor() {
        this.themeManager = new ThemeManager();
        this.cursorEffects = new CursorEffects();
        this.smoothScroll = new SmoothScroll();
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeCommonFeatures();
        });
    }
    
    initializeCommonFeatures() {
        // Initialize any common page features
        this.setupExternalLinks();
        this.setupKeyboardNavigation();
    }
    
    setupExternalLinks() {
        // Add target="_blank" to external links
        const links = document.querySelectorAll('a[href^="http"]');
        links.forEach(link => {
            if (!link.hostname.includes('localhost') && !link.hostname.includes('127.0.0.1')) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }
    
    setupKeyboardNavigation() {
        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            // Theme toggle with 'T' key
            if (e.key.toLowerCase() === 't' && e.metaKey) {
                e.preventDefault();
                this.themeManager.toggleTheme();
            }
            
            // Navigation shortcuts
            if (e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        window.location.href = 'index.html';
                        break;
                    case '2':
                        e.preventDefault();
                        window.location.href = 'thoughts.html';
                        break;
                    case '3':
                        e.preventDefault();
                        window.location.href = 'projects.html';
                        break;
                }
            }
        });
    }
    
    // Method for pages to call when they're ready
    pageReady(pageName) {
        console.log(`${pageName} page initialized`);
        
        // Refresh cursor effects for any dynamically added content
        if (this.cursorEffects.refreshHoverEffects) {
            this.cursorEffects.refreshHoverEffects();
        }
        
        // Page-specific initialization can go here
    }
}

// Initialize the page manager
const pageManager = new PageManager();

// Export for use in other scripts
window.SharedJS = {
    ThemeManager,
    SmoothScroll,
    CursorEffects,
    Utils,
    PageManager,
    pageManager
};

// Debug helpers - can be called from browser console
window.debugTheme = function() {
    console.log('=== Theme Debug Info ===');
    console.log('Current theme:', document.documentElement.getAttribute('data-theme'));
    const themeToggle = document.getElementById('theme-toggle');
    console.log('Theme toggle element:', themeToggle);
    console.log('Has direct listener attached:', themeToggle ? themeToggle.dataset.listenerAttached : 'Element not found');
    console.log('ThemeManager:', window.SharedJS.pageManager.themeManager);
    
    // Test theme toggle
    console.log('Testing theme toggle manually...');
    window.SharedJS.pageManager.themeManager.toggleTheme();
};

window.debugScroll = function() {
    console.log('=== Smooth Scroll Debug Info ===');
    console.log('SmoothScroll enabled:', window.SharedJS.pageManager.smoothScroll ? true : false);
    console.log('Current scroll position:', window.pageYOffset);
    console.log('SmoothScroll instance:', window.SharedJS.pageManager.smoothScroll);
    
    if (window.SharedJS.pageManager.smoothScroll) {
        console.log('Target Y:', window.SharedJS.pageManager.smoothScroll.targetY);
        console.log('Current Y:', window.SharedJS.pageManager.smoothScroll.currentY);
        console.log('Is scrolling:', window.SharedJS.pageManager.smoothScroll.isScrolling);
        console.log('Ease factor:', window.SharedJS.pageManager.smoothScroll.ease);
    }
};

// Quick scroll test
window.testScroll = function() {
    console.log('Testing smooth scroll...');
    if (window.SharedJS.pageManager.smoothScroll) {
        window.SharedJS.pageManager.smoothScroll.targetY = 500;
        window.SharedJS.pageManager.smoothScroll.startScrollAnimation();
    }
};

// Theme toggle test (safe way to test without potential double-firing)
window.testThemeToggle = function() {
    console.log('Testing theme toggle manually (bypassing click events)...');
    window.SharedJS.pageManager.themeManager.toggleTheme();
};

// Clear theme listeners for debugging
window.clearThemeListeners = function() {
    console.log('Clearing theme listeners...');
    window.SharedJS.pageManager.themeManager.clearListeners();
};