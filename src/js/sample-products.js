/**
 * Sample Product Data Initialization Script
 * 
 * This script populates your Firestore with sample products for testing the filter wheel.
 * Run this in the browser console on any page, or import and call initSampleProducts()
 * 
 * Products have base fields: name, category, price, description, and image
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * TO ADD TRANSLATIONS:
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Option 1: Add language-specific fields for each field (RECOMMENDED)
 * {
 *   name_en: "Wireless Headphones",
 *   name_ur: "وائرلیس ہیڈ فونز",
 *   category_en: "Electronics",
 *   category_ur: "الیکٹرانکس",
 *   description_en: "High-quality wireless headphones...",
 *   description_ur: "اعلیٰ معیار کے وائرلیس ہیڈ فونز...",
 *   price: 5000,
 *   image: "..."
 * }
 * 
 * Option 2: Add a translations object
 * {
 *   name: "Wireless Headphones",
 *   translations: {
 *     name: { en: "Wireless Headphones", ur: "وائرلیس ہیڈ فونز" },
 *     category: { en: "Electronics", ur: "الیکٹرانکس" },
 *     description: { 
 *       en: "High-quality wireless headphones...",
 *       ur: "اعلیٰ معیار کے وائرلیس ہیڈ فونز..."
 *     }
 *   },
 *   price: 5000,
 *   image: "..."
 * }
 * 
 * Then use in code:
 * import { getTranslated } from './db-translator.js';
 * const translatedName = getTranslated(product, 'name'); // Gets urdu or english
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { db } from './firebase-config.js';
import { collection, addDoc } from 'firebase/firestore';

const SAMPLE_PRODUCTS = [
    // Electronics
    {
        name: "Wireless Headphones",
        category: "Electronics",
        price: 79.99,
        description: "High-quality wireless headphones with noise cancellation",
        image: "https://via.placeholder.com/300?text=Wireless+Headphones"
    },
    {
        name: "USB-C Cable",
        category: "Electronics",
        price: 12.99,
        description: "Durable fast charging USB-C cable",
        image: "https://via.placeholder.com/300?text=USB-C+Cable"
    },
    {
        name: "Portable Speaker",
        category: "Electronics",
        price: 49.99,
        description: "Waterproof portable Bluetooth speaker",
        image: "https://via.placeholder.com/300?text=Portable+Speaker"
    },
    {
        name: "Smart Watch",
        category: "Electronics",
        price: 199.99,
        description: "Advanced fitness tracking smartwatch",
        image: "https://via.placeholder.com/300?text=Smart+Watch"
    },
    {
        name: "Webcam HD",
        category: "Electronics",
        price: 59.99,
        description: "1080p HD webcam for streaming and video calls",
        image: "https://via.placeholder.com/300?text=Webcam+HD"
    },
    
    // Clothing
    {
        name: "Cotton T-Shirt",
        category: "Clothing",
        price: 24.99,
        description: "Comfortable 100% cotton t-shirt",
        image: "https://via.placeholder.com/300?text=Cotton+T-Shirt"
    },
    {
        name: "Blue Jeans",
        category: "Clothing",
        price: 49.99,
        description: "Classic blue denim jeans",
        image: "https://via.placeholder.com/300?text=Blue+Jeans"
    },
    {
        name: "Leather Jacket",
        category: "Clothing",
        price: 149.99,
        description: "Premium leather jacket",
        image: "https://via.placeholder.com/300?text=Leather+Jacket"
    },
    {
        name: "Sneakers",
        category: "Clothing",
        price: 89.99,
        description: "Stylish athletic sneakers",
        image: "https://via.placeholder.com/300?text=Sneakers"
    },
    {
        name: "Winter Coat",
        category: "Clothing",
        price: 129.99,
        description: "Warm waterproof winter coat",
        image: "https://via.placeholder.com/300?text=Winter+Coat"
    },
    
    // Books
    {
        name: "JavaScript Guide",
        category: "Books",
        price: 34.99,
        description: "Comprehensive guide to JavaScript programming",
        image: "https://via.placeholder.com/300?text=JavaScript+Guide"
    },
    {
        name: "Web Design Basics",
        category: "Books",
        price: 29.99,
        description: "Learn the fundamentals of web design",
        image: "https://via.placeholder.com/300?text=Web+Design"
    },
    {
        name: "React Mastery",
        category: "Books",
        price: 39.99,
        description: "Master React.js development",
        image: "https://via.placeholder.com/300?text=React+Mastery"
    },
    {
        name: "Firebase Handbook",
        category: "Books",
        price: 44.99,
        description: "Complete Firebase development handbook",
        image: "https://via.placeholder.com/300?text=Firebase+Handbook"
    },
    {
        name: "CSS Secrets",
        category: "Books",
        price: 32.99,
        description: "Advanced CSS techniques and tricks",
        image: "https://via.placeholder.com/300?text=CSS+Secrets"
    },
    
    // Home & Garden
    {
        name: "LED Lamp",
        category: "Home & Garden",
        price: 35.99,
        description: "Energy-efficient LED desk lamp",
        image: "https://via.placeholder.com/300?text=LED+Lamp"
    },
    {
        name: "Plant Pot",
        category: "Home & Garden",
        price: 15.99,
        description: "Ceramic decorative plant pot",
        image: "https://via.placeholder.com/300?text=Plant+Pot"
    },
    {
        name: "Area Rug",
        category: "Home & Garden",
        price: 79.99,
        description: "Modern area rug for living room",
        image: "https://via.placeholder.com/300?text=Area+Rug"
    },
    {
        name: "Throw Pillow",
        category: "Home & Garden",
        price: 22.99,
        description: "Decorative throw pillow with pattern",
        image: "https://via.placeholder.com/300?text=Throw+Pillow"
    },
    {
        name: "Wall Art",
        category: "Home & Garden",
        price: 59.99,
        description: "Modern abstract wall art",
        image: "https://via.placeholder.com/300?text=Wall+Art"
    },
    
    // Sports
    {
        name: "Yoga Mat",
        category: "Sports",
        price: 29.99,
        description: "Non-slip yoga mat for exercise",
        image: "https://via.placeholder.com/300?text=Yoga+Mat"
    },
    {
        name: "Dumbbell Set",
        category: "Sports",
        price: 59.99,
        description: "Adjustable dumbbell set 5-25 lbs",
        image: "https://via.placeholder.com/300?text=Dumbbell+Set"
    },
    {
        name: "Resistance Bands",
        category: "Sports",
        price: 19.99,
        description: "Set of resistance training bands",
        image: "https://via.placeholder.com/300?text=Resistance+Bands"
    },
    {
        name: "Basketball",
        category: "Sports",
        price: 24.99,
        description: "Official size basketball",
        image: "https://via.placeholder.com/300?text=Basketball"
    },
    {
        name: "Running Shoes",
        category: "Sports",
        price: 109.99,
        description: "Professional running athletic shoes",
        image: "https://via.placeholder.com/300?text=Running+Shoes"
    }
];

export async function initSampleProducts() {
    try {
        const productsCollection = collection(db, 'products');
        let count = 0;

        for (const product of SAMPLE_PRODUCTS) {
            try {
                await addDoc(productsCollection, product);
                count++;
                console.log(`✅ Added: ${product.name}`);
            } catch (error) {
                console.error(`❌ Error adding ${product.name}:`, error);
            }
        }

        console.log(`\n✨ Successfully added ${count}/${SAMPLE_PRODUCTS.length} products!`);
        alert(`✨ Successfully added ${count}/${SAMPLE_PRODUCTS.length} sample products to Firestore!\n\nRefresh the Products page to see them in the filter wheel.`);
    } catch (error) {
        console.error('Error initializing sample products:', error);
        alert(`Error: ${error.message}`);
    }
}

// Make function available globally for console usage
if (typeof window !== 'undefined') {
    window.initSampleProducts = initSampleProducts;
}
