import { useEffect, useRef } from 'react';
import { ShoppingCart, Zap, Shield, Clock, ChevronRight, Star, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/hooks/useStore';
import { toast } from 'sonner';

interface StorePageProps {
  onProductClick: (productId: string) => void;
  searchQuery?: string;
}

export default function StorePage({ onProductClick, searchQuery = '' }: StorePageProps) {
  const { products, addToCart } = useStore();
  const heroRef = useRef<HTMLDivElement>(null);

  // Filter active products based on search
  const activeProducts = products.filter(p => 
    p.isActive && 
    (searchQuery === '' || 
     p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.stopPropagation();
    if (product.stock <= 0) {
      toast.error('Stok habis!');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          ref={heroRef}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&h=1080&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                opacity: 0.3 + Math.random() * 0.5,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Digital Solutions Premium</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent">
            PTEROHUB.ID
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Solusi Digital Premium
          </p>
          
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Destinasi utama untuk Pterodactyl Panel, script bot WhatsApp, dan infrastruktur digital berperforma tinggi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Lihat Produk
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => toast.info('Hubungi kami di WhatsApp: +62 812-3456-7890')}
              className="border-white/20 hover:bg-white/10"
            >
              Hubungi Support
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-gray-500 rotate-90" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-gray-400">Keunggulan yang kami tawarkan untuk Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Pengiriman Instan', desc: 'Sistem pengiriman otomatis' },
              { icon: Clock, title: 'Support 24/7', desc: 'Selalu siap membantu Anda' },
              { icon: Shield, title: 'Pembayaran Aman', desc: 'Multiple payment options' },
              { icon: Star, title: 'Kualitas Terjamin', desc: 'Produk premium saja' },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 hover:border-green-500/50 transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Produk Kami</h2>
              <p className="text-gray-400">Solusi digital berkualitas untuk kebutuhan Anda</p>
            </div>
            {searchQuery && (
              <div className="mt-4 md:mt-0">
                <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                  Hasil pencarian: "{searchQuery}"
                </Badge>
              </div>
            )}
          </div>

          {activeProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400">Tidak ada produk</h3>
              <p className="text-gray-500">Produk yang Anda cari tidak ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="bg-white/5 border-white/10 overflow-hidden group cursor-pointer hover:border-green-500/50 transition-all duration-300"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                  onClick={() => onProductClick(product.id)}
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    
                    {/* Stock Badge */}
                    <div className="absolute top-4 left-4">
                      {product.stock > 0 ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Stok: {product.stock}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Habis
                        </Badge>
                      )}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-black/50 text-white">
                        {product.category}
                      </Badge>
                    </div>

                    {/* Price Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-white">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-green-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.features.slice(0, 3).map((feature, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.stock <= 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Metode Pembayaran</h2>
          <p className="text-gray-400 mb-12">Pilih metode pembayaran yang paling nyaman untuk Anda</p>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              { name: 'QRIS', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/QRIS_logo.svg/200px-QRIS_logo.svg.png' },
              { name: 'DANA', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/200px-Logo_dana_blue.svg.png' },
              { name: 'GOPAY', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/200px-Gopay_logo.svg.png' },
            ].map((payment) => (
              <div
                key={payment.name}
                className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-xs">{payment.name[0]}</span>
                </div>
                <span className="font-semibold">{payment.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
