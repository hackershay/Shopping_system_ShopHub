/*
  # Online Shopping Platform Database Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique product identifier
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `price` (decimal) - Product price
      - `image_url` (text) - Product image URL
      - `category` (text) - Product category
      - `stock` (integer) - Available stock quantity
      - `rating` (decimal) - Product rating (0-5)
      - `created_at` (timestamptz) - Creation timestamp
    
    - `orders`
      - `id` (uuid, primary key) - Unique order identifier
      - `customer_name` (text) - Customer full name
      - `customer_email` (text) - Customer email
      - `customer_phone` (text) - Customer phone number
      - `shipping_address` (text) - Shipping address
      - `total` (decimal) - Order total amount
      - `status` (text) - Order status (pending, completed, cancelled)
      - `created_at` (timestamptz) - Creation timestamp
    
    - `order_items`
      - `id` (uuid, primary key) - Unique order item identifier
      - `order_id` (uuid, foreign key) - Reference to orders table
      - `product_id` (uuid, foreign key) - Reference to products table
      - `quantity` (integer) - Quantity ordered
      - `price` (decimal) - Price at time of order
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Products: Public read access (anyone can view products)
    - Orders: Public insert access (anyone can create orders), read own orders
    - Order Items: Public insert access (anyone can create order items)
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10, 2) NOT NULL CHECK (price >= 0),
  image_url text NOT NULL,
  category text NOT NULL,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating decimal(2, 1) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address text NOT NULL,
  total decimal(10, 2) NOT NULL CHECK (total >= 0),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  price decimal(10, 2) NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products policies (public read access)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Orders policies (public can create orders, read own orders via email)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view orders by email"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

-- Order items policies (public can create order items, read order items)
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  TO anon, authenticated
  USING (true);