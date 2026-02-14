import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle,
  Package,
  Copy,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useStore } from '@/hooks/useStore';
import { toast } from 'sonner';
import type { Purchase } from '@/types';

interface AdminOrdersProps {
  onNavigate: (page: 'dashboard' | 'products' | 'orders') => void;
}

export default function AdminOrders({ }: AdminOrdersProps) {
  const { purchases, updatePurchaseStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Purchase | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNote, setStatusNote] = useState('');

  const filteredOrders = purchases.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
      pending: 'Menunggu Pembayaran',
      paid: 'Dibayar',
      processing: 'Diproses',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };

    return (
      <Badge className={styles[status as keyof typeof styles] || styles.pending}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const copyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    toast.success('Order ID disalin!');
  };

  const openDetailDialog = (order: Purchase) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const openStatusDialog = (order: Purchase) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setIsStatusDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (!selectedOrder || !newStatus) return;

    updatePurchaseStatus(selectedOrder.id, newStatus as Purchase['status']);
    toast.success(`Status pesanan diubah menjadi ${newStatus}`);
    setIsStatusDialogOpen(false);
    setSelectedOrder(null);
  };

  const getStatusSteps = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Pesanan Dibuat', description: 'Menunggu pembayaran' },
      { key: 'paid', label: 'Pembayaran Diterima', description: 'Pesanan dikonfirmasi' },
      { key: 'processing', label: 'Sedang Diproses', description: 'Tim kami sedang menyiapkan pesanan' },
      { key: 'completed', label: 'Pesanan Selesai', description: 'Produk telah dikirim' },
    ];

    const statusIndex = steps.findIndex(s => s.key === status);

    return steps.map((step, index) => ({
      ...step,
      isActive: index <= statusIndex,
      isCurrent: index === statusIndex,
    }));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Kelola Pesanan</h1>
            <p className="text-gray-400">Lihat dan kelola semua pesanan</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan Order ID, nama, atau produk..."
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu Pembayaran</SelectItem>
              <SelectItem value="paid">Dibayar</SelectItem>
              <SelectItem value="processing">Diproses</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-400">Tidak ada pesanan</h3>
              <p className="text-gray-500 mt-2">Belum ada pesanan yang masuk</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="bg-white/5 border-white/10 hover:border-white/20 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-lg">{order.orderId}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyOrderId(order.orderId)}
                          className="h-6 w-6"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Produk</p>
                          <p className="font-medium">{order.productName}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Pelanggan</p>
                          <p className="font-medium">{order.customerName}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Total</p>
                          <p className="font-medium text-green-400">{formatPrice(order.price)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailDialog(order)}
                        className="border-white/10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black border-white/10">
                          <DropdownMenuItem onClick={() => openStatusDialog(order)}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Ubah Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mt-4 pt-4 border-t border-white/10 text-sm text-gray-400">
                    Dibuat: {new Date(order.createdAt).toLocaleString('id-ID')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Order Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="bg-black border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Pesanan</DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order ID & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">{selectedOrder.orderId}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyOrderId(selectedOrder.orderId)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  {getStatusSteps(selectedOrder.status).map((step, index) => (
                    <div
                      key={step.key}
                      className={`flex items-start gap-4 ${
                        step.isActive ? 'opacity-100' : 'opacity-40'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          step.isActive
                            ? step.isCurrent
                              ? 'bg-green-500 text-black'
                              : 'bg-green-500/30 text-green-400'
                            : 'bg-white/10 text-gray-500'
                        }`}
                      >
                        {step.isActive && !step.isCurrent ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${step.isCurrent ? 'text-green-400' : ''}`}>
                          {step.label}
                        </p>
                        <p className="text-sm text-gray-400">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Product Details */}
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="font-semibold mb-3">Detail Produk</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nama Produk</span>
                      <span>{selectedOrder.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Harga</span>
                      <span className="text-green-400">{formatPrice(selectedOrder.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Metode Pembayaran</span>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="font-semibold mb-3">Data Pelanggan</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nama</span>
                      <span>{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email</span>
                      <span>{selectedOrder.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">WhatsApp</span>
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Dibuat: {new Date(selectedOrder.createdAt).toLocaleString('id-ID')}</p>
                  {selectedOrder.paidAt && (
                    <p>Dibayar: {new Date(selectedOrder.paidAt).toLocaleString('id-ID')}</p>
                  )}
                  {selectedOrder.completedAt && (
                    <p>Selesai: {new Date(selectedOrder.completedAt).toLocaleString('id-ID')}</p>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                Tutup
              </Button>
              <Button onClick={() => {
                setIsDetailDialogOpen(false);
                openStatusDialog(selectedOrder!);
              }} className="bg-green-500 hover:bg-green-600 text-black">
                Ubah Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent className="bg-black border-white/10">
            <DialogHeader>
              <DialogTitle>Ubah Status Pesanan</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Status Baru</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="pending">Menunggu Pembayaran</SelectItem>
                    <SelectItem value="paid">Dibayar</SelectItem>
                    <SelectItem value="processing">Diproses</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Catatan (opsional)</label>
                <Textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Tambahkan catatan untuk pesanan ini..."
                  className="bg-white/5 border-white/10"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                onClick={handleUpdateStatus}
                className="bg-green-500 hover:bg-green-600 text-black"
                disabled={!newStatus || newStatus === selectedOrder?.status}
              >
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
