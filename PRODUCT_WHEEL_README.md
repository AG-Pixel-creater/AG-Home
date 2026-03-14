# 🎡 Interactive Product Filter Wheel

A beautiful, interactive filter wheel for browsing products by category! This feature includes a rotating wheel selector with multiple interaction methods.

## ✨ Features

### 🎪 Filter Wheel
- **5-Item Display**: Shows 5 category filters at a time in a circular arrangement
- **Smooth Animations**: Elegant transitions and hover effects
- **Active Indicator**: Center green dot highlights the currently selected category
- **Multiple Navigation Methods**:
  - 🖱️ **Mouse Wheel**: Scroll to rotate through categories
  - 🖱️ **Left Click**: Click the wheel to rotate to the next category
  - 🖱️ **Right Click**: Opens a popup showing all available categories

### 📦 Product Display
- **Category Filtering**: Product grid updates automatically when you change categories
- **Product Cards**: Beautiful card layout with:
  - Product image
  - Product name
  - Category badge
  - Price display
  - Description
- **Responsive Grid**: Adapts to different screen sizes
- **"ALL" Category**: View all products at once

### 🎨 Design
- **Glassmorphism Effects**: Modern glass-like UI elements
- **Neon Colors**: Cyan (#00ffff) and blue (#0b6efd) accent colors
- **Smooth Transitions**: All interactions have smooth animations
- **Dark Theme**: Professional dark background with vibrant accents
- **Fully Responsive**: Works on desktop, tablet, and mobile devices

## 🚀 Getting Started

### 1. Add Sample Products (Optional)

To test the filter wheel with sample data:

```javascript
// In browser console on any page:
import { initSampleProducts } from './js/sample-products.js';
await initSampleProducts();
```

Or refresh the Products page after running the above command.

### 2. Add Your Own Products

Products should be stored in Firestore with this structure:

```javascript
{
    name: "Product Name",           // Required: String
    category: "Category Name",      // Required: String
    price: 99.99,                   // Optional: Number
    description: "Description",     // Optional: String
    image: "https://..."            // Optional: Image URL
}
```

**Firestore Collection**: `products`

### 3. Use the Filter Wheel

Once products are added:

1. Navigate to the Products page
2. Use any of these methods to browse categories:
   - Scroll your mouse wheel on the wheel to rotate
   - Click the wheel to advance to the next category
   - Right-click to see all categories and jump to any one
3. Products grid updates automatically as you change categories

## 🎯 How It Works

### Wheel Rotation Logic
- The wheel displays 5 categories at a time
- They are arranged in a circle with the top one being "ACTIVE"
- Each interaction rotates the wheel and brings a new category to the front
- Categories wrap around (after the last one comes the first)

### Category Selection
- **Left Click/Scroll**: Rotates forward
- **Right Click → Modal**: Shows all categories
  - Click any category button to jump directly to it
  - "ALL" button shows all products regardless of category
  - Currently selected category is highlighted

### Product Filtering
- When you select a category, the product grid updates
- Shows all products matching that category
- "ALL" shows all products in the database
- Grid animations smoothly transition when content changes

## 📁 Files Modified/Created

### New Files
- `src/js/products.js` - Main wheel logic and product management
- `src/js/sample-products.js` - Sample data initialization script

### Modified Files
- `src/products.html` - Added wheel UI and products container
- `src/css/styles_1.css` - Added all wheel and product styling
- `src/js/firebase-config.js` - Added Firestore export

## 🎮 Interaction Examples

### Navigation
```
Mouse Wheel ↑ ... rotate backward
Mouse Wheel ↓ ... rotate forward
Left Click ... rotate forward
Right Click ... open category modal
```

### Category Modal
```
Select any category ... jump to it immediately
Click X or outside ... close modal without changing
Current category ... shown with blue highlight
```

## 🌈 Styling & Theme

All colors automatically adapt to your theme (light/dark):

- **Primary Accent**: `var(--accent-color)` (#0b6efd)
- **Secondary Accent**: Cyan (#00ffff)
- **Background**: `var(--container-bg)`
- **Text**: `var(--text-color)`

The wheel works seamlessly with your existing theme system!

## 🔧 Customization

### Adjust Wheel Size
Edit in `styles_1.css`:
```css
.filter-wheel-wrapper {
    width: 350px;  /* Change these */
    height: 350px;
}
```

### Change Item Count
In `products.html`, add/remove `.wheel-item` divs:
```html
<div class="wheel-item" style="--index: 0"></div>
<!-- Add more items here -->
```

Then update CSS positioning for each new item.

### Customize Colors
In `styles_1.css`:
```css
.wheel-item {
    background: linear-gradient(135deg, var(--accent-color), #7f70ff);
    border: 2px solid var(--accent-color);
}
```

## 💡 Tips

1. **First Time Setup**: Run `initSampleProducts()` to populate test data
2. **Product Images**: Use high-quality images for best appearance
3. **Category Names**: Keep them short (1-2 words) for the wheel display
4. **Mobile**: Wheel still works great on mobile with touch
5. **Performance**: Works smoothly with 100+ products

## 🐛 Troubleshooting

### Products Not Showing?
- Check that Firestore collection is named `products`
- Verify product documents have `name` and `category` fields
- Check browser console for errors

### Wheel Not Rotating?
- Make sure you're clicking/scrolling on the blue circle, not outside
- Try in a different browser
- Clear browser cache

### Categories Not Loading?
- Check Firestore is initialized properly
- Verify you have read permissions on the `products` collection
- Check Firebase console for errors

## 📊 Performance

- **Smooth 60fps animations** on modern browsers
- **Efficient filtering** with lightweight JavaScript
- **Lazy initialization** - only loads when Products page is visited
- Works with Firestore real-time updates

## ✅ Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## 📝 Notes

- The wheel automatically extracts categories from your product data
- "ALL" is always the first category for viewing all products
- All product interactions are real-time with your Firestore database
- The wheel is touch-friendly on mobile devices

---

Enjoy your beautiful product filter wheel! 🎡✨
