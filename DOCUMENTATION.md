# ShopHub - Online Shopping Platform Documentation

## Project Overview

ShopHub is a modern, fully-featured online shopping platform built with React, TypeScript, and Supabase. It demonstrates a complete e-commerce solution with product browsing, shopping cart management, and checkout functionality.

## Architecture

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Database**: Supabase (PostgreSQL with RLS)
- **Icons**: Lucide React
- **Build Tool**: Vite

### Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header with cart icon
│   ├── ProductCard.tsx # Product grid card component
│   ├── ProductDetail.tsx # Product modal with details
│   ├── Cart.tsx        # Shopping cart sidebar
│   └── Checkout.tsx    # Checkout form with validation
├── context/
│   └── CartContext.tsx # Cart state management
├── lib/
│   ├── supabase.ts    # Supabase client initialization
│   └── database.types.ts # TypeScript types from schema
├── App.tsx            # Main application component
├── main.tsx           # Entry point
└── index.css          # Global styles and animations
```

## Features

### Product Management
- Dynamic product catalog loaded from Supabase
- Category filtering with real-time updates
- Full-text search by product name or description
- Stock tracking with out-of-stock indicators
- Product ratings and detailed information
- High-quality product images from Pexels

### Shopping Cart
- Add/remove products from cart
- Adjust quantities with min/max validation
- Real-time cart total calculation
- Persistent cart state with React Context
- Visual cart item count badge

### Checkout Process
- Customer information collection
- Comprehensive form validation:
  - Name validation (minimum 2 characters)
  - Email format validation
  - Phone number validation (10+ digits)
  - Address completion validation
- Error messages with visual feedback
- Order creation and storage in Supabase
- Order items tracking with pricing snapshot
- Success confirmation message

### User Experience
- Loading states with spinning animation
- Error handling with user-friendly messages
- Responsive design for mobile and desktop
- Smooth transitions and hover effects
- Empty state messaging
- Form field focus states with visual feedback

## Database Schema

### Products Table
Stores all available products with pricing and inventory information.

**Columns:**
- `id` (uuid): Primary key
- `name` (text): Product name
- `description` (text): Detailed description
- `price` (decimal): Product price
- `image_url` (text): Product image URL
- `category` (text): Product category
- `stock` (integer): Available quantity
- `rating` (decimal): Product rating (0-5)
- `created_at` (timestamptz): Creation timestamp

**Security:** Public read access via RLS

### Orders Table
Records all customer orders for tracking and management.

**Columns:**
- `id` (uuid): Primary key
- `customer_name` (text): Customer full name
- `customer_email` (text): Customer email address
- `customer_phone` (text): Customer phone number
- `shipping_address` (text): Delivery address
- `total` (decimal): Order total amount
- `status` (text): Order status (pending/completed/cancelled)
- `created_at` (timestamptz): Order creation timestamp

**Security:** Public insert and read access via RLS

### Order Items Table
Tracks individual items within each order, including pricing snapshot.

**Columns:**
- `id` (uuid): Primary key
- `order_id` (uuid): Foreign key to orders
- `product_id` (uuid): Foreign key to products
- `quantity` (integer): Quantity ordered
- `price` (decimal): Price at time of order
- `created_at` (timestamptz): Timestamp

**Security:** Public insert and read access via RLS

## Component Documentation

### Header Component
Navigation header with ShopHub branding and shopping cart button.

**Props:**
- `onCartClick`: Callback when cart button is clicked

**Features:**
- Store logo using Lucide icons
- Real-time cart item count badge
- Sticky positioning for persistent navigation

### ProductCard Component
Reusable card displaying product information in grid layout.

**Props:**
- `product`: Product object
- `onViewDetails`: Callback for viewing full details

**Features:**
- Product image with hover zoom effect
- Stock status indicators
- Price display
- Quick add to cart button
- Star rating display

### ProductDetail Component
Modal showing comprehensive product information.

**Props:**
- `product`: Selected product object
- `onClose`: Callback to close modal

**Features:**
- Large product image
- Category badge and rating
- Quantity selector with stock validation
- Detailed description
- Stock availability status

### Cart Component
Sidebar displaying cart contents with management options.

**Props:**
- `isOpen`: Controls visibility
- `onClose`: Callback to close cart
- `onCheckout`: Callback to proceed to checkout

**Features:**
- Product list with thumbnails
- Quantity adjustment controls
- Item removal
- Cart total calculation
- Checkout button
- Empty cart messaging

### Checkout Component
Form for collecting customer information and placing orders.

**Props:**
- `isOpen`: Controls visibility
- `onClose`: Callback to close checkout

**Features:**
- Order summary display
- Form validation with error messages
- Field-level error feedback
- Submission loading state
- Success confirmation
- Error handling with recovery

## State Management

### CartContext
Manages shopping cart state globally using React Context API.

**Provided Methods:**
- `addToCart(product)`: Add product with quantity 1
- `removeFromCart(productId)`: Remove product from cart
- `updateQuantity(productId, quantity)`: Update item quantity
- `clearCart()`: Empty cart
- `getCartTotal()`: Calculate total price
- `getCartCount()`: Get total items count

## API Integration

### Supabase Client
Initialized in `src/lib/supabase.ts` with environment variables.

**Environment Variables Required:**
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Public API key

### Data Fetching
Products are loaded on component mount with error handling.

**Error Handling:**
- Try-catch blocks around all database operations
- User-friendly error messages
- Console logging for debugging
- Loading state management

### Database Queries
All queries use Supabase's JavaScript SDK with TypeScript types.

**Key Patterns:**
- `maybeSingle()` for single row queries (no error on empty)
- RLS policies for data access control
- Transactions for order creation and item insertion

## Form Validation

### Checkout Form Validation Rules

**Name Field:**
- Required
- Minimum 2 characters
- Supports spaces and hyphens

**Email Field:**
- Required
- Valid email format (regex validation)
- Standard email pattern

**Phone Field:**
- Required
- Minimum 10 digits
- Supports parentheses, spaces, hyphens, plus sign

**Address Field:**
- Required
- Minimum 10 characters
- Supports complete addresses

### Real-Time Validation Feedback
- Errors clear when field is edited
- Red border and background for invalid fields
- Error messages displayed below each field
- Overall form validation before submission

## Styling

### Tailwind CSS
Used for all component styling with custom utilities.

### Custom Animations
Defined in `index.css`:
- `fadeIn`: Smooth opacity and position transition
- `slideInRight`: Sidebar entry animation
- Hover effects on cards and buttons

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts
- Adaptive spacing and typography

## Security Considerations

### Row Level Security (RLS)
All tables have RLS enabled with public policies for demonstration.

**Production Note:** Update policies to enforce authentication:
- Restrict products to specific users if needed
- Implement user-based order access
- Add admin role for order management

### Data Validation
- Client-side form validation
- Email and phone format validation
- Database constraints for data integrity
- Foreign key relationships enforced

### Environment Variables
- Sensitive keys in .env file
- Never commit secrets to repository
- Use separate keys for development and production

## Sample Data

12 products pre-loaded across 3 categories:
- **Electronics**: Headphones, smartwatch, speakers, earbuds, mouse, keyboard, power bank
- **Accessories**: Laptop backpack, USB hub, phone stand, laptop sleeve
- **Home**: LED desk lamp

Products include:
- Realistic pricing ($24-$349)
- Product descriptions
- Stock quantities
- 4.3-4.9 star ratings
- Images from Pexels

## Running the Application

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

## Testing Checklist

### Functionality
- [ ] Products load correctly
- [ ] Category filtering works
- [ ] Search filters products
- [ ] Add to cart updates count
- [ ] Cart sidebar displays items
- [ ] Quantity adjustment works
- [ ] Remove from cart functions
- [ ] Cart total calculates correctly
- [ ] Checkout form validates
- [ ] Order submits successfully
- [ ] Success message displays
- [ ] Cart clears after order

### UI/UX
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Animations smooth
- [ ] Loading state visible
- [ ] Error messages clear
- [ ] Form focus states work
- [ ] Buttons are clickable
- [ ] Images load correctly
- [ ] Colors have good contrast

### Database
- [ ] Products fetch from Supabase
- [ ] Orders save correctly
- [ ] Order items save correctly
- [ ] Relationships maintain integrity

## Future Enhancements

Potential improvements for production:
- User authentication and account management
- Payment processing integration (Stripe)
- Order tracking and history
- Product reviews and ratings
- Wishlist functionality
- Admin dashboard for product management
- Email notifications
- Inventory management
- Search optimization with full-text indexing
- Caching for better performance

## Troubleshooting

### Products Not Loading
1. Check Supabase connection in .env
2. Verify database tables exist
3. Check browser console for errors
4. Ensure RLS policies allow public read

### Cart Not Updating
1. Confirm CartProvider wraps App
2. Check CartContext usage
3. Verify state updates in browser DevTools

### Checkout Failing
1. Validate form inputs match rules
2. Check Supabase connection
3. Verify table permissions
4. Review console errors

### Styling Issues
1. Ensure Tailwind CSS is imported
2. Rebuild if custom classes missing
3. Check CSS specificity conflicts
4. Verify class names are correct

## Support & Resources

- React Documentation: https://react.dev
- Supabase Docs: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com
- TypeScript: https://www.typescriptlang.org
