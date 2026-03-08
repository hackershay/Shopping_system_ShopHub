import { X, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Checkout({ isOpen, onClose }: CheckoutProps) {
  const { cart, getCartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Shipping address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          total: getCartTotal(),
          status: 'pending',
        })
        .select()
        .maybeSingle();

      if (orderError) throw orderError;
      if (!order) throw new Error('Failed to create order');

      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setIsSuccess(true);
      clearCart();

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({ name: '', email: '', phone: '', address: '' });
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to place order. Please try again.';
      setError(message);
      console.error('Error creating order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h3>
            <p className="text-gray-600">
              Thank you for your order. We'll send a confirmation email shortly.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-blue-600">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) {
                      setErrors({ ...errors, name: undefined });
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) {
                      setErrors({ ...errors, email: undefined });
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) {
                      setErrors({ ...errors, phone: undefined });
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (errors.address) {
                      setErrors({ ...errors, address: undefined });
                    }
                  }}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all ${
                    errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="123 Main St, City, State, ZIP"
                />
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
