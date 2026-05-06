// Localization module
const translations = {
    en: {
        home: 'Home',
        about: 'About',
        products: 'Products',
        contact: 'Contact',
        admin: 'Admin',
        login: 'Login',
        logout: 'Logout'
    },
    es: {
        home: 'Inicio',
        about: 'Acerca de',
        products: 'Productos',
        contact: 'Contacto',
        admin: 'Administrador',
        login: 'Iniciar sesión',
        logout: 'Cerrar sesión'
    },
    fr: {
        home: 'Accueil',
        about: 'À propos',
        products: 'Produits',
        contact: 'Contact',
        admin: 'Admin',
        login: 'Connexion',
        logout: 'Déconnexion'
    }
};

export function initLocalization() {
    try {
        const savedLanguage = localStorage.getItem('language') || 'en';
        setLanguage(savedLanguage);
    } catch (error) {
        console.warn('[localization] initLocalization error:', error);
    }
}

export function setLanguage(lang) {
    try {
        localStorage.setItem('language', lang);
        document.documentElement.setAttribute('lang', lang);
    } catch (error) {
        console.warn('[localization] setLanguage error:', error);
    }
}

export function getTranslation(key, lang = null) {
    try {
        const currentLang = lang || localStorage.getItem('language') || 'en';
        return translations[currentLang]?.[key] || translations.en[key] || key;
    } catch (error) {
        console.warn('[localization] getTranslation error:', error);
        return key;
    }
}

export function translatePage() {
    try {
        const currentLang = localStorage.getItem('language') || 'en';
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = getTranslation(key, currentLang);
        });
    } catch (error) {
        console.warn('[localization] translatePage error:', error);
    }
}
