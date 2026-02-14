import { useState } from 'react';
import { ArrowLeft, CreditCard, QrCode, Wallet, Smartphone, Check, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/hooks/useStore';
import { toast } from 'sonner';
import type { PaymentMethod } from '@/types';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderComplete: (orderId: string) => void;
}

export default function CheckoutPage({ onBack, onOrderComplete }: CheckoutPageProps) {
  const { cart, clearCart, createPurchase } = useStore();
  const [step, setStep] = useState<'form' | 'payment' | 'confirmation'>('form');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Mohon lengkapi semua data');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment) {
      toast.error('Pilih metode pembayaran');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create purchase for each cart item
    const purchases = cart.map(item => 
      createPurchase(
        item.product,
        formData.name,
        formData.email,
        formData.phone,
        selectedPayment
      )
    );

    if (purchases.length > 0) {
      setOrderId(purchases[0].orderId);
      clearCart();
      setStep('confirmation');
      toast.success('Pesanan berhasil dibuat!');
    }

    setIsProcessing(false);
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast.success('Order ID disalin!');
  };

  const getPaymentInstructions = (method: PaymentMethod) => {
    switch (method) {
      case 'QRIS':
        return [
          'Buka aplikasi e-wallet atau mobile banking Anda',
          'Pilih menu Scan QRIS',
          'Scan kode QR yang ditampilkan',
          'Konfirmasi pembayaran',
          'Transaksi selesai',
        ];
      case 'DANA':
        return [
          'Buka aplikasi DANA',
          'Kirim ke nomor: 0812-3456-7890',
          'Atas nama: PTEROHUB.ID',
          'Nominal: ' + formatPrice(totalAmount),
          'Konfirmasi pembayaran Anda',
        ];
      case 'GOPAY':
        return [
          'Buka aplikasi Gojek',
          'Pilih menu GoPay',
          'Kirim ke nomor: 0812-3456-7890',
          'Atas nama: PTEROHUB.ID',
          'Nominal: ' + formatPrice(totalAmount),
        ];
      default:
        return [];
    }
  };

  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="bg-white/5 border-white/10 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Keranjang Kosong</h2>
            <p className="text-gray-400 mb-6">Anda belum menambahkan produk ke keranjang</p>
            <Button onClick={onBack} className="bg-green-500 hover:bg-green-600 text-black">
              Lanjutkan Belanja
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {['Data Diri', 'Pembayaran', 'Konfirmasi'].map((s, index) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step === ['form', 'payment', 'confirmation'][index]
                    ? 'bg-green-500 text-black'
                    : index < ['form', 'payment', 'confirmation'].indexOf(step)
                    ? 'bg-green-500/30 text-green-400'
                    : 'bg-white/10 text-gray-500'
                }`}
              >
                {index < ['form', 'payment', 'confirmation'].indexOf(step) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-sm ${
                  step === ['form', 'payment', 'confirmation'][index]
                    ? 'text-white'
                    : 'text-gray-500'
                }`}
              >
                {s}
              </span>
              {index < 2 && <div className="w-8 h-px bg-white/20 mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1: Form */}
        {step === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Data Pembeli</h2>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Masukkan nama lengkap"
                        className="bg-white/5 border-white/10 mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Masukkan email"
                        className="bg-white/5 border-white/10 mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Nomor WhatsApp</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Contoh: 08123456789"
                        className="bg-white/5 border-white/10 mt-2"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold mt-4"
                    >
                      Lanjut ke Pembayaran
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="bg-white/5 border-white/10 sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-400">{item.quantity}x</p>
                        </div>
                        <span className="text-green-400">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4 bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-green-400">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Metode Pembayaran</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                      { method: 'QRIS' as PaymentMethod, icon: QrCode, color: 'bg-blue-500' },
                      { method: 'DANA' as PaymentMethod, icon: Wallet, color: 'bg-blue-600' },
                      { method: 'GOPAY' as PaymentMethod, icon: Smartphone, color: 'bg-green-500' },
                    ].map((payment) => (
                      <button
                        key={payment.method}
                        onClick={() => handlePaymentSelect(payment.method)}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          selectedPayment === payment.method
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-white/10 hover:border-white/30 bg-white/5'
                        }`}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-lg ${payment.color} flex items-center justify-center`}>
                          <payment.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-semibold">{payment.method}</p>
                      </button>
                    ))}
                  </div>

                  {selectedPayment && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-4">Cara Pembayaran {selectedPayment}</h3>
                      <div className="space-y-3">
                        {getPaymentInstructions(selectedPayment).map((step, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                          >
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs text-green-400">{index + 1}</span>
                            </div>
                            <span className="text-gray-300 text-sm">{step}</span>
                          </div>
                        ))}
                      </div>

                      {/* QR Code Placeholder for QRIS */}
                      {selectedPayment === 'QRIS' && (
                        <div className="mt-6 p-6 bg-white rounded-xl text-center">
                          <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                            <QrCode className="w-32 h-32 text-gray-800" />
                          </div>
                          <p className="mt-4 text-black text-sm">Scan kode QR di atas</p>
                        </div>
                      )}

                      <Button
                        className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold mt-6"
                        onClick={handleConfirmPayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Memproses...
                          </>
                        ) : (
                          'Konfirmasi Pembayaran'
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="bg-white/5 border-white/10 sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Nama</span>
                      <span>{formData.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Email</span>
                      <span>{formData.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">WhatsApp</span>
                      <span>{formData.phone}</span>
                    </div>
                  </div>
                  <Separator className="my-4 bg-white/10" />
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-xs text-gray-400">{item.quantity}x</p>
                        </div>
                        <span className="text-green-400 text-sm">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4 bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-green-400">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 'confirmation' && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-400" />
                </div>
                
                <h2 className="text-2xl font-bold mb-2">Pesanan Berhasil!</h2>
                <p className="text-gray-400 mb-6">
                  Terima kasih telah berbelanja. Pesanan Anda sedang diproses.
                </p>

                <div className="bg-white/5 rounded-xl p-6 mb-6">
                  <p className="text-sm text-gray-400 mb-2">Order ID</p>
                  <div className="flex items-center justify-center gap-3">
                    <code className="text-2xl font-bold text-green-400">{orderId}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyOrderId}
                      className="hover:bg-white/10"
                    >
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-400">
                    Simpan Order ID Anda untuk melacak status pesanan
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => onOrderComplete(orderId)}
                      className="bg-green-500 hover:bg-green-600 text-black"
                    >
                      Cek Status Pesanan
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onBack}
                      className="border-white/20"
                    >
                      Kembali ke Toko
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
