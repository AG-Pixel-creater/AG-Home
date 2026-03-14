# Database Translation Guide

This guide explains how to store and translate dynamic content from Firestore in the AG | Home application.

## Overview

The application supports translating content fetched from Firestore. You can store translations in three different ways, depending on your needs.

## Translation Strategies

### Strategy 1: Language-Specific Fields (Recommended)

Store separate fields for each language using the pattern `fieldname_languagecode`.

**Storage Format:**
```javascript
{
  id: "product1",
  name_en: "Wireless Headphones",
  name_ur: "وائرلیس ہیڈ فونز",
  description_en: "High-quality wireless headphones with noise cancellation",
  description_ur: "اعلیٰ معیار کے وائرلیس ہیڈ فونز",
  category_en: "Electronics",
  category_ur: "الیکٹرانکس",
  price: 5000,
  image: "https://...",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Advantages:**
- Simple and flat structure
- Easy to query by specific language
- Fast lookups
- Clean Firestore documents

**Usage in Code:**
```javascript
import { getTranslated } from './src/js/db-translator.js';
import { getCurrentLanguage } from './src/js/localization.js';

// Get the product
const product = await getDoc(docRef);

// Get translated content (automatically uses current language)
const name = getTranslated(product.data(), 'name'); // Returns name_en or name_ur
const description = getTranslated(product.data(), 'description');
const category = getTranslated(product.data(), 'category');

// Or specify language explicitly
const englishName = getTranslated(product.data(), 'name', 'en');
const urduName = getTranslated(product.data(), 'name', 'ur');
```

---

### Strategy 2: Translations Nested Object

Store all translations for a field in a nested object.

**Storage Format:**
```javascript
{
  id: "product2",
  name: "Wireless Headphones", // Default/English fallback
  category: "Electronics",
  translations: {
    name: {
      en: "Wireless Headphones",
      ur: "وائرلیس ہیڈ فونز"
    },
    description: {
      en: "High-quality wireless headphones with noise cancellation",
      ur: "اعلیٰ معیار کے وائرلیس ہیڈ فونز"
    },
    category: {
      en: "Electronics",
      ur: "الیکٹرانکس"
    }
  },
  price: 5000,
  image: "https://...",
  createdAt: timestamp
}
```

**Advantages:**
- All translations grouped together
- Flexible structure
- Can add new languages easily
- Self-documenting

**Usage in Code:**
```javascript
import { getTranslated } from './src/js/db-translator.js';

const product = await getDoc(docRef);

// Get translated content
const name = getTranslated(product.data(), 'name'); // Reads from translations object
const description = getTranslated(product.data(), 'description');
```

---

### Strategy 3: Translation Keys (Reference Pattern)

Store references to translation keys defined in `localization.js`.

**Storage Format:**
```javascript
{
  id: "product3",
  name: "Wireless Headphones",
  category: "Electronics",
  translationKeys: {
    name: "product.wireless_headphones",
    category: "category.electronics",
    description: "product.wireless_headphones_desc"
  },
  price: 5000,
  image: "https://...",
  createdAt: timestamp
}
```

**Localization Keys (in `src/js/localization.js`):**
```javascript
export const translations = {
  en: {
    'product.wireless_headphones': 'Wireless Headphones',
    'product.wireless_headphones_desc': 'High-quality wireless headphones...',
    'category.electronics': 'Electronics',
  },
  ur: {
    'product.wireless_headphones': 'وائرلیس ہیڈ فونز',
    'product.wireless_headphones_desc': 'اعلیٰ معیار کے وائرلیس ہیڈ فونز...',
    'category.electronics': 'الیکٹرانکس',
  }
};
```

**Advantages:**
- Reuse translations across multiple products
- Consistent branding/messaging
- Centralized translation management
- Good for categories and standard terms

**Usage in Code:**
```javascript
import { getTranslated } from './src/js/db-translator.js';

const product = await getDoc(docRef);

// Get translated content (fetches from localization.js)
const name = getTranslated(product.data(), 'name');
const description = getTranslated(product.data(), 'description');
```

---

## Complete API Reference

### `getTranslated(item, field, lang?)`
Get a single translated field from a database item.

```javascript
import { getTranslated } from './src/js/db-translator.js';

const product = { name_en: 'Headphones', name_ur: 'ہیڈ فونز', price: 100 };
const name = getTranslated(product, 'name');    // English or Urdu based on current language
const price = getTranslated(product, 'price');  // Returns price (no translation)
```

### `translateObject(item, fields, lang?)`
Translate multiple fields of a single object.

```javascript
import { translateObject } from './src/js/db-translator.js';

const product = { name_en: '...', name_ur: '...', description_en: '...', description_ur: '...' };
const translated = translateObject(product, ['name', 'description']);
// Returns: { name: 'Urdu/English', description: 'Urdu/English', ... }
```

### `translateArray(items, fields, lang?)`
Translate multiple objects in an array.

```javascript
import { translateArray } from './src/js/db-translator.js';

