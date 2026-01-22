import { X, ShoppingCart, Star, Package } from 'lucide-react';
import type { Product } from '../lib/database.types';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square rounded-xl overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold text-gray-700">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      Out of Stock
                    </span>
                  )}
                </span>
              </div>

              <div className="text-4xl font-bold text-blue-600 mb-6">
                ${product.price.toFixed(2)}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-700 font-medium">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
