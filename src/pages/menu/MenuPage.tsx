import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import type { Category } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { Search, Plus, Minus, ShoppingBag, Star, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories: (Category | 'All')[] = ['All', 'Espresso', 'Cappuccino', 'Latte', 'Iced Coffee', 'Pastries', 'Desserts'];

const categoryEmojis: Record<string, string> = {
  All: '☕',
  Espresso: '⚡',
  Cappuccino: '🍵',
  Latte: '🥛',
  'Iced Coffee': '🧊',
  Pastries: '🥐',
  Desserts: '🍰',
};

const priceRanges = [
  { label: 'All Prices', min: 0, max: 100 },
  { label: 'Under €4', min: 0, max: 4 },
  { label: '€4 - €6', min: 4, max: 6 },
  { label: 'Over €6', min: 6, max: 100 },
];

export default function MenuPage() {
  const { products, cart, addToCart, updateCartQuantity, clearCart } = useStore();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(0);
  const [showPopular, setShowPopular] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.available) return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      const range = priceRanges[priceRange];
      if (p.price < range.min || p.price > range.max) return false;
      if (showPopular && !p.popular) return false;
      return true;
    });
  }, [products, selectedCategory, searchQuery, priceRange, showPopular]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getCartQuantity = (productId: string) => {
    const item = cart.find((c) => c.product.id === productId);
    return item ? item.quantity : 0;
  };

  const { placeOrder } = useStore();

  const handlePlaceOrder = () => {
    const order = placeOrder(Math.floor(Math.random() * 20) + 1);
    if (order) {
      navigate(`/payment/${order.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-espresso via-espresso-light to-espresso px-4 pt-6 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 text-6xl">☕</div>
          <div className="absolute bottom-4 left-12 text-4xl">🫘</div>
          <div className="absolute top-12 left-1/2 text-3xl">✨</div>
        </div>
        <div className="max-w-2xl mx-auto relative z-10">
          <h1 className="font-display text-3xl font-bold text-cream text-center">Il Nostro Menu</h1>
          <p className="text-gold-light text-center mt-1 text-sm">Discover the taste of Italy</p>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
            <input
              type="text"
              placeholder="Search our menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-2xl bg-white/95 text-espresso placeholder-warm-gray focus:outline-none focus:ring-2 focus:ring-gold shadow-lg text-sm"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors ${showFilters ? 'bg-tomato text-white' : 'bg-latte/50 text-espresso-light hover:bg-latte'}`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 -mt-8 relative z-10 pb-28">
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 border border-latte/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-espresso">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-warm-gray hover:text-espresso">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {priceRanges.map((range, i) => (
                <button
                  key={range.label}
                  onClick={() => setPriceRange(i)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all
                    ${priceRange === i ? 'bg-olive text-white shadow-md' : 'bg-cream text-espresso-light hover:bg-latte/50'}`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPopular(!showPopular)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all
                ${showPopular ? 'bg-gold text-espresso shadow-md' : 'bg-cream text-espresso-light hover:bg-latte/50'}`}
            >
              <Star className="w-3 h-3" />
              Popular Only
            </button>
          </div>
        )}

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0
                ${selectedCategory === cat
                  ? 'bg-espresso text-cream shadow-lg scale-105'
                  : 'bg-white text-espresso-light hover:bg-latte/40 shadow-sm border border-latte/30'
                }`}
            >
              <span>{categoryEmojis[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => {
            const qty = getCartQuantity(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-latte/20 group"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.popular && (
                    <div className="absolute top-2 left-2 bg-gold/90 text-espresso text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      Popular
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-espresso/80 text-cream text-xs font-bold px-2 py-1 rounded-xl">
                    {formatCurrency(product.price)}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-espresso leading-tight">{product.name}</h3>
                  <p className="text-[11px] text-warm-gray mt-1 line-clamp-2">{product.description}</p>
                  <div className="mt-2">
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-olive to-olive-light text-white py-2 rounded-xl text-xs font-semibold hover:shadow-md transition-all active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-cream rounded-xl p-1">
                        <button
                          onClick={() => updateCartQuantity(product.id, qty - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-tomato hover:bg-tomato/10 transition-colors shadow-sm"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold text-espresso">{qty}</span>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-8 h-8 flex items-center justify-center bg-olive text-white rounded-lg hover:bg-olive-light transition-colors shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-warm-gray font-medium">No items match your filters</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setPriceRange(0); setShowPopular(false); }}
              className="mt-2 text-sm text-olive font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Sticky Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-white via-white to-white/80">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setShowCart(true)}
              className="w-full bg-gradient-to-r from-espresso to-espresso-light text-cream py-4 rounded-2xl flex items-center justify-between px-6 shadow-xl hover:shadow-2xl transition-shadow active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-tomato text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                </div>
                <span className="font-semibold">View Cart</span>
              </div>
              <span className="font-bold text-lg">{formatCurrency(cartTotal)}</span>
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col animate-[slideUp_0.3s_ease-out]">
            {/* Cart Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-latte/30">
              <h2 className="font-display text-xl font-bold text-espresso">Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="p-2 rounded-xl hover:bg-latte/30 transition-colors">
                <X className="w-5 h-5 text-espresso" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 bg-cream rounded-2xl p-3">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-espresso truncate">{item.product.name}</h4>
                    <p className="text-xs text-warm-gray">{formatCurrency(item.product.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-tomato shadow-sm hover:bg-tomato/10"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center bg-olive text-white rounded-lg shadow-sm hover:bg-olive-light"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-bold text-sm text-espresso w-14 text-right">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="border-t border-latte/30 px-6 py-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-warm-gray font-medium">Total</span>
                <span className="text-2xl font-bold text-espresso">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { clearCart(); setShowCart(false); }}
                  className="flex-1 py-3 rounded-2xl border-2 border-latte text-warm-gray font-semibold hover:border-tomato hover:text-tomato transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => { setShowCart(false); handlePlaceOrder(); }}
                  className="flex-2 py-3 px-8 rounded-2xl bg-gradient-to-r from-olive to-olive-light text-white font-semibold shadow-lg hover:shadow-xl transition-shadow active:scale-[0.98]"
                >
                  Place Order 🎉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
