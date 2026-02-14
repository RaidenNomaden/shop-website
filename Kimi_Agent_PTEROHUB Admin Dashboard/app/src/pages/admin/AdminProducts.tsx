import { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  MoreVertical,
  AlertTriangle,
  Eye,
  TrendingUp,
  Upload,
  Check,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/hooks/useStore';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface AdminProductsProps {
  onNavigate: (page: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings') => void;
}

export default function AdminProducts({ }: AdminProductsProps) {
  const { products, addProduct, updateProduct, deleteProduct, restockProduct } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'sales'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [restockAmount, setRestockAmount] = useState(10);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    category: '',
    image: '',
    features: '',
    isActive: true,
  });

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filter and sort products
  let filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  filteredProducts.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'stock':
        comparison = a.stock - b.stock;
        break;
      case 'sales':
        comparison = a.salesCount - b.salesCount;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      stock: '',
      category: '',
      image: '',
      features: '',
      isActive: true,
    });
    setImagePreview('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Mohon lengkapi data produk');
      return;
    }

    addProduct({
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
      stock: parseInt(formData.stock),
      category: formData.category || 'Lainnya',
      image: formData.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      isActive: formData.isActive,
    });

    toast.success('Produk berhasil ditambahkan');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditProduct = () => {
    if (!selectedProduct) return;

    updateProduct(selectedProduct.id, {
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
      stock: parseInt(formData.stock),
      category: formData.category,
      image: formData.image,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      isActive: formData.isActive,
    });

    toast.success('Produk berhasil diperbarui');
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;

    deleteProduct(selectedProduct.id);
    toast.success('Produk berhasil dihapus');
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleRestock = () => {
    if (!selectedProduct || restockAmount <= 0) return;

    restockProduct(selectedProduct.id, restockAmount);
    toast.success(`Stok ${selectedProduct.name} ditambah ${restockAmount} unit`);
    setIsRestockDialogOpen(false);
    setSelectedProduct(null);
    setRestockAmount(10);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      stock: product.stock.toString(),
      category: product.category,
      image: product.image,
      features: product.features.join(', '),
      isActive: product.isActive,
    });
    setImagePreview(product.image);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const openRestockDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsRestockDialogOpen(true);
  };

  const openPreviewDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsPreviewDialogOpen(true);
  };

  const ProductForm = () => (
    <div className="space-y-4">
      {/* Image Upload */}
      <div>
        <Label>Gambar Produk</Label>
        <div className="mt-2">
          <div 
            className="relative w-full h-48 rounded-xl border-2 border-dashed border-white/20 hover:border-green-500/50 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-400">Klik untuk upload gambar</p>
                <p className="text-xs text-gray-500">atau paste URL di bawah</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <Input
            value={formData.image}
            onChange={(e) => {
              setFormData({ ...formData, image: e.target.value });
              setImagePreview(e.target.value);
            }}
            placeholder="https://..."
            className="bg-white/5 border-white/10 mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nama Produk *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nama produk"
            className="bg-white/5 border-white/10 mt-2"
          />
        </div>
        <div>
          <Label>Kategori *</Label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Kategori"
            className="bg-white/5 border-white/10 mt-2"
            list="categories"
          />
          <datalist id="categories">
            {categories.map(cat => <option key={cat} value={cat} />)}
          </datalist>
        </div>
      </div>

      <div>
        <Label>Deskripsi</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Deskripsi produk"
          className="bg-white/5 border-white/10 mt-2"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Harga *</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Harga"
            className="bg-white/5 border-white/10 mt-2"
          />
        </div>
        <div>
          <Label>Harga Asli (opsional)</Label>
          <Input
            type="number"
            value={formData.originalPrice}
            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
            placeholder="Harga asli"
            className="bg-white/5 border-white/10 mt-2"
          />
        </div>
        <div>
          <Label>Stok *</Label>
          <Input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="Jumlah stok"
            className="bg-white/5 border-white/10 mt-2"
          />
        </div>
      </div>

      <div>
        <Label>Fitur (pisahkan dengan koma)</Label>
        <Input
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          placeholder="Fitur 1, Fitur 2, Fitur 3"
          className="bg-white/5 border-white/10 mt-2"
        />
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <div>
          <Label className="cursor-pointer">Produk Aktif</Label>
          <p className="text-xs text-gray-400">Produk akan ditampilkan di toko</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Kelola Produk</h1>
            <p className="text-gray-400">Tambah, edit, dan kelola produk toko</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Total Produk</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Aktif</p>
              <p className="text-2xl font-bold text-green-400">{products.filter(p => p.isActive).length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Stok Menipis</p>
              <p className={`text-2xl font-bold ${products.filter(p => p.stock <= 5).length > 0 ? 'text-yellow-400' : ''}`}>
                {products.filter(p => p.stock <= 5).length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Total Penjualan</p>
              <p className="text-2xl font-bold text-green-400">
                {products.reduce((sum, p) => sum + p.salesCount, 0)}
              </p>
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
              placeholder="Cari produk..."
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              <SelectItem value="name">Nama</SelectItem>
              <SelectItem value="price">Harga</SelectItem>
              <SelectItem value="stock">Stok</SelectItem>
              <SelectItem value="sales">Penjualan</SelectItem>
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

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-400">Tidak ada produk</h3>
              <p className="text-gray-500 mt-2">Tambahkan produk pertama Anda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className={`bg-white/5 border-white/10 overflow-hidden group ${
                  !product.isActive ? 'opacity-60' : ''
                }`}
              >
                {/* Product Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {!product.isActive ? (
                      <Badge variant="secondary" className="bg-gray-500/50">Nonaktif</Badge>
                    ) : product.stock <= 5 ? (
                      <Badge variant="destructive">Stok: {product.stock}</Badge>
                    ) : (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Stok: {product.stock}
                      </Badge>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/50 hover:bg-black/70 h-8 w-8"
                      onClick={() => openPreviewDialog(product)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-end gap-2">
                      <p className="text-xl font-bold text-white">{formatPrice(product.price)}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <p className="text-xs text-gray-400">{product.category}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-black border-white/10">
                        <DropdownMenuItem onClick={() => openEditDialog(product)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openRestockDialog(product)}>
                          <Package className="w-4 h-4 mr-2" />
                          Restock
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openPreviewDialog(product)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(product)}
                          className="text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {product.salesCount} terjual
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {product.views} dilihat
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {product.features.slice(0, 2).map((feature, i) => (
                      <Badge key={i} variant="secondary" className="bg-white/5 text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {product.features.length > 2 && (
                      <Badge variant="secondary" className="bg-white/5 text-xs">
                        +{product.features.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Product Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-black border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Produk Baru</DialogTitle>
              <DialogDescription>Isi detail produk baru Anda</DialogDescription>
            </DialogHeader>
            <ProductForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddProduct} className="bg-green-500 hover:bg-green-600 text-black">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Produk
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-black border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Produk</DialogTitle>
              <DialogDescription>Ubah detail produk</DialogDescription>
            </DialogHeader>
            <ProductForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleEditProduct} className="bg-green-500 hover:bg-green-600 text-black">
                <Check className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-black border-white/10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Hapus Produk
              </DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus produk <strong>{selectedProduct?.name}</strong>?
                Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDeleteProduct}>
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Restock Dialog */}
        <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
          <DialogContent className="bg-black border-white/10">
            <DialogHeader>
              <DialogTitle>Restock Produk</DialogTitle>
              <DialogDescription>
                Stok saat ini: <strong>{selectedProduct?.stock}</strong> unit
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Jumlah Restock</Label>
                <Input
                  type="number"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
                  className="bg-white/5 border-white/10 mt-2"
                  min={1}
                  autoFocus
                />
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-sm text-gray-400">Stok setelah restock</p>
                <p className="text-2xl font-bold text-green-400">
                  {(selectedProduct?.stock || 0) + restockAmount} unit
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRestockDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleRestock} className="bg-green-500 hover:bg-green-600 text-black">
                <Package className="w-4 h-4 mr-2" />
                Tambah Stok
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="bg-black border-white/10 max-w-lg">
            <DialogHeader>
              <DialogTitle>Preview Produk</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div>
                  <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                  <p className="text-gray-400">{selectedProduct.category}</p>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-2xl font-bold text-green-400">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-gray-500 line-through">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{selectedProduct.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.features.map((feature, i) => (
                    <Badge key={i} className="bg-green-500/20 text-green-400">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-white/5">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedProduct.stock}</p>
                    <p className="text-xs text-gray-400">Stok</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedProduct.salesCount}</p>
                    <p className="text-xs text-gray-400">Terjual</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedProduct.views}</p>
                    <p className="text-xs text-gray-400">Dilihat</p>
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
