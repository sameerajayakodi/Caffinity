import { create } from 'zustand';
import type { Product, Order, OrderStatus, CartItem, Customer } from '../types';
import { mockProducts } from '../data/mockProducts';
import { mockCustomers } from '../data/mockCustomers';
import { generateOrderId } from '../utils/helpers';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppStore {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'points'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Cart (for customer & POS)
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Orders
  orders: Order[];
  placeOrder: (tableNumber?: number, customerId?: string) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  markOrderPaid: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Auth
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Toast notifications
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useStore = create<AppStore>((set, get) => ({
  // Auth
  isAuthenticated: false,
  login: (username, password) => {
    if (username === 'admin' && password === 'admin') {
      set({ isAuthenticated: true });
      get().addToast('Logged in successfully', 'success');
      return true;
    }
    get().addToast('Invalid credentials', 'error');
    return false;
  },
  logout: () => {
    set({ isAuthenticated: false });
    get().addToast('Logged out', 'info');
  },
  // Products
  products: [...mockProducts],

  addProduct: (product) => {
    const id = `prod-${Date.now()}`;
    set((state) => ({
      products: [...state.products, { ...product, id }],
    }));
    get().addToast('Product added successfully!', 'success');
  },

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
    get().addToast('Product updated successfully!', 'success');
  },

  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
    get().addToast('Product deleted.', 'info');
  },

  // Customers
  customers: [...mockCustomers],

  addCustomer: (customer) => {
    const id = `cust-${Date.now()}`;
    set((state) => ({
      customers: [...state.customers, { ...customer, id, points: 0 }],
    }));
    get().addToast('Customer added successfully!', 'success');
  },

  updateCustomer: (id, updates) => {
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
    get().addToast('Customer updated!', 'success');
  },

  deleteCustomer: (id) => {
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    }));
    get().addToast('Customer deleted.', 'info');
  },

  // Cart
  cart: [],

  addToCart: (product) => {
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { product, quantity: 1 }] };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    }));
  },

  updateCartQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => set({ cart: [] }),

  getCartTotal: () => {
    return get().cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },

  // Orders
  orders: [],

  placeOrder: (tableNumber, customerId) => {
    const { cart, clearCart, addToast } = get();
    if (cart.length === 0) return null;

    const total = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const order: Order = {
      id: generateOrderId(),
      items: cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      total,
      status: 'Pending',
      timestamp: new Date().toISOString(),
      paymentStatus: 'unpaid',
      tableNumber,
      customerId,
    };

    set((state) => {
      // Award points if customer is linked
      let updatedCustomers = state.customers;
      if (customerId) {
        const pointsAwarded = Math.floor(total * 10); // 10 points per dollar
        updatedCustomers = state.customers.map(c => 
          c.id === customerId ? { ...c, points: c.points + pointsAwarded } : c
        );
      }
      return { 
        orders: [order, ...state.orders],
        customers: updatedCustomers
      };
    });
    
    clearCart();
    addToast(`Order ${order.id} placed successfully!`, 'success');
    return order;
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      ),
    }));
    get().addToast(`Order ${orderId} → ${status}`, 'info');
  },

  markOrderPaid: (orderId) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, paymentStatus: 'paid' } : o
      ),
    }));
  },

  getOrderById: (orderId) => {
    return get().orders.find((o) => o.id === orderId);
  },

  // Toasts
  toasts: [],

  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => get().removeToast(id), 4000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
