import { db } from './firebase-config.js';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getTranslated, onLanguageChange } from './db-translator.js';
import { getCurrentLanguage, applyTranslations, t } from './localization.js';

// Exchange rate: 1 USD = ~278 PKR
const PKR_TO_USD_RATE = 278;

// Helper function to convert PKR to USD
function convertPKRToUSD(priceInPKR) {
    if (!priceInPKR || priceInPKR === 0) return 0;
    return (priceInPKR / PKR_TO_USD_RATE).toFixed(2);
}

// Helper function to format price display
function formatPrice(priceInPKR) {
    console.log('formatPrice called with:', priceInPKR, 'Type:', typeof priceInPKR);
    
    // Ensure we have a number
    const price = parseFloat(priceInPKR) || 0;
    console.log('After parseFloat:', price);
    
    // If price is 0 or less, show FREE
    if (price <= 0) {
        console.log('Price is 0 or less, returning FREE');
        return 'FREE';
    }
    
    // Otherwise show PKR with USD conversion
    const roundedPrice = Math.round(price);
    const usdPrice = (price / PKR_TO_USD_RATE).toFixed(2);
    const result = `${roundedPrice} PKR ($ ${usdPrice})`;
    console.log('Formatted result:', result);
    return result;
}

class ProductFilterWheel {
    constructor() {
        this.products = [];
        this.categories = [];
        this.currentFilter = 'ALL';
        this.currentWheelIndex = 0;
        this.wheelItems = 5;
        this.isAnimating = false;
        this.init();
    }

    async init() {
        try {
            // Load products from Firestore
            await this.loadProducts();
            this.setupEventListeners();
            this.renderWheel();
            this.filterAndDisplay();
            
            // Listen for language changes and refresh product display
            onLanguageChange(() => {
                console.log('Language changed, refreshing products...');
                this.filterAndDisplay();
            });
            
            // Listen for language changes and update product details modal if open
            onLanguageChange(() => {
                const modal = document.getElementById('productDetailsModal');
                if (modal && !modal.classList.contains('hidden')) {
                    console.log('Language changed, updating product details modal...');
                    // Re-display current product with new language
                    if (window.currentProduct && window.currentProductId) {
                        showProductDetails(window.currentProductId, window.currentProduct);
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing products:', error);
        }
    }

    async loadProducts() {
        try {
            const productsCollection = collection(db, 'products');
            const snapshot = await getDocs(productsCollection);
            this.products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Extract and organize categories
            this.categories = ['ALL'];
            const categoriesSet = new Set();
            
            this.products.forEach(product => {
                if (product.category) {
                    categoriesSet.add(product.category);
                }
            });

            this.categories.push(...Array.from(categoriesSet).sort());
            
            console.log('Products loaded:', this.products.length);
            console.log('Categories:', this.categories);

            // Hide loading message
            const loadingMsg = document.getElementById('loadingMsg');
            if (loadingMsg) loadingMsg.style.display = 'none';
        } catch (error) {
            console.error('Error loading products:', error);
            const loadingMsg = document.getElementById('loadingMsg');
            if (loadingMsg) {
                loadingMsg.textContent = 'Error loading products. Please refresh the page.';
                loadingMsg.style.color = 'red';
            }
        }
    }

    setupEventListeners() {
        const wheel = document.getElementById('filterWheel');
        
        // Mouse wheel scrolling
        wheel.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                this.rotateWheel(1);
            } else {
                this.rotateWheel(-1);
            }
        }, { passive: false });

        // Left click to rotate
        wheel.addEventListener('click', () => {
            this.rotateWheel(1);
        });

        // Right click to show category modal
        wheel.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showCategoryModal();
        });

