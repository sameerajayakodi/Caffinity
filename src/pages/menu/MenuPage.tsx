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
      {/* Hero Header */}
      <div className="relative py-14 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80" 
            alt="Coffee beans background" 
            className="w-full rounded-2xl h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/80 to-espresso/60 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream mb-3 tracking-wide">
            Il Nostro Menu
          </h1>
          <p className="text-gold-light text-base md:text-lg max-w-xl mx-auto font-medium mb-8">
            Discover the authentico taste of Italy in every sip. Carefully roasted, flawlessly poured.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
            <input
              type="text"
              placeholder="Cerca il tuo caffè preferito..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-14 py-4 rounded-full bg-white/95 text-espresso placeholder-warm-gray focus:outline-none focus:ring-4 focus:ring-gold/30 shadow-2xl text-base transition-all"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-colors ${showFilters ? 'bg-tomato text-white' : 'bg-latte text-espresso-light hover:bg-latte-dark hover:text-espresso'}`}
              title="Filters"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-4 overflow-x-auto pt-8 scrollbar-hide px-2 justify-start md:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="flex flex-col items-center gap-3 shrink-0 group focus:outline-none"
              >
                <div 
                  className={`w-[72px] h-[72px] rounded-full flex items-center justify-center text-3xl transition-all duration-300 relative
                    ${selectedCategory === cat 
                      ? 'bg-gradient-to-br from-cream to-white text-espresso shadow-[0_8px_20px_rgb(255,255,255,0.2)] scale-110 -translate-y-2 border-2 border-white' 
                      : 'bg-white/10 backdrop-blur-sm border text-white border-white/20 shadow-sm group-hover:bg-white/20 group-hover:-translate-y-1'
                    }`}
                >
                  {selectedCategory === cat && (
                    <span className="absolute inset-0 rounded-full border-4 border-white/40 animate-ping opacity-50"></span>
                  )}
                  <span className={selectedCategory === cat ? 'drop-shadow-sm' : ''}>
                    {categoryEmojis[cat]}
                  </span>
                </div>
                <span 
                  className={`text-[12px] uppercase tracking-wider font-bold whitespace-nowrap transition-colors duration-300
                    ${selectedCategory === cat ? 'text-white drop-shadow-md' : 'text-white/70 group-hover:text-white'}`}
                >
                  {cat}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-xl p-5 mb-6 border border-latte/30 animate-[slideDown_0.2s_ease-out] max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-espresso uppercase tracking-wider">Refine Options</h3>
              <button onClick={() => setShowFilters(false)} className="text-warm-gray hover:text-tomato transition-colors p-1 bg-latte/20 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {priceRanges.map((range, i) => (
                <button
                  key={range.label}
                  onClick={() => setPriceRange(i)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                    ${priceRange === i ? 'bg-olive text-white shadow-md scale-105' : 'bg-latte/30 text-espresso-light hover:bg-latte/60'}`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPopular(!showPopular)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                ${showPopular ? 'bg-gold text-espresso shadow-md scale-105' : 'bg-latte/30 text-espresso-light hover:bg-latte/60'}`}
            >
              <Star className="w-3.5 h-3.5" />
              Popular Only
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 mt-8 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const qty = getCartQuantity(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-latte/20 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {product.popular && (
                    <div className="absolute top-3 left-3 bg-gold/95 backdrop-blur-sm text-espresso text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-current" />
                      Popular
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-espresso text-sm font-bold px-3 py-1 rounded-full shadow-md">
                    {formatCurrency(product.price)}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-display font-bold text-lg text-espresso line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-warm-gray mt-1 line-clamp-2 flex-grow">{product.description}</p>
                  <div className="mt-4 pt-4 border-t border-latte/30">
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-olive to-olive-light text-white py-3 rounded-xl text-sm font-semibold shadow-md inline-flex hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <Plus className="w-4 h-4" />
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-cream rounded-2xl p-1.5 border border-latte/30">
                        <button
                          onClick={() => updateCartQuantity(product.id, qty - 1)}
                          className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-tomato hover:bg-tomato/10 transition-colors shadow-sm"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="text-lg font-bold text-espresso w-8 text-center">{qty}</span>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-10 h-10 flex items-center justify-center bg-olive text-white rounded-xl hover:bg-olive-light transition-colors shadow-sm"
                        >
                          <Plus className="w-5 h-5" />
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

      {/* Sticky Cart Bar for Mobile / Floating Cart Bar for Desktop */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6 md:left-auto md:w-[400px] pointer-events-none">
          <div className="pointer-events-auto">
            <button
              onClick={() => setShowCart(true)}
              className="w-full bg-gradient-to-r from-espresso to-espresso-light text-cream py-4 rounded-full flex items-center justify-between px-6 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.4)] transition-all transform hover:-translate-y-1 active:scale-[0.98] border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="relative bg-white/10 p-2.5 rounded-full">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-tomato text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-espresso-light shadow-sm">
                    {cartCount}
                  </span>
                </div>
                <div className="text-left hidden xs:block">
                  <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Your Order</p>
                  <p className="font-semibold text-sm">View Cart</p>
                </div>
                <div className="text-left xs:hidden font-semibold">View Cart</div>
              </div>
              <span className="font-bold text-xl">{formatCurrency(cartTotal)}</span>
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-espresso/60 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)} />
          <div className="relative bg-white w-full max-w-lg md:rounded-3xl rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col animate-[slideUp_0.3s_ease-out] md:animate-[fadeIn_0.2s_ease-out]">
            {/* Cart Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-latte/30 bg-cream/50 md:rounded-t-3xl rounded-t-3xl">
              <h2 className="font-display text-xl font-bold text-espresso">Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="p-2 rounded-xl hover:bg-latte/30 transition-colors">
                <X className="w-5 h-5 text-espresso" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 bg-white border border-latte/20 shadow-sm rounded-2xl p-3">
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base text-espresso truncate">{item.product.name}</h4>
                    <p className="text-sm text-warm-gray mb-2">{formatCurrency(item.product.price)} each</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-cream rounded-lg p-1 border border-latte/30">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-tomato shadow-sm hover:bg-tomato/10 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold w-8 text-center text-espresso">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-olive text-white rounded-md shadow-sm hover:bg-olive-light transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0 pr-2">
                    <p className="font-bold text-lg text-espresso">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="border-t border-latte/30 px-6 py-5 bg-cream/30 md:rounded-b-3xl rounded-b-none">
              <div className="flex justify-between items-center mb-5 bg-white p-4 rounded-xl shadow-sm border border-latte/20">
                <span className="text-warm-gray font-semibold">Total Amount</span>
                <span className="text-2xl font-display font-bold text-espresso">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { clearCart(); setShowCart(false); }}
                  className="w-1/3 py-4 rounded-2xl border-2 border-latte text-warm-gray font-semibold hover:border-tomato hover:text-tomato hover:bg-tomato/5 transition-all"
                >
                  Clear
                </button>
                <button
                  onClick={() => { setShowCart(false); handlePlaceOrder(); }}
                  className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-olive to-olive-light text-white font-semibold shadow-[0_8px_20px_rgb(209,215,160,0.5)] hover:shadow-[0_8px_25px_rgb(209,215,160,0.7)] transition-all hover:-translate-y-0.5 active:scale-[0.98] text-lg flex justify-center items-center gap-2"
                >
                  Checkout <span>🇮🇹</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(10%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-10%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
