import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/helpers';
import type { Category } from '../../types';
import { Plus, Minus, Trash2, ShoppingCart, CreditCard, Search, X, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const categories: Category[] = ['Espresso', 'Cappuccino', 'Latte', 'Iced Coffee', 'Pastries', 'Desserts'];

const categoryIcons: Record<Category, string> = {
  Espresso: '⚡',
  Cappuccino: '🍵',
  Latte: '🥛',
  'Iced Coffee': '🧊',
  Pastries: '🥐',
  Desserts: '🍰',
};

export default function POSPage() {
  const { products, customers, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder } = useStore();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>('Espresso');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderResult, setOrderResult] = useState<{ orderId: string; total: number; customerId?: string } | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  const filteredProducts = products.filter((p) => {
    if (!p.available) return false;
    if (searchQuery) return p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return p.category === activeCategory;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    const order = placeOrder(undefined, selectedCustomerId || undefined);
    if (order) {
      setOrderResult({ orderId: order.id, total: order.total, customerId: selectedCustomerId || undefined });
      setSelectedCustomerId('');
    }
  };

  if (orderResult) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-latte/20">
          <div className="w-20 h-20 bg-gradient-to-br from-olive to-olive-light rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-espresso mb-1">Order Placed!</h2>
          <p className="text-warm-gray mb-6">Hand this to the customer for payment</p>

          <div className="bg-cream rounded-2xl p-6 mb-6">
            <p className="text-sm text-warm-gray mb-1">Order ID</p>
            <p className="text-2xl font-bold text-espresso mb-4">{orderResult.orderId}</p>

            <div className="bg-white p-4 rounded-2xl inline-block shadow-sm mb-4">
              <QRCodeSVG
                value={`${window.location.origin}/payment/${orderResult.orderId}`}
                size={180}
                fgColor="#3E2723"
                bgColor="#FFFFFF"
              />
            </div>

            <p className="text-sm text-warm-gray mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-olive">{formatCurrency(orderResult.total)}</p>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setOrderResult(null)}
              className="flex-1 py-3 rounded-2xl bg-latte/20 text-espresso font-semibold hover:bg-latte/40 transition-colors"
            >
              New Order
            </button>
            <button
              onClick={() => navigate(`/payment/${orderResult.orderId}`)}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-olive to-olive-light text-white font-semibold hover:shadow-lg transition-shadow"
            >
              Payment Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream flex">
      {/* Left: Product Catalog */}
      <div className="flex-1 flex flex-col">
        {/* POS Header */}
        <div className="bg-white border-b border-latte/30 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-espresso">Point of Sale</h1>
              <p className="text-warm-gray text-sm">Select items to add to order</p>
            </div>
            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
              <input
                type="text"
                placeholder="Quick search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-cream text-espresso placeholder-warm-gray text-sm focus:outline-none focus:ring-2 focus:ring-gold border border-latte/30"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-warm-gray" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          {!searchQuery && (
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0
                    ${activeCategory === cat
                      ? 'bg-espresso text-cream shadow-md'
                      : 'bg-cream text-espresso-light hover:bg-latte/50 border border-latte/30'
                    }`}
                >
                  <span>{categoryIcons[cat]}</span>
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group text-left border border-latte/10 active:scale-95"
              >
                <div className="h-24 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-espresso truncate">{product.name}</h3>
                  <p className="text-olive font-bold text-sm mt-1">{formatCurrency(product.price)}</p>
                </div>
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-2">🔍</p>
              <p className="text-warm-gray">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="w-96 bg-white border-l border-latte/30 flex flex-col shadow-xl">
        <div className="px-6 py-4 border-b border-latte/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-espresso" />
              <h2 className="font-display text-lg font-bold text-espresso">Current Order</h2>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-tomato hover:bg-tomato/10 px-2 py-1 rounded transition-colors font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="mt-4 relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-cream text-espresso text-sm border border-latte/30 focus:outline-none focus:ring-2 focus:ring-gold appearance-none"
            >
              <option value="">Guest (No Customer linked)</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.points} pts)</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🛒</div>
              <p className="text-warm-gray font-medium">No items yet</p>
              <p className="text-sm text-warm-gray/70 mt-1">Click products to add them</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 bg-cream rounded-xl p-3">
                  <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-espresso truncate">{item.product.name}</h4>
                    <p className="text-xs text-warm-gray">{formatCurrency(item.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-espresso hover:bg-tomato/10 hover:text-tomato shadow-sm transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-olive text-white hover:bg-olive-light shadow-sm transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-warm-gray hover:text-tomato transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Footer */}
        {cart.length > 0 && (
          <div className="border-t border-latte/20 px-6 py-4 space-y-4 bg-cream/50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-warm-gray">Subtotal</span>
                <span className="font-medium text-espresso">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warm-gray">Tax (10%)</span>
                <span className="font-medium text-espresso">{formatCurrency(cartTotal * 0.1)}</span>
              </div>
              <div className="h-px bg-latte/50" />
              <div className="flex justify-between">
                <span className="font-semibold text-espresso">Total</span>
                <span className="text-xl font-bold text-olive">{formatCurrency(cartTotal * 1.1)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-espresso to-espresso-light text-cream font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
            >
              Place Order 🎉
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
