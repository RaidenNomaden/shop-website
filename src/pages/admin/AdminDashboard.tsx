import { useEffect, useState } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/hooks/useStore';
import type { DashboardStats } from '@/types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface AdminDashboardProps {
  onNavigate: (page: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings') => void;
}

const COLORS = ['#4ade80', '#60a5fa', '#f472b6', '#fbbf24', '#f87171'];

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { getStats, products, purchases } = useStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    setStats(getStats());
  }, [products, purchases]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      paid: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      processing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    
    const labels = {
      pending: 'Pending',
      paid: 'Dibayar',
      processing: 'Diproses',
      completed: 'Selesai',
      cancelled: 'Batal',
    };

    return (
      <Badge className={styles[status as keyof typeof styles] || styles.pending}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  // Calculate growth (mock calculation for demo)
  const salesGrowth = 23.5;
  const ordersGrowth = 15.2;

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Selamat datang kembali, berikut ringkasan toko Anda</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-green-500/30 text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
              Online
            </Badge>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
            >
              <option value="7d">7 Hari Terakhir</option>
              <option value="30d">30 Hari Terakhir</option>
              <option value="all">Semua Waktu</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Penjualan</p>
                  <p className="text-2xl font-bold text-green-400">{formatPrice(stats.totalSales)}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">+{salesGrowth}%</span>
                    <span className="text-xs text-gray-500">vs minggu lalu</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Pesanan</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">+{ordersGrowth}%</span>
                    <span className="text-xs text-gray-500">vs minggu lalu</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Produk</p>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {products.filter(p => !p.isActive).length} nonaktif
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border ${stats.lowStockProducts > 0 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10'}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm mb-1 ${stats.lowStockProducts > 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
                    Stok Menipis
                  </p>
                  <p className={`text-2xl font-bold ${stats.lowStockProducts > 0 ? 'text-yellow-400' : ''}`}>
                    {stats.lowStockProducts}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Produk perlu restock
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stats.lowStockProducts > 0 ? 'bg-yellow-500/20' : 'bg-gray-500/10'}`}>
                  <AlertTriangle className={`w-6 h-6 ${stats.lowStockProducts > 0 ? 'text-yellow-400' : 'text-gray-400'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <Card className="lg:col-span-2 bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Grafik Penjualan</CardTitle>
                  <CardDescription>Penjualan 7 hari terakhir</CardDescription>
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.salesByDay}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `Rp${value/1000}K`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                      formatter={(value: number) => [formatPrice(value), 'Penjualan']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#4ade80" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Order Status Chart */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Status Pesanan</CardTitle>
              <CardDescription>Distribusi status pesanan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.ordersByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {stats.ordersByStatus.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }} />
                    <Legend fontSize={12} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Payment Methods */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Metode Pembayaran</CardTitle>
              <CardDescription>Penjualan berdasarkan metode pembayaran</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.salesByPayment}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="method" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `Rp${value/1000}K`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                      formatter={(value: number) => [formatPrice(value), 'Penjualan']}
                    />
                    <Bar dataKey="amount" fill="#4ade80" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Produk Terlaris</CardTitle>
                <CardDescription>Produk dengan penjualan tertinggi</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('products')}>
                Lihat Semua
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">Belum ada data penjualan</p>
                ) : (
                  stats.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.sales} terjual</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-medium text-sm">{formatPrice(product.revenue)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pesanan Terbaru</CardTitle>
              <CardDescription>10 pesanan terakhir yang masuk</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate('orders')}>
              Kelola Pesanan
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada pesanan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Produk</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Pelanggan</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <code className="text-xs bg-white/10 px-2 py-1 rounded">{order.orderId}</code>
                        </td>
                        <td className="py-3 px-4 text-sm">{order.productName}</td>
                        <td className="py-3 px-4 text-sm">{order.customerName}</td>
                        <td className="py-3 px-4 text-green-400 font-medium">{formatPrice(order.price)}</td>
                        <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                        <td className="py-3 px-4 text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
