// Theme utilities shared across pages (page-specific scripts can import these)
// Exports: setTheme(theme), initTheme(), updateActiveTheme(theme)

export function setTheme(theme) {
    try {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        const themeButtons = document.querySelectorAll('.theme-btn');
        if (themeButtons && themeButtons.length) {
            themeButtons.forEach(btn =>
                btn.classList.toggle('active', btn.dataset.theme === theme)
            );
        }

        updateFogColor(theme);

        const header = document.querySelector('header');
        if (header) {
            header.style.transition = 'all 0.3s ease';
        }

        const dynamicText = document.getElementById('dynamicText');
        if (dynamicText) {
            dynamicText.style.transition = 'color 0.3s ease';
        }
    } catch (e) {
        console.warn('[theme] setTheme error', e);
    }
}

function updateFogColor(theme) {
    try {
        const fogElements = document.querySelectorAll('.fog');
        if (!fogElements) return;
        fogElements.forEach(fog => {
            fog.style.background = `linear-gradient(90deg, \
            rgba(0, 255, 255, 0) 0%,\n            var(--fog-color) 50%,\n            rgba(0, 255, 255, 0) 100%)`;
        });
    } catch (e) {
        console.warn('[theme] updateFogColor error', e);
    }
}

export function updateActiveTheme(theme) {
    const themeButtons = document.querySelectorAll('.theme-btn');
    if (!themeButtons) return;
    themeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme));
}

export function setViewMode(mode) {
    try {
        document.body.setAttribute('data-view-mode', mode);
        localStorage.setItem('viewMode', mode);

        const viewModeButtons = document.querySelectorAll('.view-mode-btn');
        if (viewModeButtons && viewModeButtons.length) {
            viewModeButtons.forEach(btn =>
                btn.classList.toggle('active', btn.dataset.view === mode)
            );
        }

        // Apply view mode to grid if it exists
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.classList.remove('grid-view', 'list-view');
            productsGrid.classList.add(mode === 'list' ? 'list-view' : 'grid-view');
        }
    } catch (e) {
        console.warn('[theme] setViewMode error', e);
    }
}

export function updateActiveViewMode(mode) {
    const viewModeButtons = document.querySelectorAll('.view-mode-btn');
    if (!viewModeButtons) return;
    viewModeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.view === mode));
}

export function initTheme() {
    // Attach click handlers to theme buttons when present and apply initial theme
    const themeButtons = document.querySelectorAll('.theme-btn');
    if (themeButtons && themeButtons.length) {
        themeButtons.forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));
    }
    // Apply stored theme or default
    setTheme(localStorage.getItem('theme') || 'dark');

    // Attach click handlers to view mode buttons
    const viewModeButtons = document.querySelectorAll('.view-mode-btn');
    if (viewModeButtons && viewModeButtons.length) {
        viewModeButtons.forEach(btn => btn.addEventListener('click', () => setViewMode(btn.dataset.view)));
    }
    // Apply stored view mode or default to grid
    setViewMode(localStorage.getItem('viewMode') || 'grid');

    // Attach click handlers to language buttons
    const languageButtons = document.querySelectorAll('.language-btn');
    if (languageButtons && languageButtons.length) {
        languageButtons.forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.language)));
    }
    // Apply stored language or default to Urdu
    setLanguage(localStorage.getItem('language') || 'ur');
}

export function setLanguage(lang) {
    try {
        document.documentElement.lang = lang;
        document.body.setAttribute('data-language', lang);
        localStorage.setItem('language', lang);

        const languageButtons = document.querySelectorAll('.language-btn');
        if (languageButtons && languageButtons.length) {
            languageButtons.forEach(btn =>
                btn.classList.toggle('active', btn.dataset.language === lang)
            );
        }

        // Apply text direction for RTL languages
        if (lang === 'ur') {
            document.documentElement.dir = 'rtl';
            document.body.style.direction = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
            document.body.style.direction = 'ltr';
        }

        // Dispatch custom event for language change
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    } catch (e) {
        console.warn('[theme] setLanguage error', e);
    }
}

export function updateActiveLanguage(lang) {
    const languageButtons = document.querySelectorAll('.language-btn');
    if (!languageButtons) return;
    languageButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.language === lang));
}
