// Reusable Components for Varun Sendilraj's Website

// Navigation Component
class NavbarComponent {
    constructor() {
        this.pages = {
            'home': {
                name: 'home',
                url: 'index.html',
                icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9,22 9,12 15,12 15,22'
            },
            'beliefs': {
                name: 'beliefs',
                url: 'beliefs.html',
                icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14,2 14,8 20,8 M16 13H8 M16 17H8 M10,9 9,9 8,9'
            },
            'projects': {
                name: 'projects',
                url: 'projects.html',
                icon: 'M2 3h20v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V3z M8 21h8 M12 17v4'
            },
            'theme': {
                name: 'theme',
                url: null, // No URL, it's a toggle
                icon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'
            }
        };
    }
    
    // Generate the complete navigation HTML
    generateNavHTML(currentPage = null) {
        const navItems = Object.keys(this.pages).map(pageKey => {
            const page = this.pages[pageKey];
            const isActive = currentPage === pageKey;
            const isTheme = pageKey === 'theme';
            
            return `
                <div class="nav-item">
                    ${isTheme ? 
                        `<div class="nav-icon${isActive ? ' active' : ''}" id="theme-toggle">` :
                        `<a href="${page.url}" class="nav-icon${isActive ? ' active' : ''}">`
                    }
                        <svg viewBox="0 0 24 24">
                            ${this.generateSVGPaths(page.icon)}
                        </svg>
                    ${isTheme ? '</div>' : '</a>'}
                    <div class="nav-tooltip">${page.name}</div>
                </div>
            `;
        }).join('');
        
        return `
            <nav>
                ${navItems}
            </nav>
        `;
    }
    
    // Generate SVG paths from icon string
    generateSVGPaths(iconPaths) {
        // For simple single-path icons, just return a single path element
        if (!iconPaths.includes(' M')) {
            return `<path d="${iconPaths}"/>`;
        }
        
        // For complex multi-path icons, split and handle each part
        const paths = iconPaths.split(' M');
        return paths.map((path, index) => {
            if (index === 0) {
                // First path doesn't need M prefix
                return `<path d="${path}"/>`;
            } else {
                // Check if it's a polyline or path
                if (path.includes(',')) {
                    return `<polyline points="${path}"/>`;
                } else {
                    return `<path d="M${path}"/>`;
                }
            }
        }).join('');
    }
    
    // Render navigation to a specific container
    render(currentPage = null, containerId = null) {
        const navHTML = this.generateNavHTML(currentPage);
        
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = navHTML;
            }
        } else {
            // Insert before the first child of body (or append if no children)
            const nav = document.createElement('div');
            nav.innerHTML = navHTML;
            document.body.insertBefore(nav.firstElementChild, document.body.firstChild);
        }
        
        // Initialize cursor effects and theme toggle for new navigation elements
        if (window.SharedJS && window.SharedJS.pageManager) {
            setTimeout(() => {
                // Refresh cursor effects
                if (window.SharedJS.pageManager.cursorEffects) {
                    window.SharedJS.pageManager.cursorEffects.refreshHoverEffects();
                }
                
                // Attach theme toggle listener
                if (window.SharedJS.pageManager.themeManager) {
                    window.SharedJS.pageManager.themeManager.attachThemeToggle();
                }
            }, 100);
        }
    }
    
    // Auto-detect current page from URL
    getCurrentPageFromURL() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        switch(filename) {
            case 'index.html':
            case '':
                return 'home';
            case 'beliefs.html':
                return 'beliefs';
            case 'projects.html':
                return 'projects';
            default:
                return 'home';
        }
    }
    
    // Auto-render with page detection
    autoRender() {
        const currentPage = this.getCurrentPageFromURL();
        this.render(currentPage);
    }
}

// Page Header Component
class PageHeaderComponent {
    constructor() {}
    
    generate(title, subtitle = null) {
        return `
            <div class="page-header">
                <h1 class="page-title">${title}</h1>
                ${subtitle ? `<p class="page-subtitle">${subtitle}</p>` : ''}
            </div>
        `;
    }
    
    render(title, subtitle = null, containerId = 'header-container') {
        const headerHTML = this.generate(title, subtitle);
        const container = document.getElementById(containerId);
        
        if (container) {
            container.innerHTML = headerHTML;
        } else {
            // If no container specified, insert at the beginning of main content
            const mainContent = document.querySelector('.container');
            if (mainContent) {
                const headerDiv = document.createElement('div');
                headerDiv.innerHTML = headerHTML;
                mainContent.insertBefore(headerDiv.firstElementChild, mainContent.firstChild);
            }
        }
    }
}

// Connect Links Component (for homepage)
class ConnectLinksComponent {
    constructor() {
        this.links = {
            email: { url: 'mailto:varun@example.com', text: 'email' },
            twitter: { url: 'https://twitter.com/varunsendilraj', text: 'twitter' },
            linkedin: { url: 'https://linkedin.com/in/varunsendilraj', text: 'linkedin' },
            github: { url: 'https://github.com/varunsendilraj', text: 'github' },
            substack: { url: 'https://github.com/varunsendilraj', text: 'substack' },
            scholar: { url: 'https://github.com/varunsendilraj', text: 'google scholar' }
        };
    }
    
    generate(linksToShow = null) {
        const linksArray = linksToShow || Object.keys(this.links);
        
        const linkElements = linksArray.map(key => {
            const link = this.links[key];
            return `<a href="${link.url}" class="link-style">${link.text}</a>`;
        }).join('');
        
        return `
            <div class="connect">
                ${linkElements}
            </div>
        `;
    }
    
    render(linksToShow = null, containerId = 'connect-container') {
        const connectHTML = this.generate(linksToShow);
        const container = document.getElementById(containerId);
        
        if (container) {
            container.innerHTML = connectHTML;
        }
        
        return connectHTML;
    }
    
    // Update link URLs
    updateLink(key, url) {
        if (this.links[key]) {
            this.links[key].url = url;
        }
    }
}

// Component Auto-Initializer
class ComponentManager {
    constructor() {
        this.navbar = new NavbarComponent();
        this.pageHeader = new PageHeaderComponent();
        this.connectLinks = new ConnectLinksComponent();
        
        // Auto-initialize on DOM ready
        document.addEventListener('DOMContentLoaded', () => {
            this.autoInitialize();
        });
    }
    
    autoInitialize() {
        // Auto-render navbar if no nav element exists
        if (!document.querySelector('nav')) {
            this.navbar.autoRender();
        }
        
        // Initialize all systems after a short delay to ensure nav is rendered
        setTimeout(() => {
            if (window.SharedJS && window.SharedJS.pageManager) {
                // Attach theme toggle
                window.SharedJS.pageManager.themeManager.attachThemeToggle();
                
                // Initialize page
                window.SharedJS.pageManager.pageReady(this.navbar.getCurrentPageFromURL());
            }
        }, 150);
    }
    
    // Method to manually initialize components
    init(options = {}) {
        if (options.navbar !== false) {
            this.navbar.render(options.currentPage);
        }
        
        if (options.pageHeader) {
            this.pageHeader.render(options.pageHeader.title, options.pageHeader.subtitle);
        }
        
        if (options.connectLinks) {
            this.connectLinks.render(options.connectLinks.links);
        }
    }
}

// Initialize component manager
const componentManager = new ComponentManager();

// Export components for global use
window.Components = {
    NavbarComponent,
    PageHeaderComponent,
    ConnectLinksComponent,
    ComponentManager,
    componentManager
};