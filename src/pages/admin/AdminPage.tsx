import { useState } from 'react';
import { useStore } from '../../store/useStore';
import type { Product, Category } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import {
  Plus, Edit3, Trash2, X, Save, Upload, Search,
  Package, BarChart3, Coffee, Settings, Eye, EyeOff,
  LayoutGrid, List,
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

export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct, orders } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const filteredProducts = products.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterCategory !== 'All' && p.category !== filterCategory) return false;
    return true;
  });

  // Stats
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.available).length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImagePreview('');
    setShowForm(true);
  };

  const handleOpenEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      available: product.available,
      popular: product.popular,
    });
    setEditingId(product.id);
    setImagePreview(product.image);
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setForm((prev) => ({ ...prev, image: result }));
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) return;
    if (!form.name.trim()) return;

    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      category: form.category,
      image: form.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      available: form.available,
      popular: form.popular,
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setImagePreview('');
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
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

        {/* Stats */}
        <div className="space-y-3 mb-6">
          <div className="bg-cream rounded-xl p-3 border border-latte/20">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-olive" />
              <span className="text-xs text-warm-gray font-medium">Products</span>
            </div>
            <p className="text-2xl font-bold text-espresso">{totalProducts}</p>
            <p className="text-xs text-warm-gray">{availableProducts} available</p>
          </div>
          <div className="bg-cream rounded-xl p-3 border border-latte/20">
            <div className="flex items-center gap-2 mb-1">
              <Coffee className="w-4 h-4 text-gold" />
              <span className="text-xs text-warm-gray font-medium">Orders</span>
            </div>
            <p className="text-2xl font-bold text-espresso">{totalOrders}</p>
          </div>
          <div className="bg-cream rounded-xl p-3 border border-latte/20">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-tomato" />
              <span className="text-xs text-warm-gray font-medium">Revenue</span>
            </div>
            <p className="text-2xl font-bold text-olive">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <h3 className="text-xs text-warm-gray font-semibold uppercase mb-2 tracking-wider">Categories</h3>
          <div className="space-y-1">
            <button
              onClick={() => setFilterCategory('All')}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors
                ${filterCategory === 'All' ? 'bg-espresso text-cream' : 'text-espresso-light hover:bg-latte/30'}`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors
                  ${filterCategory === cat ? 'bg-espresso text-cream' : 'text-espresso-light hover:bg-latte/30'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-latte/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-espresso">Product Management</h1>
              <p className="text-sm text-warm-gray">{filteredProducts.length} products shown</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-cream text-espresso placeholder-warm-gray text-sm focus:outline-none focus:ring-2 focus:ring-gold border border-latte/30"
                />
              </div>

              {/* View Toggle */}
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

              {/* Add Button */}
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-olive to-olive-light text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'table' ? (
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
                            onClick={() => handleOpenEdit(product)}
                            className="p-2 rounded-lg text-warm-gray hover:text-espresso hover:bg-latte/30 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {deleteConfirm === product.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(product.id)}
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
                        onClick={() => handleOpenEdit(product)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium bg-latte/40 text-espresso rounded-xl hover:bg-latte transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteConfirm === product.id ? handleDelete(product.id) : setDeleteConfirm(product.id)}
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
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-latte/20 rounded-t-3xl z-10">
              <h2 className="font-display text-xl font-bold text-espresso">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-latte/30 transition-colors">
                <X className="w-5 h-5 text-espresso" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-semibold text-espresso block mb-2">Product Image</label>
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative h-40 rounded-2xl overflow-hidden border border-latte/20">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImagePreview(''); setForm((prev) => ({ ...prev, image: '' })); }}
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
                  value={form.image.startsWith('data:') ? '' : form.image}
                  onChange={(e) => { setForm((prev) => ({ ...prev, image: e.target.value })); setImagePreview(e.target.value); }}
                  className="mt-2 w-full px-4 py-2 rounded-xl bg-cream text-espresso text-sm border border-latte/30 focus:outline-none focus:ring-2 focus:ring-gold placeholder-warm-gray"
                />
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-espresso block mb-1.5">Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Classic Espresso"
                  className="w-full px-4 py-2.5 rounded-xl bg-cream text-espresso text-sm border border-latte/30 focus:outline-none focus:ring-2 focus:ring-gold placeholder-warm-gray"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-espresso block mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
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
                    value={form.price}
                    onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 rounded-xl bg-cream text-espresso text-sm border border-latte/30 focus:outline-none focus:ring-2 focus:ring-gold placeholder-warm-gray"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-espresso block mb-1.5">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as Category }))}
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
                    checked={form.available}
                    onChange={(e) => setForm((prev) => ({ ...prev, available: e.target.checked }))}
                    className="w-4 h-4 accent-olive rounded"
                  />
                  <span className="text-sm font-medium text-espresso">Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.popular}
                    onChange={(e) => setForm((prev) => ({ ...prev, popular: e.target.checked }))}
                    className="w-4 h-4 accent-gold rounded"
                  />
                  <span className="text-sm font-medium text-espresso">Popular</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-2xl border-2 border-latte text-warm-gray font-semibold hover:border-espresso-light hover:text-espresso transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-olive to-olive-light text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