const products = [...]; // Array from Firestore
const translated = translateArray(products, ['name', 'description']);
// Returns: Array of products with translated fields
```

### `translateProduct(product, lang?)`
Convenience function to translate standard product fields (name, description, category).

```javascript
import { translateProduct } from './src/js/db-translator.js';

const product = await getDoc(docRef);
const translated = translateProduct(product.data());
// Automatically translates: name, description, category
```

### `translateArticle(article, lang?)`
Convenience function to translate article fields (title, summary, content, category).

```javascript
import { translateArticle } from './src/js/db-translator.js';

const article = await getDoc(docRef);
const translated = translateArticle(article.data());
// Automatically translates: title, summary, content, category
```

### `onLanguageChange(callback)`
Listen for language change events and update UI accordingly.

```javascript
import { onLanguageChange } from './src/js/db-translator.js';

// Subscribe to language changes
const unsubscribe = onLanguageChange((newLanguage) => {
  console.log('Language changed to:', newLanguage);
  // Refresh your UI here
});

// Later, unsubscribe if needed
unsubscribe();
```

### `getCurrentLanguage()`
Get the current active language.

```javascript
import { getCurrentLanguage } from './src/js/db-translator.js';

const lang = getCurrentLanguage(); // Returns 'en' or 'ur'
```

---

## Practical Examples

### Example 1: Translating Products

**Firestore Document (Strategy 1):**
```javascript
{
  id: "prod001",
  name_en: "Laptop",
  name_ur: "لیپ ٹاپ",
  category_en: "Electronics",
  category_ur: "الیکٹرانکس",
  description_en: "Powerful laptop for work",
  description_ur: "کام کے لیے طاقتور لیپ ٹاپ",
  price: 150000,
  image: "laptop.jpg"
}
```

**Component Code:**
```javascript
import { getTranslated } from './src/js/db-translator.js';

function displayProduct(product) {
  const name = getTranslated(product, 'name');
  const category = getTranslated(product, 'category');
  const description = getTranslated(product, 'description');
  
  return `
    <div class="product">
      <h3>${name}</h3>
      <p class="category">${category}</p>
      <p class="description">${description}</p>
      <p class="price">${product.price} PKR</p>
    </div>
  `;
}
```

### Example 2: Auto-Refresh on Language Change

**In your component:**
```javascript
import { onLanguageChange } from './src/js/db-translator.js';

class ProductGrid {
  constructor(products) {
    this.products = products;
    this.renderProducts();
    
    // Re-render when language changes
    onLanguageChange(() => this.renderProducts());
  }
  
  renderProducts() {
    // Products will display in new language
    this.products.forEach(product => {
      this.displayProduct(product);
    });
  }
}
```

### Example 3: Bulk Translation

**Multiple products:**
```javascript
import { translateArray } from './src/js/db-translator.js';
import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebase-config.js';

async function getAllProducts() {
  const snapshot = await getDocs(collection(db, 'products'));
  const products = snapshot.docs.map(doc => doc.data());
  
  // Translate all products
  const translated = translateArray(products, ['name', 'description', 'category']);
  
  return translated;
}
```

---

## Best Practices

1. **Choose One Strategy Consistently**
   - Don't mix strategies in the same collection
   - All products should follow the same translation structure

2. **Always Include English**
   - Always provide English as the default/fallback language
   - This ensures fallback display if language-specific field is missing

3. **Use Meaningful Field Names**
   - `name_en` and `name_ur` are clear
   - Avoid abbreviations like `n_e` or `n_u`

4. **Cache Translations**
   - For frequently accessed content, cache translated values in memory
   - Update cache when language changes

5. **Validate Language Codes**
   - Only use 'en' for English and 'ur' for Urdu
   - Both must be present for any translatable field

6. **Document Your Structure**
   - Add comments in your database schema
   - Help team members understand the translation pattern

---

## Migration Guide

If you already have products without translations:

**Add translations to existing products:**
```javascript
// Strategy 1: Duplicate base field to language-specific fields
// Before:
{ name: "Headphones", category: "Electronics" }

// After:
{
  name: "Headphones",
  name_en: "Headphones",
  name_ur: "ہیڈ فونز",  // Add Urdu translation
  category: "Electronics",
  category_en: "Electronics",
  category_ur: "الیکٹرانکس"
}

// Or use Firestore Cloud Function to auto-migrate
```

---

## Troubleshooting

**Issue: Translations not showing up**
```javascript
// Check if field follows naming convention
console.log(getTranslated(product, 'name')); // Debug what's returned
console.log(product); // Check document structure
```

**Issue: Language not changing**
```javascript
// Ensure language change event is fired
import { setCurrentLanguage } from './src/js/localization.js';
setCurrentLanguage('ur'); // This triggers 'languageChanged' event
```

**Issue: Fallback language not working**
```javascript
// Ensure English fallback is always present
// If name_en is missing, getTranslated will return the base 'name' field
```

---

## Additional Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Using db-translator.js](./src/js/db-translator.js)
- [Localization System](./src/js/localization.js)
- [Products Module](./src/js/products.js)

---

**Last Updated:** March 2026
**Version:** 1.0