        // Category modal close button
        const closeBtn = document.querySelector('.category-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideCategoryModal();
            });
        }

        // Close modal when clicking outside
        const modal = document.getElementById('categoryModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideCategoryModal();
                }
            });
        }
    }

    rotateWheel(direction) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentWheelIndex += direction;
        
        // Wrap around
        if (this.currentWheelIndex >= this.categories.length) {
            this.currentWheelIndex = 0;
        } else if (this.currentWheelIndex < 0) {
            this.currentWheelIndex = this.categories.length - 1;
        }

        this.renderWheel();
        this.filterAndDisplay();

        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    renderWheel() {
        const wheel = document.getElementById('filterWheel');
        if (!wheel) return;

        const items = wheel.querySelectorAll('.wheel-item');
        
        items.forEach((item, i) => {
            const categoryIndex = (this.currentWheelIndex + i) % this.categories.length;
            const category = this.categories[categoryIndex];
            
            item.textContent = category;
            item.dataset.category = category;
            item.classList.remove('active');
            
            // Highlight the center (top) item
            if (i === 0) {
                item.classList.add('active');
                this.currentFilter = category;
            }
        });
    }

    filterAndDisplay() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        let filtered = this.products;
        
        if (this.currentFilter !== 'ALL') {
            filtered = this.products.filter(product => product.category === this.currentFilter);
        }

        // Clear grid
        productsGrid.innerHTML = '';

        // Apply current view mode
        const viewMode = localStorage.getItem('viewMode') || 'grid';
        productsGrid.classList.remove('grid-view', 'list-view');
        productsGrid.classList.add(viewMode === 'list' ? 'list-view' : 'grid-view');

        if (filtered.length === 0) {
            const noProductsMsg = document.createElement('p');
            noProductsMsg.className = 'no-products';
            noProductsMsg.setAttribute('data-i18n', 'product.noProducts');
            noProductsMsg.textContent = 'No products in this category';
            productsGrid.appendChild(noProductsMsg);
            
            // Apply translations to the new element
            applyTranslations(getCurrentLanguage());
            return;
        }

        // Create product cards
        filtered.forEach(product => {
            const card = this.createProductCard(product);
            productsGrid.appendChild(card);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cursor = 'pointer';
        card.onclick = () => showProductDetails(product.id, product);
        
        // Get translated content
        const name = getTranslated(product, 'name') || 'Unknown';
        const category = getTranslated(product, 'category') || 'Uncategorized';
        const description = getTranslated(product, 'description') || '';
        
        card.innerHTML = `
            <div class="product-image">
                ${product.image ? `<img src="${product.image}" alt="${name}">` : '<div class="no-image">No Image</div>'}
            </div>
            <div class="product-info">
                <h3 class="product-name">${name}</h3>
                <p class="product-category">${category}</p>
                <p class="product-price">${formatPrice(product.price || 0)}</p>
                ${description ? `<p class="product-description">${description}</p>` : ''}
            </div>
        `;
        return card;
    }

    showCategoryModal() {
        const modal = document.getElementById('categoryModal');
        const categoryList = document.getElementById('categoryList');

        if (!modal || !categoryList) return;

        // Clear existing categories
        categoryList.innerHTML = '';

        // Add all categories
        this.categories.forEach((category, index) => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            if (category === this.currentFilter) {
                btn.classList.add('active');
            }
            btn.textContent = category;
            btn.addEventListener('click', () => {
                this.selectCategory(category);
            });
            categoryList.appendChild(btn);
        });

        modal.classList.remove('hidden');
    }

    hideCategoryModal() {
        const modal = document.getElementById('categoryModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    selectCategory(category) {
        // Find the index of this category
        const index = this.categories.indexOf(category);
        if (index !== -1) {
            this.currentWheelIndex = index;
            this.renderWheel();
            this.filterAndDisplay();
        }
        this.hideCategoryModal();
    }
}

