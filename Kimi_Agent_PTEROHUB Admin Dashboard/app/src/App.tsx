import { useState, useEffect } from 'react';
import { ShoppingCart, User, Package, LogOut, Menu, X, Search, LayoutDashboard, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useStore } from '@/hooks/useStore';
import { Toaster, toast } from 'sonner';

// Pages
import StorePage from '@/pages/StorePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderStatusPage from '@/pages/OrderStatusPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminCustomers from '@/pages/admin/AdminCustomers';
import AdminSettings from '@/pages/admin/AdminSettings';

export default function App() {
  const { admin, logout, cart, settings } = useStore();
  const [currentPage, setCurrentPage] = useState<'store' | 'product' | 'checkout' | 'order-status' | 'admin'>('store');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [adminPage, setAdminPage] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check for saved page on mount
  useEffect(() => {
    const savedPage = localStorage.getItem('pterohub_current_page');
    if (savedPage) {
      setCurrentPage(savedPage as any);
    }
  }, []);

  // Save current page
  useEffect(() => {
    localStorage.setItem('pterohub_current_page', currentPage);
  }, [currentPage]);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Keranjang kosong!');
      return;
    }
    setCurrentPage('checkout');
  };

  const handleAdminLogout = () => {
    logout();
    setCurrentPage('store');
    setAdminPage('dashboard');
    toast.success('Berhasil logout');
  };

  const navigateToAdmin = () => {
    if (admin.isLoggedIn) {
      setCurrentPage('admin');
      setAdminPage('dashboard');
    } else {
      setCurrentPage('admin');
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'store':
        return (
          <StorePage
            onProductClick={handleProductClick}
            searchQuery={searchQuery}
          />
        );
      case 'product':
        return selectedProductId ? (
          <ProductDetailPage
            productId={selectedProductId}
            onBack={() => setCurrentPage('store')}
            onCheckout={() => setCurrentPage('checkout')}
          />
        ) : null;
      case 'checkout':
        return (
          <CheckoutPage
            onBack={() => setCurrentPage('store')}
            onOrderComplete={(orderId) => {
              setCurrentPage('order-status');
              localStorage.setItem('pterohub_last_order', orderId);
            }}
          />
        );
      case 'order-status':
        return (
          <OrderStatusPage
            onBack={() => setCurrentPage('store')}
          />
        );
      case 'admin':
        if (!admin.isLoggedIn) {
          return <AdminLoginPage onLoginSuccess={() => setCurrentPage('admin')} />;
        }
        switch (adminPage) {
          case 'dashboard':
            return <AdminDashboard onNavigate={setAdminPage} />;
          case 'products':
            return <AdminProducts onNavigate={setAdminPage} />;
          case 'orders':
            return <AdminOrders onNavigate={setAdminPage} />;
          case 'customers':
            return <AdminCustomers onNavigate={setAdminPage} />;
          case 'settings':
            return <AdminSettings onNavigate={setAdminPage} />;
          default:
            return <AdminDashboard onNavigate={setAdminPage} />;
        }
      default:
        return <StorePage onProductClick={handleProductClick} searchQuery={searchQuery} />;
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Admin Sidebar Navigation Items
  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produk', icon: Package },
    { id: 'orders', label: 'Pesanan', icon: ShoppingCart },
    { id: 'customers', label: 'Pelanggan', icon: Users },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Toaster position="top-right" richColors />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => setCurrentPage('store')}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(74,222,128,0.5)] transition-shadow">
                <Package className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {settings.storeName}
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {/* Search */}
              <div className="relative">
                {isSearchOpen ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Cari produk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={handleCheckout}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-green-500 text-black text-xs w-5 h-5 flex items-center justify-center p-0">
                    {cartItemCount}
                  </Badge>
                )}
              </button>

              {/* Order Status */}
              <Button
                variant="ghost"
                onClick={() => setCurrentPage('order-status')}
                className="text-gray-400 hover:text-white"
              >
                Cek Pesanan
              </Button>

              {/* Admin */}
              <Button
                variant="ghost"
                onClick={navigateToAdmin}
                className="text-gray-400 hover:text-white"
              >
                <User className="w-5 h-5 mr-2" />
                Admin
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black border-white/10 w-80">
                <div className="flex flex-col gap-4 mt-8">
                  <Input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                  <button
                    onClick={() => {
                      setCurrentPage('order-status');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-left"
                  >
                    <Package className="w-5 h-5 text-green-400" />
                    Cek Pesanan
                  </button>
                  <button
                    onClick={() => {
                      handleCheckout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-left"
                  >
                    <ShoppingCart className="w-5 h-5 text-green-400" />
                    Keranjang ({cartItemCount})
                  </button>
                  <button
                    onClick={() => {
                      navigateToAdmin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-left"
                  >
                    <User className="w-5 h-5 text-green-400" />
                    Admin
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Admin Sidebar (when in admin mode) */}
      {currentPage === 'admin' && admin.isLoggedIn && (
        <>
          {/* Desktop Sidebar */}
          <div className="fixed left-0 top-16 bottom-0 w-64 bg-black/90 border-r border-white/10 z-40 hidden lg:block">
            <div className="p-4">
              {/* Admin Info */}
              <div className="mb-6 p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-black font-bold">
                    {admin.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{admin.username}</p>
                    <p className="text-xs text-gray-400">Administrator</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-4">Menu</p>
                <div className="space-y-1">
                  {adminNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setAdminPage(item.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        adminPage === item.id
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'hover:bg-white/5 text-gray-400'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <button
                  onClick={handleAdminLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Admin Navigation */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 z-40">
            <div className="flex justify-around p-2">
              {adminNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setAdminPage(item.id as any)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    adminPage === item.id
                      ? 'text-green-400'
                      : 'text-gray-400'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className={`pt-16 ${currentPage === 'admin' && admin.isLoggedIn ? 'lg:pl-64' : ''} ${currentPage === 'admin' && admin.isLoggedIn ? 'pb-20 lg:pb-0' : ''}`}>
        {renderContent()}
      </main>

      {/* Footer */}
      {currentPage !== 'admin' && (
        <footer className="bg-black border-t border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-xl font-bold">{settings.storeName}</span>
                </div>
                <p className="text-gray-400 text-sm">
                  {settings.storeDescription}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Produk</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>Pterodactyl Panel</li>
                  <li>WA Bot Script</li>
                  <li>Game Server</li>
                  <li>Custom Solutions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Metode Pembayaran</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {settings.enableQRIS && <li>QRIS</li>}
                  {settings.enableDANA && <li>DANA</li>}
                  {settings.enableGOPAY && <li>GOPAY</li>}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Kontak</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>{settings.contactEmail}</li>
                  <li>{settings.contactPhone}</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-500 text-sm">
              © 2024 {settings.storeName} - All rights reserved
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
