// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  image: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  salesCount: number;
  views: number;
}

// Purchase Types
export interface Purchase {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  price: number;
  paymentMethod: 'QRIS' | 'DANA' | 'GOPAY';
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  paidAt?: string;
  completedAt?: string;
  notes?: string;
}

// Payment Types
export type PaymentMethod = 'QRIS' | 'DANA' | 'GOPAY';

export interface PaymentDetails {
  method: PaymentMethod;
  accountNumber?: string;
  accountName?: string;
  qrCode?: string;
  instructions: string[];
}

// Admin Types
export interface AdminUser {
  username: string;
  password: string;
  isLoggedIn: boolean;
  email?: string;
  phone?: string;
  storeName: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Stats Types
export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  recentOrders: Purchase[];
  salesByDay: { date: string; amount: number }[];
  ordersByStatus: { status: string; count: number }[];
  salesByPayment: { method: string; amount: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
}

// Customer Types
export interface Customer {
  email: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  orders: Purchase[];
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  createdAt: string;
  read: boolean;
}

// Settings Types
export interface StoreSettings {
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  enableQRIS: boolean;
  enableDANA: boolean;
  enableGOPAY: boolean;
  maintenanceMode: boolean;
}
