import { useState, useEffect, useCallback } from 'react';
import type { Product, Purchase, AdminUser, DashboardStats, CartItem, Customer, StoreSettings } from '@/types';

// Initial sample products
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Pterodactyl Panel Pro',
    description: 'Complete Pterodactyl panel setup with custom themes, plugins, and full configuration. Perfect for game server hosting business.',
    price: 150000,
    originalPrice: 200000,
    stock: 10,
    category: 'Panel',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    features: ['Custom Theme', 'Auto Installer', '24/7 Support', 'Free Updates'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    salesCount: 45,
    views: 320,
  },
  {
    id: '2',
    name: 'WA Bot Script Premium',
    description: 'Advanced WhatsApp automation bot with AI integration, auto-reply, broadcast, and group management features.',
    price: 75000,
    stock: 25,
    category: 'Bot',
    image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=600&fit=crop',
    features: ['AI Integration', 'Auto Reply', 'Broadcast', 'Group Manager'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    salesCount: 128,
    views: 890,
  },
  {
    id: '3',
    name: 'Game Server Bundle',
    description: 'Complete game server setup including Minecraft, CS:GO, and Valorant server configurations with monitoring tools.',
    price: 250000,
    originalPrice: 350000,
    stock: 5,
    category: 'Bundle',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
    features: ['Minecraft Server', 'CS:GO Server', 'Monitoring Tools', 'Backup System'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    salesCount: 23,
    views: 156,
  },
  {
    id: '4',
    name: 'VPS Configuration Script',
    description: 'Automated VPS setup script with security hardening, panel installation, and optimization for gaming servers.',
    price: 50000,
    stock: 50,
    category: 'Script',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop',
    features: ['Auto Setup', 'Security Hardening', 'Optimization', 'One-Click Install'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    salesCount: 89,
    views: 445,
  },
  {
    id: '5',
    name: 'Discord Bot Starter',
    description: 'Feature-rich Discord bot with moderation, music, economy system, and custom commands.',
    price: 45000,
    stock: 30,
    category: 'Bot',
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&h=600&fit=crop',
    features: ['Moderation', 'Music Player', 'Economy System', 'Custom Commands'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    salesCount: 67,
    views: 334,
  },
  {
    id: '6',
    name: 'Cloud Panel Enterprise',
    description: 'Enterprise-grade cloud management panel with multi-server support, billing integration, and API access.',
    price: 500000,
    stock: 3,
    category: 'Panel',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    features: ['Multi-Server', 'Billing API', 'User Management', 'Analytics'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    salesCount: 12,
    views: 98,
  },
];

// Generate unique order ID
const generateOrderId = () => {
  const prefix = 'PTH';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Initial settings
const initialSettings: StoreSettings = {
  storeName: 'PTEROHUB.ID',
  storeDescription: 'Premium Digital Solutions',
  contactEmail: 'support@pterohub.id',
  contactPhone: '+62 812-3456-7890',
  whatsappNumber: '6281234567890',
  enableQRIS: true,
  enableDANA: true,
  enableGOPAY: true,
  maintenanceMode: false,
};

export function useStore() {
  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pterohub_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Purchases state
  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem('pterohub_purchases');
    return saved ? JSON.parse(saved) : [];
  });

  // Admin state
  const [admin, setAdmin] = useState<AdminUser>(() => {
    const saved = localStorage.getItem('pterohub_admin');
    return saved ? JSON.parse(saved) : { 
      username: 'admin', 
      password: 'admin123', 
      isLoggedIn: false,
      email: 'admin@pterohub.id',
      storeName: 'PTEROHUB.ID'
    };
  });

  // Settings state
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('pterohub_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('pterohub_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pterohub_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('pterohub_admin', JSON.stringify(admin));
  }, [admin]);

  useEffect(() => {
    localStorage.setItem('pterohub_settings', JSON.stringify(settings));
  }, [settings]);

  // Product actions
  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'salesCount' | 'views'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      salesCount: 0,
      views: 0,
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const restockProduct = useCallback((id: string, amount: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, stock: p.stock + amount, updatedAt: new Date().toISOString() }
          : p
      )
    );
  }, []);

  const incrementProductViews = useCallback((id: string) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, views: p.views + 1 } : p
      )
    );
  }, []);

  // Purchase actions
  const createPurchase = useCallback((
    product: Product,
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    paymentMethod: 'QRIS' | 'DANA' | 'GOPAY'
  ): Purchase => {
    const purchase: Purchase = {
      id: Date.now().toString(),
      orderId: generateOrderId(),
      productId: product.id,
      productName: product.name,
      customerName,
      customerEmail,
      customerPhone,
      price: product.price,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setPurchases(prev => [purchase, ...prev]);
    
    // Decrease stock and increase sales count
    setProducts(prev =>
      prev.map(p =>
        p.id === product.id 
          ? { ...p, stock: Math.max(0, p.stock - 1), salesCount: p.salesCount + 1 } 
          : p
      )
    );
    
    return purchase;
  }, []);

  const updatePurchaseStatus = useCallback((id: string, status: Purchase['status']) => {
    setPurchases(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const updates: Partial<Purchase> = { status };
        if (status === 'paid') updates.paidAt = new Date().toISOString();
        if (status === 'completed') updates.completedAt = new Date().toISOString();
        return { ...p, ...updates };
      })
    );
  }, []);

  const getPurchaseByOrderId = useCallback((orderId: string) => {
    return purchases.find(p => p.orderId.toLowerCase() === orderId.toLowerCase());
  }, [purchases]);

  const bulkUpdateStatus = useCallback((ids: string[], status: Purchase['status']) => {
    setPurchases(prev =>
      prev.map(p => {
        if (!ids.includes(p.id)) return p;
        const updates: Partial<Purchase> = { status };
        if (status === 'paid') updates.paidAt = new Date().toISOString();
        if (status === 'completed') updates.completedAt = new Date().toISOString();
        return { ...p, ...updates };
      })
    );
  }, []);

  // Admin actions
  const login = useCallback((username: string, password: string) => {
    if (username === admin.username && password === admin.password) {
      setAdmin(prev => ({ ...prev, isLoggedIn: true }));
      return true;
    }
    return false;
  }, [admin.username, admin.password]);

  const logout = useCallback(() => {
    setAdmin(prev => ({ ...prev, isLoggedIn: false }));
  }, []);

  const changePassword = useCallback((newPassword: string) => {
    setAdmin(prev => ({ ...prev, password: newPassword }));
  }, []);

  const updateAdmin = useCallback((updates: Partial<AdminUser>) => {
    setAdmin(prev => ({ ...prev, ...updates }));
  }, []);

  // Settings actions
  const updateSettings = useCallback((updates: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // Cart actions
  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Customer management
  const getCustomers = useCallback((): Customer[] => {
    const customerMap = new Map<string, Customer>();
    
    purchases.forEach(purchase => {
      const key = purchase.customerEmail;
      const existing = customerMap.get(key);
      
      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += purchase.price;
        if (new Date(purchase.createdAt) > new Date(existing.lastOrder)) {
          existing.lastOrder = purchase.createdAt;
        }
        existing.orders.push(purchase);
      } else {
        customerMap.set(key, {
          email: purchase.customerEmail,
          name: purchase.customerName,
          phone: purchase.customerPhone,
          totalOrders: 1,
          totalSpent: purchase.price,
          lastOrder: purchase.createdAt,
          orders: [purchase],
        });
      }
    });
    
    return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [purchases]);

  // Stats
  const getStats = useCallback((): DashboardStats => {
    const totalSales = purchases
      .filter(p => p.status === 'completed' || p.status === 'paid')
      .reduce((sum, p) => sum + p.price, 0);
    
    const lowStockProducts = products.filter(p => p.stock <= 5 && p.isActive).length;
    
    // Sales by day (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }).reverse();
    
    const salesByDay = last7Days.map(date => {
      const amount = purchases
        .filter(p => {
          const pDate = new Date(p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
          return pDate === date && (p.status === 'completed' || p.status === 'paid');
        })
        .reduce((sum, p) => sum + p.price, 0);
      return { date, amount };
    });

    // Orders by status
    const ordersByStatus = [
      { status: 'Pending', count: purchases.filter(p => p.status === 'pending').length },
      { status: 'Dibayar', count: purchases.filter(p => p.status === 'paid').length },
      { status: 'Diproses', count: purchases.filter(p => p.status === 'processing').length },
      { status: 'Selesai', count: purchases.filter(p => p.status === 'completed').length },
      { status: 'Dibatalkan', count: purchases.filter(p => p.status === 'cancelled').length },
    ];

    // Sales by payment method
    const salesByPayment = ['QRIS', 'DANA', 'GOPAY'].map(method => ({
      method,
      amount: purchases
        .filter(p => p.paymentMethod === method && (p.status === 'completed' || p.status === 'paid'))
        .reduce((sum, p) => sum + p.price, 0),
    }));

    // Top products
    const topProducts = products
      .filter(p => p.salesCount > 0)
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5)
      .map(p => ({
        name: p.name,
        sales: p.salesCount,
        revenue: p.salesCount * p.price,
      }));

    return {
      totalSales,
      totalOrders: purchases.length,
      totalProducts: products.filter(p => p.isActive).length,
      lowStockProducts,
      recentOrders: purchases.slice(0, 10),
      salesByDay,
      ordersByStatus,
      salesByPayment,
      topProducts,
    };
  }, [products, purchases]);

  return {
    // State
    products,
    purchases,
    admin,
    settings,
    cart,
    
    // Product actions
    addProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    incrementProductViews,
    
    // Purchase actions
    createPurchase,
    updatePurchaseStatus,
    getPurchaseByOrderId,
    bulkUpdateStatus,
    
    // Admin actions
    login,
    logout,
    changePassword,
    updateAdmin,
    
    // Settings actions
    updateSettings,
    
    // Cart actions
    addToCart,
    removeFromCart,
    clearCart,
    
    // Customer management
    getCustomers,
    
    // Stats
    getStats,
  };
}
