import { useState, useMemo } from 'react';
import { 
  Search, 
  Users, 
  Mail, 
  Phone, 
  ShoppingCart, 
  DollarSign,
  ArrowUpDown,
  Eye,
  Package,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/hooks/useStore';
import type { Customer } from '@/types';

interface AdminCustomersProps {
  onNavigate: (page: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings') => void;
}

export default function AdminCustomers({ }: AdminCustomersProps) {
  const { getCustomers, purchases } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'orders' | 'spent' | 'recent'>('spent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const customers = useMemo(() => getCustomers(), [purchases]);

  // Filter and sort customers
  let filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  filteredCustomers.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'orders':
        comparison = a.totalOrders - b.totalOrders;
        break;
      case 'spent':
        comparison = a.totalSpent - b.totalSpent;
        break;
      case 'recent':
        comparison = new Date(a.lastOrder).getTime() - new Date(b.lastOrder).getTime();
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const openDetailDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailDialogOpen(true);
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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Pelanggan</h1>
            <p className="text-gray-400">Kelola dan lihat data pelanggan Anda</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Pelanggan</p>
                  <p className="text-2xl font-bold">{customers.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Pesanan</p>
                  <p className="text-2xl font-bold">
                    {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Pendapatan</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatPrice(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Rata-rata Pesanan</p>
                  <p className="text-2xl font-bold">
                    {customers.length > 0 
                      ? (customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length).toFixed(1)
                      : 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pelanggan..."
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              <SelectItem value="name">Nama</SelectItem>
              <SelectItem value="orders">Jumlah Pesanan</SelectItem>
              <SelectItem value="spent">Total Belanja</SelectItem>
              <SelectItem value="recent">Pesanan Terakhir</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="border-white/10"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>

        {/* Customers Table */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-0">
            {paginatedCustomers.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-400">Tidak ada pelanggan</h3>
                <p className="text-gray-500 mt-2">Belum ada pelanggan yang terdaftar</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Pelanggan</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Kontak</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Pesanan</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Total Belanja</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Terakhir</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCustomers.map((customer) => (
                        <tr key={customer.email} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-black font-bold">
                                {customer.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium">{customer.name}</p>
                                <p className="text-xs text-gray-400">{customer.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Phone className="w-4 h-4" />
                              {customer.phone}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge className="bg-blue-500/20 text-blue-400">
                              {customer.totalOrders} pesanan
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-green-400 font-medium">
                              {formatPrice(customer.totalSpent)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-400">
                            {new Date(customer.lastOrder).toLocaleDateString('id-ID')}
                          </td>
                          <td className="py-4 px-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDetailDialog(customer)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Detail
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t border-white/10">
                    <p className="text-sm text-gray-400">
                      Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} dari {filteredCustomers.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="border-white/10"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="border-white/10"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Customer Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="bg-black border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Pelanggan</DialogTitle>
            </DialogHeader>
            
            {selectedCustomer && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-black text-2xl font-bold">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                    <p className="text-gray-400">{selectedCustomer.email}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 text-center">
                    <p className="text-2xl font-bold">{selectedCustomer.totalOrders}</p>
                    <p className="text-xs text-gray-400">Total Pesanan</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {formatPrice(selectedCustomer.totalSpent)}
                    </p>
                    <p className="text-xs text-gray-400">Total Belanja</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 text-center">
                    <p className="text-2xl font-bold">
                      {selectedCustomer.totalOrders > 0 
                        ? formatPrice(selectedCustomer.totalSpent / selectedCustomer.totalOrders)
                        : formatPrice(0)}
                    </p>
                    <p className="text-xs text-gray-400">Rata-rata</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="font-semibold mb-3">Informasi Kontak</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Order History */}
                <div>
                  <h4 className="font-semibold mb-3">Riwayat Pesanan</h4>
                  <div className="space-y-3">
                    {selectedCustomer.orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="p-3 rounded-lg bg-white/5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-white/10 px-2 py-0.5 rounded">{order.orderId}</code>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{order.productName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-medium">{formatPrice(order.price)}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
