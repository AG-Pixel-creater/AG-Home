/**
 * Database Translator
 * 
 * Handles translation of dynamic content from Firestore
 * Supports both pre-stored translations and fallback to translation keys
 */

import { t, getCurrentLanguage } from './localization.js';

/**
 * Get translated text from database content
 * Supports multiple fallback strategies:
 * 1. Specific language field (name_en, name_ur, etc.)
 * 2. Translations object (translations: { en: "...", ur: "..." })
 * 3. Translation key reference (translationKey: "product.xyz")
 * 4. Default field with fallback language
 * 
 * @param {Object} item - Database item
 * @param {string} field - Field name to get translation for (e.g., 'name', 'description')
 * @param {string} lang - Language code (optional, defaults to current language)
 * @returns {string} Translated text or original field value
 */
export function getTranslated(item, field, lang = getCurrentLanguage()) {
    if (!item || !field) return '';

    // Strategy 1: Look for language-specific field (e.g., name_en, name_ur)
    const langSpecificField = `${field}_${lang}`;
    if (item[langSpecificField]) {
        return item[langSpecificField];
    }

    // Strategy 2: Look for translations object
    if (item.translations && item.translations[field]) {
        const fieldTranslations = item.translations[field];
        if (typeof fieldTranslations === 'object' && fieldTranslations[lang]) {
            return fieldTranslations[field][lang];
        }
    }

    // Strategy 3: Look for translation key reference
    if (item.translationKeys && item.translationKeys[field]) {
        const key = item.translationKeys[field];
        return t(key, lang);
    }

    // Strategy 4: Fall back to original field (usually in English)
    if (item[field]) {
        return item[field];
    }

    return '';
}

/**
 * Translate an entire object's fields
 * 
 * @param {Object} item - Database item
 * @param {Array<string>} fields - Array of field names to translate
 * @param {string} lang - Language code (optional)
 * @returns {Object} Object with translated fields
 */
export function translateObject(item, fields, lang = getCurrentLanguage()) {
    const translated = { ...item };

    fields.forEach(field => {
        translated[field] = getTranslated(item, field, lang);
    });

    return translated;
}

/**
 * Translate an array of objects
 * 
 * @param {Array<Object>} items - Array of database items
 * @param {Array<string>} fields - Fields to translate
 * @param {string} lang - Language code (optional)
 * @returns {Array<Object>} Array of translated objects
 */
export function translateArray(items, fields, lang = getCurrentLanguage()) {
    return items.map(item => translateObject(item, fields, lang));
}


/**
 * Get translated product
 * 
 * @param {Object} product - Product object from Firestore
 * @param {string} lang - Language code (optional)
 * @returns {Object} Product with translated fields
 */
export function translateProduct(product, lang = getCurrentLanguage()) {
    return translateObject(product, ['name', 'description', 'category'], lang);
}

/**
 * Get translated article
 * 
 * @param {Object} article - Article object from Firestore
 * @param {string} lang - Language code (optional)
 * @returns {Object} Article with translated fields
 */
export function translateArticle(article, lang = getCurrentLanguage()) {
    return translateObject(article, ['title', 'summary', 'content', 'category'], lang);
}

/**
 * Set up listener for language changes
 * Useful to update translated UI when language is changed
 * 
 * @param {Function} callback - Function to call when language changes
 * @returns {Function} Unsubscribe function
 */
export function onLanguageChange(callback) {
    const handler = (event) => {
        callback(event.detail?.language || getCurrentLanguage());
    };
    
    window.addEventListener('languageChanged', handler);
    
    // Return unsubscribe function
    return () => {
        window.removeEventListener('languageChanged', handler);
    };
}

/**
 * HOW TO STORE TRANSLATIONS IN FIRESTORE
 * 
 * Choose ONE of these patterns for your database:
 * 
 * OPTION 1: Language-specific fields (Recommended for simple content)
 * ────────────────────────────────────────────────────────────────
 * Collection: products
 * Document:
 * {
 *   id: "product1",
 *   name_en: "Wireless Headphones",
 *   name_ur: "وائرلیس ہیڈ فونز",
 *   description_en: "High-quality wireless headphones",
 *   description_ur: "اعلیٰ معیار کے وائرلیس ہیڈ فونز",
 *   category_en: "Electronics",
 *   category_ur: "الیکٹرانکس",
 *   price: 5000,
 *   image: "https://...",
 *   createdAt: timestamp
 * }
 * 
 * Usage in code:
 * const product = await getDoc(...);
 * const translated = translateProduct(product);
 * console.log(translated.name); // Shows urdu or english based on language
 * 
 * 
 * OPTION 2: Translations nested object
 * ────────────────────────────────────
 * {
 *   id: "product1",
 *   name: "Wireless Headphones",  // Default/English
 *   translations: {
 *     name: { en: "Wireless Headphones", ur: "وائرلیس ہیڈ فونز" },
 *     description: { 
 *       en: "High-quality wireless headphones",
 *       ur: "اعلیٰ معیار کے وائرلیس ہیڈ فونز"
 *     },
 *     category: { en: "Electronics", ur: "الیکٹرانکس" }
 *   },
 *   price: 5000,
 *   image: "https://...",
 *   createdAt: timestamp
 * }
 * 
 * Usage:
 * const product = await getDoc(...);
 * const translated = translateProduct(product);
 * 
 * 
 * OPTION 3: Translation keys (for reusable content)
 * ──────────────────────────────────────────────────
 * {
 *   id: "product1",
 *   name: "Wireless Headphones",
 *   translationKeys: {
 *     name: "product.wireless_headphones",
 *     category: "category.electronics"
 *   },
 *   price: 5000,
 *   image: "https://...",
 *   createdAt: timestamp
 * }
 * 
 * Then add to localization.js:
 * 'product.wireless_headphones': 'Wireless Headphones',
 * 'category.electronics': 'Electronics',
 * 
 * Usage:
 * const product = await getDoc(...);
 * const translated = translateProduct(product);
 * 
 * 
 * SCHEMA EXAMPLES FOR DIFFERENT CONTENT TYPES:
 * 
 * Products (Option 1 - Language fields):
 * {
 *   id, name_en, name_ur, description_en, description_ur,
 *   category_en, category_ur, price, image, rating, inStock
 * }
 * 
 * Blog Posts (Option 2 - Translations object):
 * {
 *   id, author, translations: { title, content, summary },
 *   tags, publishedAt, createdAt, updatedAt
 * }
 * 
 * Pages/Content (Option 3 - Translation keys):
 * {
 *   id, title, content,
 *   translationKeys: { title, content },
 *   slug, order
 * }
 */

export default {
    getTranslated,
    translateObject,
    translateArray,
    translateProduct,
    translateArticle,
    onLanguageChange,
    getCurrentLanguage
};
