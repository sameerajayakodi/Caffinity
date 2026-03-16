import { useState } from 'react';
import { useStore } from '../../store/useStore';
import type { Product, Category } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import {
  Plus, Edit3, Trash2, X, Save, Upload, Search,
  Package, BarChart3, Coffee, Settings, Eye, EyeOff,
  LayoutGrid, List, Users, CreditCard, LayoutDashboard,
  TrendingUp, Clock, ChevronRight, ShoppingBag
} from 'lucide-react';

const categories: Category[] = ['Espresso', 'Cappuccino', 'Latte', 'Iced Coffee', 'Pastries', 'Desserts'];

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: Category;
  image: string;
  available: boolean;
  popular: boolean;
}

const emptyForm: ProductForm = {
  name: '',
  description: '',
  price: '',
  category: 'Espresso',
  image: '',
  available: true,
  popular: false,
};

interface CustomerFormState {
  name: string;
  email: string;
  phone: string;
  hasSavedCard: boolean;
  cardNumber: string;
  cardBrand: 'visa' | 'mastercard' | 'amex';
}

const emptyCustomerForm: CustomerFormState = {
  name: '',
  email: '',
  phone: '',
  hasSavedCard: false,
  cardNumber: '',
  cardBrand: 'visa',
};

export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct, orders, customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  
  // App State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'customers'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Products State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(emptyForm);
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [imagePreview, setImagePreview] = useState<string>('');

  // Customers State
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [customerForm, setCustomerForm] = useState<CustomerFormState>(emptyCustomerForm);

  const filteredProducts = products.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterCategory !== 'All' && p.category !== filterCategory) return false;
    return true;
  });

  const filteredCustomers = customers.filter((c) => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Stats
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.available).length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Handlers - Products
  const handleOpenAddProduct = () => {
    setProductForm(emptyForm);
    setEditingProductId(null);
    setImagePreview('');
    setShowProductForm(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      available: product.available,
      popular: product.popular,
    });
    setEditingProductId(product.id);
    setImagePreview(product.image);
    setShowProductForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProductForm((prev) => ({ ...prev, image: result }));
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(productForm.price);
    if (isNaN(price) || price <= 0) return;
    if (!productForm.name.trim()) return;

    const productData = {
      name: productForm.name.trim(),
      description: productForm.description.trim(),
      price,
      category: productForm.category,
      image: productForm.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      available: productForm.available,
      popular: productForm.popular,
    };

    if (editingProductId) {
      updateProduct(editingProductId, productData);
    } else {
      addProduct(productData);
    }

    setShowProductForm(false);
    setEditingProductId(null);
    setProductForm(emptyForm);
    setImagePreview('');
  };

  // Handlers - Customers
  const handleOpenAddCustomer = () => {
    setCustomerForm(emptyCustomerForm);
    setEditingCustomerId(null);
    setShowCustomerForm(true);
  };

  const handleOpenEditCustomer = (customer: any) => {
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      hasSavedCard: !!customer.savedPaymentMethod,
      cardNumber: customer.savedPaymentMethod ? `**** **** **** ${customer.savedPaymentMethod.last4}` : '',
      cardBrand: customer.savedPaymentMethod?.brand || 'visa',
    });
    setEditingCustomerId(customer.id);
    setShowCustomerForm(true);
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name.trim() || !customerForm.email.trim()) return;

    let savedPaymentMethod = undefined;
    if (customerForm.hasSavedCard && customerForm.cardNumber) {
      // simulate extracting last 4
      const cleanNum = customerForm.cardNumber.replace(/\D/g, '');
      const last4 = cleanNum.length >= 4 ? cleanNum.slice(-4) : '1234';
      savedPaymentMethod = { last4, brand: customerForm.cardBrand };
    }

    const customerData = {
      name: customerForm.name.trim(),
      email: customerForm.email.trim(),
      phone: customerForm.phone.trim(),
      savedPaymentMethod
    };

    if (editingCustomerId) {
      updateCustomer(editingCustomerId, customerData);
    } else {
      addCustomer(customerData);
    }

    setShowCustomerForm(false);
    setEditingCustomerId(null);
    setCustomerForm(emptyCustomerForm);
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-latte/30 p-4 hidden lg:flex flex-col">
        <div className="mb-6">
          <h2 className="font-display text-lg font-bold text-espresso flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Admin Panel
          </h2>
          <p className="text-xs text-warm-gray mt-0.5">Manage your café</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
              ${activeTab === 'dashboard' ? 'bg-espresso text-cream shadow-sm' : 'text-warm-gray hover:bg-latte/30 hover:text-espresso'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                ${activeTab === 'products' ? 'bg-espresso text-cream shadow-sm' : 'text-warm-gray hover:bg-latte/30 hover:text-espresso'}`}
            >
              <Package className="w-5 h-5" />
              Products
            </button>
            
            {activeTab === 'products' && (
              <div className="ml-5 pl-4 border-l-2 border-latte/30 space-y-1 py-1 animate-fade-in">
                <button
                  onClick={() => setFilterCategory('All')}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${filterCategory === 'All' ? 'bg-latte text-espresso font-semibold' : 'text-warm-gray hover:bg-latte/30 hover:text-espresso'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${filterCategory === cat ? 'bg-latte text-espresso font-semibold' : 'text-warm-gray hover:bg-latte/30 hover:text-espresso'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
              ${activeTab === 'customers' ? 'bg-espresso text-cream shadow-sm' : 'text-warm-gray hover:bg-latte/30 hover:text-espresso'}`}
          >
            <Users className="w-5 h-5" />
            Customers
          </button>
        </nav>
        </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-cream/30">
        {activeTab === 'dashboard' ? (
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-espresso">Dashboard Overview</h1>
              <p className="text-warm-gray mt-1">Here's what is happening in your store today.</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-white rounded-3xl p-6 border border-latte/20 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center justify-between mb-4">
                   <div className="p-3 bg-olive/10 rounded-2xl">
                     <TrendingUp className="w-6 h-6 text-olive" />
                   </div>
                   <span className="text-xs font-bold text-olive bg-olive/10 px-2.5 py-1 rounded-lg">+12%</span>
                 </div>
                 <h3 className="text-sm font-semibold text-warm-gray">Total Revenue</h3>
                 <p className="text-3xl font-bold text-espresso mt-1">{formatCurrency(totalRevenue)}</p>
               </div>
               
               <div className="bg-white rounded-3xl p-6 border border-latte/20 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center justify-between mb-4">
                   <div className="p-3 bg-gold/10 rounded-2xl">
                     <ShoppingBag className="w-6 h-6 text-gold" />
                   </div>
                   <span className="text-xs font-bold text-gold bg-gold/10 px-2.5 py-1 rounded-lg">+5%</span>
                 </div>
                 <h3 className="text-sm font-semibold text-warm-gray">Total Orders</h3>
                 <p className="text-3xl font-bold text-espresso mt-1">{totalOrders}</p>
               </div>
               
               <div className="bg-white rounded-3xl p-6 border border-latte/20 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center justify-between mb-4">
                   <div className="p-3 bg-tomato/10 rounded-2xl">
                     <Users className="w-6 h-6 text-tomato" />
                   </div>
                   <span className="text-xs font-bold text-tomato bg-tomato/10 px-2.5 py-1 rounded-lg">+18%</span>
                 </div>
                 <h3 className="text-sm font-semibold text-warm-gray">New Customers</h3>
                 <p className="text-3xl font-bold text-espresso mt-1">{customers.length}</p>
               </div>
               
               <div className="bg-white rounded-3xl p-6 border border-latte/20 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center justify-between mb-4">
                   <div className="p-3 bg-blue-500/10 rounded-2xl">
                     <Package className="w-6 h-6 text-blue-500" />
                   </div>
                 </div>
                 <h3 className="text-sm font-semibold text-warm-gray">Active Products</h3>
                 <p className="text-3xl font-bold text-espresso mt-1">{availableProducts}</p>
               </div>
            </div>

            {/* Recent Orders & Popular Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl border border-latte/20 shadow-sm p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-espresso">Recent Orders</h2>
                  <button className="text-sm text-olive font-semibold hover:text-olive-light transition-colors flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {orders.slice(-5).reverse().map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-cream/50 border border-latte/10 hover:border-latte/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-latte/20 flex items-center justify-center text-espresso font-bold text-sm">
                          #{order.id.slice(0,4)}
                        </div>
                        <div>
                          <p className="font-semibold text-espresso text-sm flex items-center gap-2">
                            Order {order.id.slice(0,6)}
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider
                              ${order.status === 'Completed' ? 'bg-olive/10 text-olive' : 'bg-gold/10 text-gold'}`}>
                              {order.status}
                            </span>
                          </p>
                          <p className="text-xs text-warm-gray flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {order.items.length} items
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-olive text-lg">{formatCurrency(order.total)}</p>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="text-center py-10 bg-cream/30 rounded-2xl border border-dashed border-latte">
                      <ShoppingBag className="w-8 h-8 text-warm-gray mx-auto mb-2 opacity-50" />
                      <p className="text-warm-gray text-sm font-medium">No orders today</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-latte/20 shadow-sm p-6 lg:p-8">
                <h2 className="font-display text-xl font-bold text-espresso mb-6">Popular Items</h2>
                <div className="space-y-5">
                  {products.filter(p => p.popular).slice(0, 5).map(product => (
                    <div key={product.id} className="flex items-center gap-4">
                      <img src={product.image} alt={product.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-latte/10" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-espresso line-clamp-1">{product.name}</p>
                        <p className="text-xs font-medium text-warm-gray mt-0.5">{product.category}</p>
                      </div>
                      <span className="font-bold text-espresso text-sm bg-cream px-3 py-1 rounded-xl border border-latte/20">{formatCurrency(product.price)}</span>
                    </div>
                  ))}
                  {products.filter(p => p.popular).length === 0 && (
                    <p className="text-center text-warm-gray py-4 text-sm">No popular items marked.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
        {/* Toolbar */}
        <div className="bg-white border-b border-latte/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-espresso">
                {activeTab === 'products' ? 'Product Management' : 'Customer Management'}
              </h1>
              <p className="text-sm text-warm-gray">
                {activeTab === 'products' ? `${filteredProducts.length} products shown` : `${filteredCustomers.length} customers shown`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                <input
                  type="text"
                  placeholder={activeTab === 'products' ? "Search products..." : "Search customers..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-cream text-espresso placeholder-warm-gray text-sm focus:outline-none focus:ring-2 focus:ring-gold border border-latte/30"
                />
              </div>

              {activeTab === 'products' && (
                <div className="flex bg-cream rounded-xl p-1 border border-latte/30">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-espresso text-cream shadow-sm' : 'text-warm-gray hover:text-espresso'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-espresso text-cream shadow-sm' : 'text-warm-gray hover:text-espresso'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Add Button */}
              {activeTab === 'products' ? (
                <button
                  onClick={handleOpenAddProduct}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-olive to-olive-light text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              ) : (
                <button
                  onClick={handleOpenAddCustomer}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-olive to-olive-light text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Add Customer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Content List */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'products' ? (
            viewMode === 'table' ? (
              <div className="bg-white rounded-2xl shadow-sm border border-latte/20 overflow-hidden">
                <table className="w-full">
                <thead>
                  <tr className="bg-cream/50 border-b border-latte/20">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider">Product</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider">Category</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider">Price</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-latte/10 hover:bg-cream/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="font-semibold text-sm text-espresso">{product.name}</p>
                            <p className="text-xs text-warm-gray truncate max-w-[200px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-medium bg-latte/40 text-espresso-light px-2.5 py-1 rounded-lg">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-semibold text-sm text-olive">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => updateProduct(product.id, { available: !product.available })}
                          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors
                            ${product.available
                              ? 'bg-olive/10 text-olive hover:bg-olive/20'
                              : 'bg-tomato/10 text-tomato hover:bg-tomato/20'
                            }`}
                        >
                          {product.available ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {product.available ? 'Available' : 'Hidden'}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(product)}
                            className="p-2 rounded-lg text-warm-gray hover:text-espresso hover:bg-latte/30 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {deleteConfirm === product.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="px-3 py-1.5 text-xs bg-tomato text-white rounded-lg font-medium"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-1.5 text-xs bg-latte text-espresso rounded-lg font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="p-2 rounded-lg text-warm-gray hover:text-tomato hover:bg-tomato/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-latte/20 hover:shadow-md transition-all">
                  <div className="relative h-36">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    {!product.available && (
                      <div className="absolute inset-0 bg-espresso/50 flex items-center justify-center">
                        <span className="bg-white text-espresso text-xs font-bold px-3 py-1 rounded-full">Unavailable</span>
                      </div>
                    )}
                    {product.popular && (
                      <span className="absolute top-2 left-2 bg-gold text-espresso text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ⭐ Popular
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-sm text-espresso">{product.name}</h3>
                        <p className="text-xs text-warm-gray bg-cream inline-block px-2 py-0.5 rounded mt-1">{product.category}</p>
                      </div>
                      <span className="font-bold text-olive">{formatCurrency(product.price)}</span>
                    </div>
                    <p className="text-xs text-warm-gray mt-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleOpenEditProduct(product)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium bg-latte/40 text-espresso rounded-xl hover:bg-latte transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteConfirm === product.id ? handleDeleteProduct(product.id) : setDeleteConfirm(product.id)}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-xl transition-colors
                          ${deleteConfirm === product.id
                            ? 'bg-tomato text-white'
                            : 'bg-tomato/10 text-tomato hover:bg-tomato/20'
                          }`}
                      >
                        <Trash2 className="w-3 h-3" />
                        {deleteConfirm === product.id ? 'Confirm?' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-latte/20 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-cream/50 border-b border-latte/20">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider">Contact</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider">Points</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider">Payment Method</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-latte/10 hover:bg-cream/30 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-sm text-espresso">{customer.name}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-sm text-espresso">{customer.phone}</p>
                        <p className="text-xs text-warm-gray">{customer.email}</p>
                      </td>
                      <td className="px-5 py-3 font-semibold text-sm text-olive">
                        {customer.points}
                      </td>
                      <td className="px-5 py-3">
                        {customer.savedPaymentMethod ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium bg-latte/40 text-espresso-light px-2.5 py-1 rounded-lg uppercase">
                            <CreditCard className="w-3 h-3" />
                            {customer.savedPaymentMethod.brand} **** {customer.savedPaymentMethod.last4}
                          </span>
                        ) : (
                          <span className="text-xs text-warm-gray font-medium">None</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditCustomer(customer)}
                            className="p-2 rounded-lg text-warm-gray hover:text-espresso hover:bg-latte/30 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {deleteConfirm === customer.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteCustomer(customer.id)}
                                className="px-3 py-1.5 text-xs bg-tomato text-white rounded-lg font-medium"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-1.5 text-xs bg-latte text-espresso rounded-lg font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(customer.id)}
                              className="p-2 rounded-lg text-warm-gray hover:text-tomato hover:bg-tomato/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCustomers.length === 0 && (
                <div className="text-center py-12 text-warm-gray text-sm">No customers found.</div>
              )}
            </div>
          )}
        </div>
        </>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {showProductForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProductForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-latte/20 rounded-t-3xl z-10">
              <h2 className="font-display text-xl font-bold text-espresso">
                {editingProductId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowProductForm(false)} className="p-2 rounded-xl hover:bg-latte/30 transition-colors">
                <X className="w-5 h-5 text-espresso" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-semibold text-espresso block mb-2">Product Image</label>
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative h-40 rounded-2xl overflow-hidden border border-latte/20">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImagePreview(''); setProductForm((prev) => ({ ...prev, image: '' })); }}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-lg hover:bg-white transition-colors"
                      >
                        <X className="w-4 h-4 text-espresso" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-latte rounded-2xl cursor-pointer hover:border-gold hover:bg-cream/50 transition-all">
                      <Upload className="w-8 h-8 text-warm-gray mb-2" />
                      <span className="text-sm text-warm-gray font-medium">Click to upload image</span>
                      <span className="text-xs text-warm-gray/60 mt-0.5">or paste a URL below</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or paste image URL..."
                  value={productForm.image.startsWith('data:') ? '' : productForm.image}
                  onChange={(e) => { setProductForm((prev) => ({ ...prev, image: e.target.value })); setImagePreview(e.target.value); }}
                  className="mt-2 w-full px-4 py-2 rounded-xl bg-cream text-espresso text-sm border border-latte/30 focus:outline-none focus:ring-2 focus:ring-gold placeholder-warm-gray"
                />
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-espresso block mb-1.5">Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Classic Espresso"
                  className="w-full px-4 py-2.5 rounded-xl bg-cream text-espresso text-sm border border-latte/30 focus:outline-none focus:ring-2 focus:ring-gold placeholder-warm-gray"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-espresso block mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this product..."
                  className="w-full px-4 py-2.5 rounded-xl bg-cream text-espresso text-sm border border-latte/30 focus:outline-none focus:ring-2 focus:ring-gold placeholder-warm-gray resize-none"
                />
              </div>

              {/* Price & Category Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-espresso block mb-1.5">Price (€) *</label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 rounded-xl bg-cream text-espresso text-sm border border-latte/30 focus:outline-none focus:ring-2 focus:ring-gold placeholder-warm-gray"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-espresso block mb-1.5">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value as Category }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-cream text-espresso text-sm border border-latte/30 focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.available}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, available: e.target.checked }))}
                    className="w-4 h-4 accent-olive rounded"
                  />
                  <span className="text-sm font-medium text-espresso">Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.popular}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, popular: e.target.checked }))}
                    className="w-4 h-4 accent-gold rounded"
                  />
                  <span className="text-sm font-medium text-espresso">Popular</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="flex-1 py-3 rounded-2xl border-2 border-latte text-warm-gray font-semibold hover:border-espresso-light hover:text-espresso transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-olive to-olive-light text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" />
                  {editingProductId ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Add/Edit Modal */}
      {showCustomerForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCustomerForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-latte/20 rounded-t-3xl z-10">
              <h2 className="font-display text-xl font-bold text-espresso">
                {editingCustomerId ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <button onClick={() => setShowCustomerForm(false)} className="p-2 rounded-xl hover:bg-latte/30 transition-colors">
                <X className="w-5 h-5 text-espresso" />
              </button>
            </div>

            <form onSubmit={handleCustomerSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-espresso block mb-1.5">Name *</label>
                <input
                  type="text"
                  required
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 rounded-xl bg-cream text-espresso text-sm border border-latte/30 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-espresso block mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-cream text-espresso text-sm border border-latte/30 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-espresso block mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g. +39 333 123 4567"
                  className="w-full px-4 py-2.5 rounded-xl bg-cream text-espresso text-sm border border-latte/30 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div className="bg-latte/10 p-4 rounded-2xl border border-latte/30 mt-4">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={customerForm.hasSavedCard}
                    onChange={(e) => setCustomerForm((prev) => ({ ...prev, hasSavedCard: e.target.checked }))}
                    className="w-4 h-4 accent-olive rounded"
                  />
                  <span className="text-sm font-medium text-espresso flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-warm-gray" />
                    Has Saved Payment Method
                  </span>
                </label>

                {customerForm.hasSavedCard && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="text-xs font-semibold text-warm-gray block mb-1">Card Number (Mock)</label>
                      <input
                        type="text"
                        value={customerForm.cardNumber}
                        onChange={(e) => setCustomerForm((prev) => ({ ...prev, cardNumber: e.target.value }))}
                        placeholder="**** **** **** 1234"
                        className="w-full px-3 py-2 rounded-lg bg-white text-espresso text-sm border border-latte/30 focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-warm-gray block mb-1">Card Brand</label>
                      <select
                        value={customerForm.cardBrand}
                        onChange={(e) => setCustomerForm((prev) => ({ ...prev, cardBrand: e.target.value as any }))}
                        className="w-full px-3 py-2 rounded-lg bg-white text-espresso text-sm border border-latte/30 focus:outline-none focus:ring-2 focus:ring-gold appearance-none"
                      >
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                        <option value="amex">Amex</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCustomerForm(false)}
                  className="flex-1 py-3 rounded-2xl border-2 border-latte text-warm-gray font-semibold hover:border-espresso-light hover:text-espresso transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-olive to-olive-light text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" />
                  {editingCustomerId ? 'Update' : 'Add'} Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
