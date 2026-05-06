// Theme management module
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
};

export function initTheme() {
    try {
        const savedTheme = localStorage.getItem('theme') || THEMES.AUTO;
        setTheme(savedTheme);
    } catch (error) {
        console.warn('[theme] initTheme error:', error);
    }
}

export function setTheme(theme) {
    try {
        localStorage.setItem('theme', theme);
        if (theme === THEMES.AUTO) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.setAttribute('data-theme', prefersDark ? THEMES.DARK : THEMES.LIGHT);
        } else {
            document.body.setAttribute('data-theme', theme);
        }
        updateActiveTheme(theme);
    } catch (error) {
        console.warn('[theme] setTheme error:', error);
    }
}

export function updateActiveTheme(theme) {
    try {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-theme') === theme) {
                btn.classList.add('active');
            }
        });
    } catch (error) {
        console.warn('[theme] updateActiveTheme error:', error);
    }
}

export function setViewMode(mode) {
    try {
        localStorage.setItem('viewMode', mode);
        document.body.setAttribute('data-view-mode', mode);
    } catch (error) {
        console.warn('[theme] setViewMode error:', error);
    }
}

export function updateActiveViewMode(mode) {
    try {
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-view-mode') === mode) {
                btn.classList.add('active');
            }
        });
    } catch (error) {
        console.warn('[theme] updateActiveViewMode error:', error);
    }
}

export function setLanguage(lang) {
    try {
        localStorage.setItem('language', lang);
        document.documentElement.setAttribute('lang', lang);
    } catch (error) {
        console.warn('[theme] setLanguage error:', error);
    }
}

export function updateActiveLanguage(lang) {
    try {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
    } catch (error) {
        console.warn('[theme] updateActiveLanguage error:', error);
    }
}