// Show Product Details Modal
function showProductDetails(productId, product) {
    try {
        console.log('showProductDetails called with:', productId, product);
        
        // Store product data for editing
        window.currentProductId = productId;
        window.currentProduct = product;
        
        const modal = document.getElementById('productDetailsModal');
        if (!modal) {
            console.error('Modal element not found!');
            return;
        }
        
        console.log('Modal found, populating details...');
        
        // Set basic info
        console.log('Product data:', product);
        console.log('Price value:', product.price, 'Type:', typeof product.price);
        console.log('Stock value:', product.stock, 'Type:', typeof product.stock);
        
        try {
            // Get translated name
            const translatedName = getTranslated(product, 'name') || product.name;
            document.getElementById('detailsProductName').textContent = translatedName;
            document.getElementById('detailsName').textContent = translatedName;
            console.log('✓ Set product name:', translatedName);
        } catch (e) {
            console.error('Error setting product name:', e);
        }
        
        // Ensure price is a number and format it
        try {
            const priceValue = product.price ? parseFloat(product.price) : 0;
            console.log('Converted priceValue:', priceValue, 'Type:', typeof priceValue);
            
            // Debug: Log what parseFloat actually returned
            if (product.price !== undefined && product.price !== null) {
                console.log('parseFloat("' + product.price + '") =', parseFloat(product.price));
            }
            
            const formattedPrice = formatPrice(priceValue);
            console.log('Formatted price result:', formattedPrice);
            
            const priceElement = document.getElementById('detailsPrice');
            console.log('Price element exists?', !!priceElement);
            console.log('Element ID check - detailsPrice:', priceElement?.id);
            console.log('Element class check:', priceElement?.className);
            
            if (priceElement) {
                console.log('Setting price element textContent to:', formattedPrice);
                priceElement.textContent = formattedPrice;
                console.log('Price element textContent after setting:', priceElement.textContent);
                console.log('Price element innerHTML:', priceElement.innerHTML);
            }
        } catch (e) {
            console.error('Error formatting price:', e);
        }
        
        try {
            const translatedCategory = getTranslated(product, 'category') || product.category;
            document.getElementById('detailsCategory').textContent = translatedCategory;
        } catch (e) {
            console.error('Error setting category:', e);
        }
        
        // Set product image
        try {
            const imgElement = document.getElementById('detailsProductImage');
            if (product.image) {
                imgElement.src = product.image;
                imgElement.style.display = 'block';
            } else {
                imgElement.style.display = 'none';
            }
        } catch (e) {
            console.error('Error setting image:', e);
        }

        // Set optional fields with conditional display
        if (product.subCategory) {
            document.getElementById('detailsSubCategory').textContent = product.subCategory;
            document.getElementById('subCategoryRow').style.display = 'flex';
        } else {
            document.getElementById('subCategoryRow').style.display = 'none';
        }

        if (product.brand) {
            document.getElementById('detailsBrand').textContent = product.brand;
            document.getElementById('brandRow').style.display = 'flex';
        } else {
            document.getElementById('brandRow').style.display = 'none';
        }

        if (product.sku) {
            document.getElementById('detailsSKU').textContent = product.sku;
            document.getElementById('skuRow').style.display = 'flex';
        } else {
            document.getElementById('skuRow').style.display = 'none';
        }

        // Handle stock display - ensure proper integer conversion
        try {
            let stockValue = null;
            if (product.stock !== undefined && product.stock !== null) {
                stockValue = parseInt(product.stock, 10); // Explicitly use base 10 for parseInt
            }
            console.log('Stock final value:', stockValue, 'Type:', typeof stockValue);
            console.log('Stock comparison: stockValue === -1?', stockValue === -1);
            
            const stockRow = document.getElementById('stockRow');
            const stockEl = document.getElementById('detailsStock');
            console.log('Stock element found?', !!stockEl);
            
            if (stockValue === -1) {
                // Unlimited stock
                console.log('Stock is -1, setting to Unlimited');
                if (stockEl) {
                    const unlimitedLabel = t('details.stockUnlimited', getCurrentLanguage());
                    stockEl.textContent = unlimitedLabel;
                    stockEl.setAttribute('data-i18n', 'details.stockUnlimited');
                    console.log('Stock element after setting:', stockEl.textContent);
                }
                if (stockRow) stockRow.style.display = 'flex';
            } else if (stockValue !== null && stockValue >= 0) {
                // Specific stock amount
                console.log('Stock is', stockValue, 'units');
                if (stockEl) {
                    const unitsLabel = t('details.stockUnits', getCurrentLanguage());
                    stockEl.textContent = `${stockValue} ${unitsLabel}`;
                    stockEl.removeAttribute('data-i18n'); // No translation for specific numbers
                    console.log('Stock element after setting:', stockEl.textContent);
                }
                if (stockRow) stockRow.style.display = 'flex';
            } else {
                // No stock info
                console.log('No valid stock value, hiding stock row');
                if (stockRow) stockRow.style.display = 'none';
            }
        } catch (e) {
            console.error('Error handling stock:', e);
        }

        if (product.rating) {
            document.getElementById('detailsRating').textContent = `${product.rating}/5 ⭐`;
            document.getElementById('ratingRow').style.display = 'flex';
        } else {
            document.getElementById('ratingRow').style.display = 'none';
        }

        if (product.description || product.description_en || product.description_ur) {
            const translatedDescription = getTranslated(product, 'description') || product.description;
            document.getElementById('detailsDescription').textContent = translatedDescription;
            document.getElementById('descriptionRow').style.display = 'flex';
        } else {
            document.getElementById('descriptionRow').style.display = 'none';
        }

        // Set tags
        if (product.tags && product.tags.length > 0) {
            const tagsContainer = document.getElementById('detailsTags');
            tagsContainer.innerHTML = product.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            document.getElementById('tagsRow').style.display = 'flex';
        } else {
            document.getElementById('tagsRow').style.display = 'none';
        }

        // Set specifications
        if (product.specifications && Object.keys(product.specifications).length > 0) {
            const specsContainer = document.getElementById('detailsSpecs');
            const specsHTML = Object.entries(product.specifications)
                .map(([key, value]) => `<div class="spec-item"><strong>${key}:</strong> ${value}</div>`)
                .join('');
            specsContainer.innerHTML = specsHTML;
            document.getElementById('specsRow').style.display = 'flex';
        } else {
            document.getElementById('specsRow').style.display = 'none';
        }

        // Set product link button
        const productLinkBtn = document.getElementById('productLinkBtn');
        if (productLinkBtn) {
            if (product.productLink) {
                productLinkBtn.href = product.productLink;
                productLinkBtn.style.display = 'inline-block';
            } else {
                productLinkBtn.style.display = 'none';
            }
        }

        // Set download link button
        const downloadLinkBtn = document.getElementById('downloadLinkBtn');
        const downloadBtnLabel = document.getElementById('downloadBtnLabel');
        if (downloadLinkBtn) {
            if (product.downloadLink) {
                downloadLinkBtn.href = product.downloadLink;
                downloadLinkBtn.download = true;
                if (downloadBtnLabel) {
                    downloadBtnLabel.textContent = `📥 ${product.downloadLabel || 'Download'}`;
                }
                downloadLinkBtn.style.display = 'inline-block';
            } else {
                downloadLinkBtn.style.display = 'none';
            }
        }

        // Show modal
        console.log('Removing hidden class from modal');
        modal.classList.remove('hidden');
        modal.style.setProperty('display', 'flex', 'important');
        console.log('Modal should now be visible. Classes:', modal.className, 'Display:', modal.style.display);
        
        // Apply translations to modal elements
        applyTranslations(getCurrentLanguage());
        
    } catch (outerError) {
        console.error('❌ ERROR IN showProductDetails:', outerError);
        console.error('Stack trace:', outerError.stack);
    }
}

