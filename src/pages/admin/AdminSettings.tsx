import { useState } from 'react';
import { 
  Store, 
  Mail, 
  MessageCircle,
  CreditCard,
  Shield,
  Save,
  Lock,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/hooks/useStore';
import { toast } from 'sonner';

interface AdminSettingsProps {
  onNavigate: (page: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings') => void;
}

export default function AdminSettings({ }: AdminSettingsProps) {
  const { settings, updateSettings, admin, updateAdmin, changePassword } = useStore();
  
  // Store settings form
  const [storeForm, setStoreForm] = useState({
    storeName: settings.storeName,
    storeDescription: settings.storeDescription,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    whatsappNumber: settings.whatsappNumber,
  });

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    enableQRIS: settings.enableQRIS,
    enableDANA: settings.enableDANA,
    enableGOPAY: settings.enableGOPAY,
  });

  // Admin profile
  const [profileForm, setProfileForm] = useState({
    username: admin.username,
    email: admin.email || '',
    phone: admin.phone || '',
  });

  // Password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveStore = () => {
    updateSettings({
      ...storeForm,
    });
    toast.success('Pengaturan toko berhasil disimpan');
  };

  const handleSavePayment = () => {
    updateSettings({
      ...paymentSettings,
    });
    toast.success('Pengaturan pembayaran berhasil disimpan');
  };

  const handleSaveProfile = () => {
    updateAdmin({
      username: profileForm.username,
      email: profileForm.email,
      phone: profileForm.phone,
    });
    toast.success('Profil berhasil diperbarui');
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Password baru tidak cocok');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }
    
    // In real app, verify current password first
    changePassword(passwordForm.newPassword);
    toast.success('Password berhasil diubah');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Pengaturan</h1>
          <p className="text-gray-400">Kelola pengaturan toko dan akun admin</p>
        </div>

        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="store" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <Store className="w-4 h-4 mr-2" />
              Toko
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <CreditCard className="w-4 h-4 mr-2" />
              Pembayaran
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <User className="w-4 h-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <Shield className="w-4 h-4 mr-2" />
              Keamanan
            </TabsTrigger>
          </TabsList>

          {/* Store Settings */}
          <TabsContent value="store">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Informasi Toko</CardTitle>
                <CardDescription>Kelola informasi dasar toko Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Nama Toko</Label>
                    <Input
                      value={storeForm.storeName}
                      onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                      className="bg-white/5 border-white/10 mt-2"
                    />
                  </div>
                  <div>
                    <Label>Deskripsi Toko</Label>
                    <Input
                      value={storeForm.storeDescription}
                      onChange={(e) => setStoreForm({ ...storeForm, storeDescription: e.target.value })}
                      className="bg-white/5 border-white/10 mt-2"
                    />
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Informasi Kontak
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Email Kontak</Label>
                      <Input
                        type="email"
                        value={storeForm.contactEmail}
                        onChange={(e) => setStoreForm({ ...storeForm, contactEmail: e.target.value })}
                        className="bg-white/5 border-white/10 mt-2"
                      />
                    </div>
                    <div>
                      <Label>Nomor Telepon</Label>
                      <Input
                        value={storeForm.contactPhone}
                        onChange={(e) => setStoreForm({ ...storeForm, contactPhone: e.target.value })}
                        className="bg-white/5 border-white/10 mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </h4>
                  <div>
                    <Label>Nomor WhatsApp (untuk notifikasi)</Label>
                    <Input
                      value={storeForm.whatsappNumber}
                      onChange={(e) => setStoreForm({ ...storeForm, whatsappNumber: e.target.value })}
                      className="bg-white/5 border-white/10 mt-2"
                      placeholder="6281234567890"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Format: 6281234567890 (tanpa tanda + atau spasi)
                    </p>
                  </div>
                </div>

                <Button onClick={handleSaveStore} className="bg-green-500 hover:bg-green-600 text-black">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Metode Pembayaran</CardTitle>
                <CardDescription>Aktifkan atau nonaktifkan metode pembayaran</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* QRIS */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">QRIS</p>
                        <p className="text-sm text-gray-400">Pembayaran via scan QR code</p>
                      </div>
                    </div>
                    <Switch
                      checked={paymentSettings.enableQRIS}
                      onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableQRIS: checked })}
                    />
                  </div>

                  {/* DANA */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">DANA</p>
                        <p className="text-sm text-gray-400">Pembayaran via DANA</p>
                      </div>
                    </div>
                    <Switch
                      checked={paymentSettings.enableDANA}
                      onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableDANA: checked })}
                    />
                  </div>

                  {/* GOPAY */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">GOPAY</p>
                        <p className="text-sm text-gray-400">Pembayaran via GOPAY</p>
                      </div>
                    </div>
                    <Switch
                      checked={paymentSettings.enableGOPAY}
                      onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableGOPAY: checked })}
                    />
                  </div>
                </div>

                <Button onClick={handleSavePayment} className="bg-green-500 hover:bg-green-600 text-black">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Profil Admin</CardTitle>
                <CardDescription>Kelola informasi akun admin Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-black text-2xl font-bold">
                    {profileForm.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xl font-bold">{profileForm.username}</p>
                    <Badge className="bg-green-500/20 text-green-400">Administrator</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Username</Label>
                    <Input
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      className="bg-white/5 border-white/10 mt-2"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="bg-white/5 border-white/10 mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label>Nomor Telepon</Label>
                  <Input
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="bg-white/5 border-white/10 mt-2"
                  />
                </div>

                <Button onClick={handleSaveProfile} className="bg-green-500 hover:bg-green-600 text-black">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Keamanan</CardTitle>
                <CardDescription>Ubah password akun admin Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Password Saat Ini</Label>
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="bg-white/5 border-white/10 mt-2"
                    placeholder="Masukkan password saat ini"
                  />
                </div>

                <div>
                  <Label>Password Baru</Label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="bg-white/5 border-white/10 mt-2"
                    placeholder="Masukkan password baru"
                  />
                </div>

                <div>
                  <Label>Konfirmasi Password Baru</Label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="bg-white/5 border-white/10 mt-2"
                    placeholder="Konfirmasi password baru"
                  />
                </div>

                <Button 
                  onClick={handleChangePassword} 
                  className="bg-green-500 hover:bg-green-600 text-black"
                  disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Ubah Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
