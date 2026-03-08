import { useState, useEffect, useMemo } from 'react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { supabase } from './lib/supabase';
import type { Product } from './lib/database.types';
import { Filter, Search, AlertCircle } from 'lucide-react';

function AppContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);


  const fetchProducts = async () => {
    try {
      setError(null);
      const { data, error: dbError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setProducts(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load products';
      setError(message);
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery]);

  const categories = [
    'all',
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Amazing Products
          </h2>
          <p className="text-gray-600 mb-4">
            Browse our curated collection of premium items
          </p>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="mb-8 flex items-center gap-4 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </main>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