// Close Product Details Modal
function closeProductDetailsModal() {
    console.log('Closing product details modal');
    const modal = document.getElementById('productDetailsModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.setProperty('display', 'none', 'important');
    }
}

// Open Report Modal
function openReportModal() {
    const reportModal = document.getElementById('reportModal');
    if (reportModal) {
        reportModal.classList.remove('hidden');
        reportModal.style.setProperty('display', 'flex', 'important');
        // Reset form
        document.getElementById('reportForm').reset();
    }
}

// Close Report Modal
function closeReportModal() {
    const reportModal = document.getElementById('reportModal');
    if (reportModal) {
        reportModal.classList.add('hidden');
        reportModal.style.setProperty('display', 'none', 'important');
    }
}

// Submit Report
async function submitReport(event) {
    event.preventDefault();
    
    try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        // Check if user is authenticated
        if (!currentUser) {
            alert('You must be logged in to report a product. Please log in and try again.');
            closeReportModal();
            return;
        }

        const reportReason = document.getElementById('reportReason').value;
        const reportDetails = document.getElementById('reportDetails').value;
        const product = window.currentProduct;
        const productId = window.currentProductId;
        
        if (!reportReason) {
            alert('Please select a reason for reporting');
            return;
        }

        if (!product || !productId) {
            alert('Product information is missing');
            return;
        }

        // Prepare report data - must match Firestore rules requirements
        const reportData = {
            productId: productId,
            productName: product.name,
            productCategory: product.category,
            reason: reportReason,
            details: reportDetails || '',
            reportedBy: currentUser.uid,  // Must match request.auth.uid in rules
            userEmail: currentUser.email,
            timestamp: serverTimestamp(),
            status: 'pending'
        };

        console.log('Submitting report:', reportData);

        // Add report to Firestore
        const reportsCollection = collection(db, 'reports');
        const docRef = await addDoc(reportsCollection, reportData);
        
        console.log('Report submitted successfully:', docRef.id);
        
        // Show success message
        alert('Thank you for reporting this product. Our team will review it shortly.');
        
        // Close report modal
        closeReportModal();
        
        // Close product details modal
        closeProductDetailsModal();
        
    } catch (error) {
        console.error('Error submitting report:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        if (error.code === 'permission-denied') {
            alert('You do not have permission to submit reports. Please ensure you are logged in and try again.');
        } else {
            alert('Error submitting report: ' + error.message);
        }
    }
}

// Expose functions to window for onclick handlers
window.showProductDetails = showProductDetails;
window.closeProductDetailsModal = closeProductDetailsModal;
window.openReportModal = openReportModal;
window.closeReportModal = closeReportModal;
window.submitReport = submitReport;

// Initialize the wheel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProductFilterWheel();
});
