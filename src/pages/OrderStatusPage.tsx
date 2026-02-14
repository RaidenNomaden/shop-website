import { useState } from 'react';
import { ArrowLeft, Search, Package, CheckCircle, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/hooks/useStore';
import { toast } from 'sonner';

interface OrderStatusPageProps {
  onBack: () => void;
}

export default function OrderStatusPage({ onBack }: OrderStatusPageProps) {
  const { getPurchaseByOrderId } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<ReturnType<typeof getPurchaseByOrderId>>(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Get recent orders from localStorage
  const recentOrders = JSON.parse(localStorage.getItem('pterohub_recent_orders') || '[]');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Masukkan Order ID');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = getPurchaseByOrderId(searchQuery.trim());
    setSearchResult(result);
    setIsSearching(false);

    if (result) {
      // Add to recent orders
      const updatedRecent = [searchQuery.trim(), ...recentOrders.filter((o: string) => o !== searchQuery.trim())].slice(0, 5);
      localStorage.setItem('pterohub_recent_orders', JSON.stringify(updatedRecent));
    }
  };

  const copyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    toast.success('Order ID disalin!');
  };

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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <h1 className="text-3xl font-bold mb-8">Cek Status Pesanan</h1>

        {/* Search Form */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Masukkan Order ID (contoh: PTH-ABC123)"
                  className="pl-10 bg-white/5 border-white/10"
                />
              </div>
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-black"
                disabled={isSearching}
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Cari'
                )}
              </Button>
            </form>

            {/* Recent Orders */}
            {recentOrders.length > 0 && !hasSearched && (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">Pesanan Terakhir:</p>
                <div className="flex flex-wrap gap-2">
                  {recentOrders.map((order: string) => (
                    <button
                      key={order}
                      onClick={() => {
                        setSearchQuery(order);
                        handleSearch({ preventDefault: () => {} } as React.FormEvent);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
                    >
                      {order}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Result */}
        {hasSearched && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {!searchResult ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Pesanan Tidak Ditemukan</h3>
                  <p className="text-gray-400">
                    Order ID yang Anda masukkan tidak valid atau belum terdaftar
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{searchResult.orderId}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyOrderId(searchResult.orderId)}
                          className="h-8 w-8"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(searchResult.createdAt).toLocaleString('id-ID', {
                          dateStyle: 'long',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                    {getStatusBadge(searchResult.status)}
                  </div>

                  <Separator className="bg-white/10 mb-6" />

                  {/* Status Timeline */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-4">Status Pesanan</h4>
                    <div className="space-y-4">
                      {getStatusSteps(searchResult.status).map((step, index) => (
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
                  </div>

                  <Separator className="bg-white/10 mb-6" />

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Detail Produk</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Produk</span>
                          <span>{searchResult.productName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Harga</span>
                          <span className="text-green-400">{formatPrice(searchResult.price)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Metode Pembayaran</span>
                          <span>{searchResult.paymentMethod}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">Data Pembeli</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Nama</span>
                          <span>{searchResult.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email</span>
                          <span>{searchResult.customerEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">WhatsApp</span>
                          <span>{searchResult.customerPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {searchResult.notes && (
                    <>
                      <Separator className="bg-white/10 my-6" />
                      <div>
                        <h4 className="font-semibold mb-2">Catatan</h4>
                        <p className="text-gray-400">{searchResult.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Help Section */}
        <Card className="bg-white/5 border-white/10 mt-8">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4">Butuh Bantuan?</h4>
            <p className="text-gray-400 mb-4">
              Jika Anda mengalami masalah dengan pesanan, silakan hubungi kami:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="border-white/20"
                onClick={() => toast.info('WhatsApp: +62 812-3456-7890')}
              >
                WhatsApp Support
              </Button>
              <Button
                variant="outline"
                className="border-white/20"
                onClick={() => toast.info('Email: support@pterohub.id')}
              >
                Email Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
