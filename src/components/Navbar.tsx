import { Link, useLocation } from 'react-router-dom';
import { Coffee, ShoppingCart, ChefHat, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { to: '/menu', label: 'Menu', icon: Coffee },
  { to: '/pos', label: 'POS', icon: ShoppingCart },
  { to: '/kitchen', label: 'Kitchen', icon: ChefHat },
  { to: '/admin', label: 'Admin', icon: Settings },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-latte/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-espresso to-espresso-light rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Coffee className="w-5 h-5 text-cream" />
            </div>
            <span className="font-display text-2xl font-bold text-espresso tracking-tight">
              Caffinity
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-espresso text-cream shadow-md'
                      : 'text-espresso-light hover:bg-latte/40 hover:text-espresso'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-espresso hover:bg-latte/40 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-latte/30 px-4 pb-4">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all my-1
                  ${isActive
                    ? 'bg-espresso text-cream shadow-md'
                    : 'text-espresso-light hover:bg-latte/40'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
