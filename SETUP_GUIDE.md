# ShopHub Setup Guide

## Prerequisites

Before starting, ensure you have:
- Node.js 16+ installed
- npm or yarn package manager
- A Supabase account (free tier available at https://supabase.com)

## Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd project

# Or extract the project files if downloaded as zip
cd project
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up Supabase

### Create a Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Enter project name and password
4. Select a region close to you
5. Wait for project creation to complete

### Get Connection Details

1. Go to Project Settings → API
2. Copy your **Project URL** (VITE_SUPABASE_URL)
3. Copy your **Anon Key** (VITE_SUPABASE_ANON_KEY)
4. Keep these safe - you'll need them next

### Create Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Copy the entire migration from `supabase/migrations/20260122131100_create_shopping_platform_schema.sql`
3. Paste it into a new SQL query
4. Click "Run"
5. Wait for completion (you'll see a success message)

### Add Sample Products (Optional)

1. Go to SQL Editor again
2. Copy and paste this SQL:

```sql
INSERT INTO products (name, description, price, image_url, category, stock, rating) VALUES
('Wireless Headphones Pro', 'Premium noise-cancelling wireless headphones with 30-hour battery life', 199.99, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800', 'electronics', 25, 4.8),
('Smart Watch Ultra', 'Advanced fitness tracking smartwatch with heart rate monitoring', 349.99, 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800', 'electronics', 18, 4.7),
('Portable Bluetooth Speaker', 'Waterproof portable speaker with 360-degree sound', 79.99, 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800', 'electronics', 42, 4.6),
('Laptop Backpack', 'Durable laptop backpack with USB charging port', 59.99, 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800', 'accessories', 35, 4.5),
('Wireless Gaming Mouse', 'High-precision gaming mouse with RGB lighting', 89.99, 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800', 'electronics', 28, 4.9),
('Mechanical Keyboard', 'RGB mechanical gaming keyboard with tactile switches', 129.99, 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=800', 'electronics', 22, 4.7),
('USB-C Hub Adapter', '7-in-1 USB-C hub with HDMI and card reader', 45.99, 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=800', 'accessories', 50, 4.4),
('Wireless Earbuds', 'True wireless earbuds with active noise cancellation', 149.99, 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=800', 'electronics', 45, 4.8),
('Phone Stand Holder', 'Adjustable phone stand for desk', 24.99, 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800', 'accessories', 60, 4.3),
('Portable Power Bank', '20000mAh power bank with fast charging', 39.99, 'https://images.pexels.com/photos/4316/smartphone-pen-calendar-business.jpg?auto=compress&cs=tinysrgb&w=800', 'electronics', 38, 4.6),
('Laptop Sleeve Case', 'Protective laptop sleeve with water-resistant exterior', 29.99, 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800', 'accessories', 55, 4.4),
('Desk Lamp LED', 'Modern LED desk lamp with adjustable brightness', 54.99, 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800', 'home', 30, 4.5);
```

3. Click "Run"

## Step 4: Configure Environment Variables

1. Open the `.env` file in the project root
2. Update these values with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 3.

## Step 5: Run Development Server

```bash
npm run dev
```

You'll see output like:
```
  VITE v5.4.8  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

Open http://localhost:5173 in your browser.

## Step 6: Test the Application

1. **Browse Products**: You should see product cards in the grid
2. **Search**: Try typing in the search box
3. **Filter**: Click category buttons to filter
4. **View Details**: Click a product to see details
5. **Add to Cart**: Click "Add" to add items
6. **Open Cart**: Click the cart icon in the header
7. **Checkout**: Click "Proceed to Checkout"
8. **Complete Order**: Fill the form and click "Place Order"

## Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment variables not loading
1. Ensure `.env` file is in project root
2. Restart dev server after updating `.env`
3. Check for typos in variable names
4. Don't quote the values in `.env`

### Products not showing
1. Verify database tables exist (check Supabase dashboard)
2. Check browser console (F12) for errors
3. Verify RLS policies are correct
4. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct

### Cart not updating
1. Check browser console for JavaScript errors
2. Ensure CartProvider wraps the App component
3. Try clearing browser localStorage

### Checkout failing
1. Verify all form fields are valid
2. Check Supabase connection is working
3. Look at console errors for details
4. Ensure order table permissions allow inserts

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

## Deployment Options

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Go to vercel.com and import repository
3. Set environment variables in Vercel dashboard
4. Deploy

### Deploy to Netlify
1. Connect GitHub repository
2. Add build command: `npm run build`
3. Add publish directory: `dist`
4. Set environment variables
5. Deploy

### Deploy to Firebase
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run: `firebase init hosting`
3. Set public directory to `dist`
4. Run: `npm run build && firebase deploy`

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "VITE_SUPABASE_URL is not defined" | Check .env file exists and restart dev server |
| Products load but cart doesn't work | Clear browser cache and hard refresh |
| Checkout form not submitting | Check all form fields are filled correctly |
| Supabase connection timeout | Check project is active in Supabase dashboard |
| Styles not loading | Run `npm install` again and restart dev server |

## Next Steps

1. Customize the branding (colors, logo, company name)
2. Add more products through Supabase dashboard
3. Set up payment processing (Stripe, PayPal)
4. Implement user authentication
5. Add order tracking features
6. Set up email notifications
7. Deploy to production

## Support

For issues with:
- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Tailwind**: https://tailwindcss.com

## Security Notes

1. Never commit `.env` file to version control
2. Keep VITE_SUPABASE_ANON_KEY safe but it's meant to be public
3. For sensitive operations, use service role key on backend only
4. Enable RLS policies for all tables in production
5. Add proper authentication before going live
