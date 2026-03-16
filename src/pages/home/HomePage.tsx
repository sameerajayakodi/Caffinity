import { Link } from 'react-router-dom';
import { Coffee, ShoppingCart, ChefHat, Settings, ArrowRight, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-espresso via-espresso-light to-espresso overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-9xl">☕</div>
          <div className="absolute bottom-10 right-10 text-8xl">🫘</div>
          <div className="absolute top-1/3 right-1/4 text-6xl">✨</div>
          <div className="absolute bottom-1/4 left-1/3 text-7xl">🍵</div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-gold-light text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                Italian Coffee Excellence
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-cream leading-tight">
                Welcome to<br />
                <span className="text-gold">Caffinity</span>
              </h1>
              <p className="text-gold-light/80 text-lg mt-4 max-w-md">
                A complete coffee shop management system. From digital menus to kitchen displays — 
                crafted with the warmth of Italian hospitality.
              </p>
              <div className="flex gap-4 mt-8">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-olive to-olive-light text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  <Coffee className="w-5 h-5" />
                  Browse Menu
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/pos"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-cream border border-white/20 rounded-2xl font-semibold hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Open POS
                </Link>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center">
                <p className="text-cream font-medium mb-4">Scan to view menu</p>
                <div className="bg-white p-5 rounded-2xl inline-block shadow-xl">
                  <QRCodeSVG
                    value={`${window.location.origin}/menu`}
                    size={180}
                    fgColor="#3E2723"
                    bgColor="#FFFFFF"
                  />
                </div>
                <p className="text-gold-light/60 text-xs mt-4">Point your camera at the QR code</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-espresso">System Modules</h2>
          <p className="text-warm-gray mt-2">Everything you need to run your café</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              to: '/menu',
              icon: Coffee,
              title: 'Digital Menu',
              description: 'Scannable QR menu with categories, filters, and mobile-first design.',
              color: 'from-olive to-olive-light',
              emoji: '☕',
            },
            {
              to: '/pos',
              icon: ShoppingCart,
              title: 'POS System',
              description: 'Fast cashier interface with quick-add items and order management.',
              color: 'from-espresso to-espresso-light',
              emoji: '🛒',
            },
            {
              to: '/kitchen',
              icon: ChefHat,
              title: 'Kitchen Display',
              description: 'Real-time order tracking with status updates for kitchen staff.',
              color: 'from-gold to-gold-light',
              emoji: '👨‍🍳',
            },
            {
              to: '/admin',
              icon: Settings,
              title: 'Admin Portal',
              description: 'Manage products, categories, pricing, and availability.',
              color: 'from-tomato to-tomato-light',
              emoji: '⚙️',
            },
          ].map(({ to, icon: Icon, title, description, color }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-2xl p-6 border border-latte/20 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-lg font-bold text-espresso mb-2">{title}</h3>
              <p className="text-sm text-warm-gray leading-relaxed">{description}</p>
              <div className="flex items-center gap-1 text-olive text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
                Open {title}
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-latte/30 py-8 text-center">
        <p className="text-warm-gray text-sm">
          Crafted with ❤️ — <span className="font-display font-semibold text-espresso">Caffinity</span> Coffee Shop Management
        </p>
      </div>
    </div>
  );
}
