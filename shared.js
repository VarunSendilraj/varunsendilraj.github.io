(function () {
    function setTheme(theme) {
        const root = document.documentElement;
        const nextTheme = theme === 'dark' ? 'dark' : 'light';

        root.setAttribute('data-theme', nextTheme);
        root.style.colorScheme = nextTheme;
        localStorage.setItem('theme', nextTheme);
    }

    function getTheme() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'dark' ? 'dark' : 'light';
    }

    function updateToggleLabel() {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) return;
        toggle.textContent = getTheme() === 'dark' ? 'light' : 'dark';
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.requestAnimationFrame(() => {
            document.documentElement.classList.remove('page-loading');
        });

        updateToggleLabel();

        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                setTheme(getTheme() === 'dark' ? 'light' : 'dark');
                updateToggleLabel();
            });
        }

        document.querySelectorAll('a[href^="http"]').forEach((link) => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });

        document.querySelectorAll('a[href]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (reducedMotion || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                    return;
                }

                if (link.target || link.hasAttribute('download')) {
                    return;
                }

                const url = new URL(link.href, window.location.href);
                const sameOrigin = url.origin === window.location.origin;
                const samePageHash = url.pathname === window.location.pathname && url.hash;

                if (!sameOrigin || samePageHash || url.protocol === 'mailto:') {
                    return;
                }

                event.preventDefault();
                document.documentElement.classList.add('page-leaving');
                window.setTimeout(() => {
                    window.location.href = url.href;
                }, 140);
            });
        });

        const path = window.location.pathname;
        document.querySelectorAll('.site-nav a').forEach((link) => {
            const href = link.getAttribute('href');
            if (!href) return;
            const isHome = href === '/' || href === '/index.html' || href === 'index.html';
            const onHome = path === '/' || path.endsWith('/index.html') || path.endsWith('/');
            const onBlog = path.includes('/blog');
            if ((isHome && onHome && !onBlog) || (href.includes('blog') && onBlog)) {
                link.classList.add('active');
            }
        });
    });
})();
