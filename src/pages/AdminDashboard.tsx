import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSite } from '../context/SiteContext';
import { ImageItem, Announcement, SiteSettings, AdConfig } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ShieldCheck,
  BarChart3,
  Image as ImageIcon,
  Bell,
  Settings,
  DollarSign,
  Activity,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Edit2,
  Eye,
  EyeOff,
  Sparkles,
  Wrench,
  Zap,
  Shield,
  Gift,
  ExternalLink,
  Clock,
  HardDrive,
  Download,
  Users,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const {
    settings: siteSettings,
    ads: adSettings,
    allAnnouncements,
    stats,
    refreshData,
    setAnnouncementsState,
  } = useSite();

  const [activeTab, setActiveTab] = useState<'stats' | 'images' | 'announcements' | 'settings' | 'ads' | 'tests'>('stats');

  const [images, setImages] = useState<ImageItem[]>([]);
  const [localSettings, setLocalSettings] = useState<Partial<SiteSettings>>(siteSettings);
  const [localAds, setLocalAds] = useState<Partial<AdConfig>>(adSettings);

  // Live real-time polling state
  const [isLivePolling, setIsLivePolling] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Connection tests
  const [cloudinaryTestRes, setCloudinaryTestRes] = useState<any>(null);
  const [firebaseTestRes, setFirebaseTestRes] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  // Announcement Form State
  const [newAnn, setNewAnn] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'alert' | 'update',
    badge: 'DUYURU',
    linkUrl: '',
    linkText: '',
    active: true,
    displayMode: 'banner' as 'banner' | 'modal' | 'both',
    priority: 'normal' as 'low' | 'normal' | 'high',
  });

  // Edit Announcement Modal State
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);

  // Sync settings/ads state when context changes
  useEffect(() => {
    setLocalSettings(siteSettings);
    setLocalAds(adSettings);
  }, [siteSettings, adSettings]);

  // Load images
  const fetchAdminImages = useCallback(async () => {
    try {
      const res = await fetch('/api/images?onlyPublic=false');
      const data = await res.json();
      if (data && data.images) {
        setImages(data.images);
      }
    } catch (err) {
      console.warn('Admin images fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchAdminImages();
  }, [fetchAdminImages]);

  // Live refresh handler
  const handleManualRefresh = async () => {
    await refreshData();
    await fetchAdminImages();
    setLastUpdated(new Date());
    showToast('Canlı veriler güncellendi!', 'success');
  };

  // Auto poll for instant live stats
  useEffect(() => {
    if (!isLivePolling) return;
    const interval = setInterval(async () => {
      await refreshData();
      setLastUpdated(new Date());
    }, 3000);
    return () => clearInterval(interval);
  }, [isLivePolling, refreshData]);

  // Handle Ready Templates for Announcements
  const applyTemplate = (type: 'bakim' | 'ozellik' | 'hiz' | 'guvenlik' | 'kutlama') => {
    switch (type) {
      case 'bakim':
        setNewAnn({
          title: '🛠️ Planlı Altyapı Bakımı',
          message: 'Sistemlerimizde performans ve güvenlik güncellemeleri yapılmaktadır. Hizmetlerimiz kesintisiz devam etmektedir.',
          type: 'warning',
          badge: 'BAKIM',
          linkUrl: '',
          linkText: '',
          active: true,
          displayMode: 'both',
          priority: 'high',
        });
        break;
      case 'ozellik':
        setNewAnn({
          title: '🚀 İnan Hızlı Medya V2.5 Yayında!',
          message: 'Yenilenen ultra hızlı CDN altyapımız, otomatik WEBP/AVIF optimizasyonu ve canlı performans paneli aktif edildi!',
          type: 'update',
          badge: 'YENİ SÜRÜM',
          linkUrl: '/upload',
          linkText: 'Hemen Dene',
          active: true,
          displayMode: 'banner',
          priority: 'normal',
        });
        break;
      case 'hiz':
        setNewAnn({
          title: '⚡ Yüksek Hız Performans Güncellemesi',
          message: 'Sunucu yanıt sürelerimiz %50 hızlandırıldı. Tüm yükleme ve indirmeleriniz artık daha seri.',
          type: 'success',
          badge: 'PERFORMANS',
          linkUrl: '',
          linkText: '',
          active: true,
          displayMode: 'banner',
          priority: 'normal',
        });
        break;
      case 'guvenlik':
        setNewAnn({
          title: '🛡️ Gizlilik ve Güvenlik Sözleşmesi',
          message: 'Veri gizliliği şartlarımız güncellenmiştir. Tüm görselleriniz uçtan uca yüksek güvenlik standartlarında korunmaktadır.',
          type: 'info',
          badge: 'GÜVENLİK',
          linkUrl: '/gizlilik-politikasi',
          linkText: 'Politikayı Oku',
          active: true,
          displayMode: 'banner',
          priority: 'normal',
        });
        break;
      case 'kutlama':
        setNewAnn({
          title: '🎉 Sınırsız & Ücretsiz Görsel Barındırma',
          message: 'Büyüyen topluluğumuza özel olarak ücretsiz görsel yükleme kotası ve yüksek çözünürlüklü indirme imkanı sunuyoruz.',
          type: 'success',
          badge: 'FIRSAT',
          linkUrl: '',
          linkText: '',
          active: true,
          displayMode: 'banner',
          priority: 'normal',
        });
        break;
    }
    showToast('Hazır taslak forma uygulandı!', 'info');
  };

  // Create Announcement
  const handleCreateAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnn),
      });
      if (res.ok) {
        setNewAnn({
          title: '',
          message: '',
          type: 'info',
          badge: 'DUYURU',
          linkUrl: '',
          linkText: '',
          active: true,
          displayMode: 'banner',
          priority: 'normal',
        });
        await refreshData();
        showToast('Yeni duyuru anında sitede yayınlandı!', 'success');
      }
    } catch (err) {
      showToast('Duyuru oluşturulamadı', 'error');
    }
  };

  // Toggle Announcement Active state
  const handleToggleAnn = async (id: string) => {
    try {
      const res = await fetch(`/api/announcements/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        await refreshData();
        showToast('Duyuru durumu anında güncellendi!', 'success');
      }
    } catch (err) {
      showToast('Durum değiştirilemedi', 'error');
    }
  };

  // Update Announcement
  const handleUpdateAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnn) return;
    try {
      const res = await fetch(`/api/announcements/${editingAnn.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAnn),
      });
      if (res.ok) {
        setEditingAnn(null);
        await refreshData();
        showToast('Duyuru başarıyla düzenlendi ve siteye yansıtıldı!', 'success');
      }
    } catch (err) {
      showToast('Duyuru güncellenemedi', 'error');
    }
  };

  // Delete Announcement
  const handleDeleteAnn = async (id: string) => {
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshData();
        showToast('Duyuru silindi!', 'success');
      }
    } catch (err) {
      showToast('Duyuru silinemedi', 'error');
    }
  };

  // Delete Image
  const handleDeleteImage = async (id: string) => {
    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setImages((prev) => prev.filter((i) => i.id !== id));
        await refreshData();
        showToast('Görsel silindi!', 'success');
      }
    } catch (err) {
      showToast('Görsel silinemedi', 'error');
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: localSettings, ads: localAds }),
      });
      if (res.ok) {
        await refreshData();
        showToast('Site ayarları anında site geneline uygulandı!', 'success');
      }
    } catch (err) {
      showToast('Ayarlar kaydedilemedi.', 'error');
    }
  };

  // Tests
  const handleRunCloudinaryTest = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/admin/cloudinary-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cloudName: localSettings.cloudinaryCloudName,
          apiKey: localSettings.cloudinaryApiKey,
        }),
      });
      const data = await res.json();
      setCloudinaryTestRes(data);
      showToast(data.message, data.success ? 'success' : 'error');
    } catch (err) {
      showToast('Test sırasında hata oluştu.', 'error');
    } finally {
      setTesting(false);
    }
  };

  const handleRunFirebaseTest = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/admin/firebase-test', { method: 'POST' });
      const data = await res.json();
      setFirebaseTestRes(data);
      showToast(data.message, data.success ? 'success' : 'error');
    } catch (err) {
      showToast('Firebase testi başarısız oldu.', 'error');
    } finally {
      setTesting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold">Yönetici Yetkisi Gerekli</h2>
        <p className="text-xs text-slate-500">Bu panele erişmek için yönetici hesabıyla giriş yapmalısınız.</p>
      </div>
    );
  }

  const chartData = [
    { name: 'Görseller', value: stats?.totalImages || 0 },
    { name: 'Kullanıcılar', value: stats?.totalUsers || 1 },
    { name: 'İzlenmeler', value: stats?.totalViews || 0 },
    { name: 'İndirmeler', value: stats?.totalDownloads || 0 },
  ];

  const pieData = [
    { name: 'Depolama (MB)', value: stats?.totalStorageMB || 10 },
    { name: 'Bant Genişliği (MB)', value: stats?.bandwidthUsedMB || 25 },
  ];

  const COLORS = ['#4f46e5', '#10b981', '#0284c7', '#f59e0b'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Live Real-time Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Admin Yönetim Paneli
            </span>

            {/* Live Indicator */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              ANLIK CANLI
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sistem Yönetim & Duyuru Merkezi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Son güncelleme: {lastUpdated.toLocaleTimeString()} (Tüm değişiklikler anında siteye yansır)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLivePolling(!isLivePolling)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              isLivePolling
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            {isLivePolling ? 'Anlık Senkronizasyon Açık' : 'Anlık Senkronizasyon Kapalı'}
          </button>

          <button
            onClick={handleManualRefresh}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Yenile
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Blog panel completely removed) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'stats'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Canlı İstatistikler
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'announcements'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" /> Gelişmiş Duyuru Sistemi
          <span className="px-1.5 py-0.2 bg-indigo-500 text-white rounded-full text-[10px] font-bold">
            {allAnnouncements.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'images'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Resimler ({images.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" /> Site Ayarları
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'ads'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Reklam Yönetimi
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'tests'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" /> Bağlantı Testleri
        </button>
      </div>

      {/* TAB 1: Live Real-time Statistics */}
      {activeTab === 'stats' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Toplam Görsel</span>
                <ImageIcon className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{stats?.totalImages || 0}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Anlık Güncel</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Depolama</span>
                <HardDrive className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{stats?.totalStorageMB || 0} MB</p>
              <p className="text-[10px] text-slate-500">Kullanılan Alan</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Görüntülenme</span>
                <Eye className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{stats?.totalViews || 0}</p>
              <p className="text-[10px] text-slate-500">Toplam Sayfa Tekili</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">İndirme</span>
                <Download className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{stats?.totalDownloads || 0}</p>
              <p className="text-[10px] text-slate-500">İndirme Sayısı</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Kullanıcılar</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{stats?.totalUsers || 1}</p>
              <p className="text-[10px] text-slate-500">Kayıtlı Profil</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Silinenler</span>
                <Trash2 className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{stats?.deletedImagesCount || 0}</p>
              <p className="text-[10px] text-slate-500">Temizlenen Resim</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Anlık Sistem Metrikleri Grafik Analizi</h3>
                <span className="text-xs text-slate-400">Canlı Bağlantı: OK</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Trafik ve Bant Genişliği</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center text-xs text-slate-500">
                Tahmini Bant Genişliği Kullanımı: <span className="font-bold text-slate-900">{stats?.bandwidthUsedMB || 0} MB</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Advanced Announcement System */}
      {activeTab === 'announcements' && (
        <div className="space-y-8">
          {/* Section 1: Ready-Made Templates / Taslaklar */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-base">Hazır Duyuru Taslakları (Tek Tıkla Uygula)</h3>
            </div>
            <p className="text-xs text-slate-300">
              Sık kullanılan duyuru senaryolarından birini seçerek hemen formu doldurun ve yayınlayın:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <button
                type="button"
                onClick={() => applyTemplate('bakim')}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold mb-1">
                  <Wrench className="w-3.5 h-3.5" /> Planlı Bakım
                </div>
                <p className="text-[10px] text-slate-300 line-clamp-2">Sistem bakım uyarısı taslağı</p>
              </button>

              <button
                type="button"
                onClick={() => applyTemplate('ozellik')}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Yeni Özellik
                </div>
                <p className="text-[10px] text-slate-300 line-clamp-2">Sürüm & özellik güncelleme duyurusu</p>
              </button>

              <button
                type="button"
                onClick={() => applyTemplate('hiz')}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold mb-1">
                  <Zap className="w-3.5 h-3.5" /> Hız & Performans
                </div>
                <p className="text-[10px] text-slate-300 line-clamp-2">Sunucu hızı iyileştirme bildirimi</p>
              </button>

              <button
                type="button"
                onClick={() => applyTemplate('guvenlik')}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-blue-300 text-xs font-bold mb-1">
                  <Shield className="w-3.5 h-3.5" /> Güvenlik
                </div>
                <p className="text-[10px] text-slate-300 line-clamp-2">Gizlilik & güvenlik güncellemesi</p>
              </button>

              <button
                type="button"
                onClick={() => applyTemplate('kutlama')}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-rose-300 text-xs font-bold mb-1">
                  <Gift className="w-3.5 h-3.5" /> Fırsat / Kampanya
                </div>
                <p className="text-[10px] text-slate-300 line-clamp-2">Ücretsiz özellik & hediye duyurusu</p>
              </button>
            </div>
          </div>

          {/* Create Announcement Form */}
          <form onSubmit={handleCreateAnn} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" /> Yeni Duyuru Oluştur & Anında Yayınla
              </span>
              <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Canlı Otomatik Senkronizasyon
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duyuru Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Sistem Bakımı"
                  value={newAnn.title}
                  onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duyuru Türü</label>
                <select
                  value={newAnn.type}
                  onChange={(e) => setNewAnn({ ...newAnn, type: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="info">🔵 Bilgi (Indigo/Mavi)</option>
                  <option value="warning">🟡 Bakım / Uyarı (Amber/Sarı)</option>
                  <option value="success">🟢 Başarılı / Fırsat (Yeşil)</option>
                  <option value="alert">🔴 Kritik / Tehlike (Kırmızı)</option>
                  <option value="update">🟣 Güncelleme (Mor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rozet / Etiket</label>
                <input
                  type="text"
                  placeholder="Örn: YENİ, BAKIM, ÖNEMLİ"
                  value={newAnn.badge}
                  onChange={(e) => setNewAnn({ ...newAnn, badge: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duyuru Mesajı</label>
              <textarea
                rows={2}
                required
                placeholder="Kullanıcılara gösterilecek duyuru metni..."
                value={newAnn.message}
                onChange={(e) => setNewAnn({ ...newAnn, message: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gösterim Modu</label>
                <select
                  value={newAnn.displayMode}
                  onChange={(e) => setNewAnn({ ...newAnn, displayMode: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="banner">Üst Bant (Header Banner)</option>
                  <option value="modal">Modal Pop-up (Açılır Pencere)</option>
                  <option value="both">Her İkisi (Bant + Pop-up)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Öncelik Seviyesi</label>
                <select
                  value={newAnn.priority}
                  onChange={(e) => setNewAnn({ ...newAnn, priority: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="normal">Normal Öncelik</option>
                  <option value="high">Yüksek (Açılışta Ön Sırada)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bağlantı URL (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Örn: /upload veya https://..."
                  value={newAnn.linkUrl}
                  onChange={(e) => setNewAnn({ ...newAnn, linkUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Buton Metni (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Örn: Detayları Gör"
                  value={newAnn.linkText}
                  onChange={(e) => setNewAnn({ ...newAnn, linkText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 block">
                Canlı Önizleme Simülatörü
              </span>
              <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase">
                    {newAnn.badge || 'ETİKET'}
                  </span>
                  <span className="font-bold truncate">{newAnn.title || 'Duyuru Başlığı'}</span>
                  <span className="opacity-80 truncate hidden sm:inline">{newAnn.message || 'Duyuru içeriği metni buraya gelecek.'}</span>
                </div>
                {newAnn.linkText && (
                  <span className="px-2.5 py-1 rounded-lg bg-white text-slate-900 font-bold text-[10px] shrink-0">
                    {newAnn.linkText}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-4 h-4" /> Duyuruyu Anında Yayınla
            </button>
          </form>

          {/* Announcements List */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
              <span>Yayınlanan Tüm Duyurular ({allAnnouncements.length})</span>
              <span className="text-xs text-slate-500 font-normal">
                Aktif olanlar anında sitenin üst bandında görünür.
              </span>
            </h3>

            {allAnnouncements.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 text-xs text-slate-400">
                Henüz duyuru bulunmuyor. Yukarıdaki formdan yeni bir duyuru oluşturabilirsiniz.
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
                {allAnnouncements.map((ann) => (
                  <div key={ann.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase ${
                            ann.type === 'warning'
                              ? 'bg-amber-500'
                              : ann.type === 'alert'
                              ? 'bg-rose-600'
                              : ann.type === 'success'
                              ? 'bg-emerald-600'
                              : ann.type === 'update'
                              ? 'bg-purple-600'
                              : 'bg-indigo-600'
                          }`}
                        >
                          {ann.badge || ann.type}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ann.active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {ann.active ? 'Sitede Yayında' : 'Yayında Değil (Pasif)'}
                        </span>

                        <h4 className="font-bold text-xs text-slate-900">{ann.title}</h4>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{ann.message}</p>

                      {ann.linkUrl && (
                        <p className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> {ann.linkText || 'Bağlantı'}: {ann.linkUrl}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleToggleAnn(ann.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                          ann.active
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {ann.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {ann.active ? 'Pasife Al' : 'Yayına Al'}
                      </button>

                      <button
                        onClick={() => setEditingAnn(ann)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Düzenle
                      </button>

                      <button
                        onClick={() => handleDeleteAnn(ann.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Duyuruyu Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit Announcement Modal */}
          {editingAnn && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
                <h3 className="font-bold text-base text-slate-900">Duyuruyu Düzenle</h3>

                <form onSubmit={handleUpdateAnn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Duyuru Başlığı</label>
                    <input
                      type="text"
                      required
                      value={editingAnn.title}
                      onChange={(e) => setEditingAnn({ ...editingAnn, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Duyuru Türü</label>
                    <select
                      value={editingAnn.type}
                      onChange={(e) => setEditingAnn({ ...editingAnn, type: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      <option value="info">🔵 Bilgi (Indigo/Mavi)</option>
                      <option value="warning">🟡 Bakım / Uyarı (Amber/Sarı)</option>
                      <option value="success">🟢 Başarılı / Fırsat (Yeşil)</option>
                      <option value="alert">🔴 Kritik / Tehlike (Kırmızı)</option>
                      <option value="update">🟣 Güncelleme (Mor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Duyuru Metni</label>
                    <textarea
                      rows={3}
                      required
                      value={editingAnn.message}
                      onChange={(e) => setEditingAnn({ ...editingAnn, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Rozet Metni</label>
                      <input
                        type="text"
                        value={editingAnn.badge || ''}
                        onChange={(e) => setEditingAnn({ ...editingAnn, badge: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={editingAnn.active}
                          onChange={(e) => setEditingAnn({ ...editingAnn, active: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        Sitede Yayında Olsun
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingAnn(null)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                    >
                      Değişiklikleri Kaydet
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Images Management */}
      {activeTab === 'images' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900">Yüklü Tüm Görseller ({images.length})</h3>
            <button
              onClick={fetchAdminImages}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Listeyi Yenile
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
            {images.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">Yüklü görsel bulunamadı.</div>
            ) : (
              images.map((img) => (
                <div key={img.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={img.thumbnailUrl || img.url}
                      alt={img.fileName}
                      className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-900 truncate">{img.fileName}</p>
                      <p className="text-[10px] text-slate-500">
                        {img.format.toUpperCase()} • {(img.size / 1024).toFixed(0)} KB • Yükleyen: {img.userName || 'Anonim'} • {img.views} İzlenme
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Sil
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Site Settings */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="font-bold text-sm text-slate-900">Site Genel Ayarları (Anında Yansır)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Site Adı</label>
              <input
                type="text"
                value={localSettings.siteName || ''}
                onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Maksimum Yükleme Boyutu (MB)</label>
              <input
                type="number"
                value={localSettings.maxUploadSizeMB || 25}
                onChange={(e) => setLocalSettings({ ...localSettings, maxUploadSizeMB: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Site Açıklaması</label>
            <input
              type="text"
              value={localSettings.siteDescription || ''}
              onChange={(e) => setLocalSettings({ ...localSettings, siteDescription: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cloudinary Cloud Name</label>
            <input
              type="text"
              value={localSettings.cloudinaryCloudName || ''}
              onChange={(e) => setLocalSettings({ ...localSettings, cloudinaryCloudName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
            />
          </div>

          <button
            onClick={handleSaveSettings}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs hover:bg-slate-800 transition-colors"
          >
            Tüm Ayarları Kaydet
          </button>
        </div>
      )}

      {/* TAB 5: Ads Management */}
      {activeTab === 'ads' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="font-bold text-sm text-slate-900">Sponsorlu Reklam Alanları Yönetimi</h3>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={localAds.bannerEnabled || false}
                  onChange={(e) => setLocalAds({ ...localAds, bannerEnabled: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                Üst Banner Reklamı Aktif
              </label>

              <textarea
                rows={2}
                value={localAds.bannerCode || ''}
                onChange={(e) => setLocalAds({ ...localAds, bannerCode: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={localAds.footerEnabled || false}
                  onChange={(e) => setLocalAds({ ...localAds, footerEnabled: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                Alt (Footer) Reklamı Aktif
              </label>

              <textarea
                rows={2}
                value={localAds.footerCode || ''}
                onChange={(e) => setLocalAds({ ...localAds, footerCode: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
          >
            Reklam Ayarlarını Kaydet
          </button>
        </div>
      )}

      {/* TAB 6: Connection Tests */}
      {activeTab === 'tests' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Cloudinary API Bağlantı Testi</h3>
            <p className="text-xs text-slate-500">
              Cloudinary hesabı API Key, API Secret ve Cloud Name bağlantısını doğrular.
            </p>

            <button
              onClick={handleRunCloudinaryTest}
              disabled={testing}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Cloudinary Testi Çalıştır
            </button>

            {cloudinaryTestRes && (
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[10px] overflow-x-auto">
                {JSON.stringify(cloudinaryTestRes, null, 2)}
              </pre>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Firebase Firestore Bağlantı Testi</h3>
            <p className="text-xs text-slate-500">
              Firebase Proje yapılandırmasını ve Firestore veritabanı durumunu doğrular.
            </p>

            <button
              onClick={handleRunFirebaseTest}
              disabled={testing}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold text-slate-900 font-bold"
            >
              Firebase Testi Çalıştır
            </button>

            {firebaseTestRes && (
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[10px] overflow-x-auto">
                {JSON.stringify(firebaseTestRes, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
