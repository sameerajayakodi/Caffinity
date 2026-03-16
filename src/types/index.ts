export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  available: boolean;
  popular: boolean;
}

export type Category = 'Espresso' | 'Cappuccino' | 'Latte' | 'Iced Coffee' | 'Pastries' | 'Desserts';

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed';

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  timestamp: string;
  paymentStatus: 'unpaid' | 'paid';
  tableNumber?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
