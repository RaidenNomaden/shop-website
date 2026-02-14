import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Check, Package, Clock, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/hooks/useStore';
import { toast } from 'sonner';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onCheckout: () => void;
}

export default function ProductDetailPage({ productId, onBack, onCheckout }: ProductDetailPageProps) {
  const { products, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-400">Produk tidak ditemukan</h2>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Stok habis!');
      return;
    }
    
    // Add multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    toast.success(`${quantity}x ${product.name} ditambahkan ke keranjang`);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) {
      toast.error('Stok habis!');
      return;
    }
    
    // Add to cart first
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    onCheckout();
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Toko
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden bg-white/5">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {product.category}
              </Badge>
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="destructive">
                  Stok Terbatas
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-bold text-green-400">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-gray-400 mb-6">{product.description}</p>

            {/* Stock Info */}
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-gray-400" />
              <span className={product.stock > 0 ? 'text-green-400' : 'text-red-400'}>
                {product.stock > 0 ? `Stok tersedia: ${product.stock}` : 'Stok habis'}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-400">Jumlah:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-white/20"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="border-white/20"
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="flex-1 bg-green-500 hover:bg-green-600 text-black font-semibold"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Tambah ke Keranjang
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 border-green-500 text-green-400 hover:bg-green-500/10"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
              >
                Beli Sekarang
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Clock, text: 'Pengiriman Instan' },
                { icon: Shield, text: 'Garansi 7 Hari' },
                { icon: Check, text: 'Produk Original' },
                { icon: Star, text: 'Support 24/7' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-400">
                  <item.icon className="w-4 h-4 text-green-400" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="features" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
                Fitur
              </TabsTrigger>
              <TabsTrigger value="description" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
                Deskripsi Lengkap
              </TabsTrigger>
              <TabsTrigger value="howto" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
                Cara Pembelian
              </TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Fitur Produk</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 rounded-lg bg-white/5"
                      >
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-400" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="description" className="mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Deskripsi Lengkap</h3>
                  <div className="space-y-4 text-gray-400">
                    <p>{product.description}</p>
                    <p>
                      Produk ini dirancang untuk memberikan pengalaman terbaik dalam mengelola 
                      infrastruktur digital Anda. Dengan fitur-fitur canggih dan antarmuka yang 
                      intuitif, Anda dapat dengan mudah mengelola dan mengoptimalkan sistem Anda.
                    </p>
                    <p>
                      Setiap pembelian dilengkapi dengan dokumentasi lengkap dan dukungan teknis 
                      dari tim kami. Kami berkomitmen untuk memberikan produk berkualitas tinggi 
                      dengan harga yang kompetitif.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="howto" className="mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Cara Pembelian</h3>
                  <div className="space-y-4">
                    {[
                      'Pilih produk yang ingin dibeli',
                      'Klik "Tambah ke Keranjang" atau "Beli Sekarang"',
                      'Isi data diri dan pilih metode pembayaran',
                      'Lakukan pembayaran sesuai instruksi',
                      'Produk akan dikirim otomatis setelah pembayaran dikonfirmasi',
                    ].map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg bg-white/5"
                      >
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-black font-bold shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
