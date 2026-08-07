import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SystemStats, ImageItem, BlogPost, Announcement, SiteSettings, AdConfig } from '../types';
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
  FileText,
  Bell,
  Settings,
  DollarSign,
  Activity,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'stats' | 'images' | 'blogs' | 'announcements' | 'settings' | 'ads' | 'tests'
  >('stats');

  const [stats, setStats] = useState<SystemStats | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [ads, setAds] = useState<Partial<AdConfig>>({});

  // Tests
  const [cloudinaryTestRes, setCloudinaryTestRes] = useState<any>(null);
  const [firebaseTestRes, setFirebaseTestRes] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  // New Blog state
  const [newBlog, setNewBlog] = useState({ title: '', summary: '', content: '', category: 'Rehber' });

  // New Announcement state
  const [newAnn, setNewAnn] = useState({ title: '', message: '', type: 'info' as const });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = () => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});

    fetch('/api/images?onlyPublic=false')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.images) setImages(data.images);
      })
      .catch(() => {});

    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBlogs(data);
      })
      .catch(() => {});

    fetch('/api/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAnnouncements(data);
      })
      .catch(() => {});

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
        if (data.ads) setAds(data.ads);
      })
      .catch(() => {});
  };

  const handleRunCloudinaryTest = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/admin/cloudinary-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cloudName: settings.cloudinaryCloudName,
          apiKey: settings.cloudinaryApiKey,
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

  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, ads }),
      });
      if (res.ok) {
        showToast('Site ayarları güncellendi!', 'success');
      }
    } catch (err) {
      showToast('Ayarlar kaydedilemedi.', 'error');
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setImages((prev) => prev.filter((i) => i.id !== id));
        showToast('Resim silindi', 'success');
      }
    } catch (err) {
      showToast('Resim silinemedi', 'error');
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog),
      });
      if (res.ok) {
        const created = await res.json();
        setBlogs((prev) => [created, ...prev]);
        setNewBlog({ title: '', summary: '', content: '', category: 'Rehber' });
        showToast('Blog yazısı yayınlandı!', 'success');
      }
    } catch (err) {
      showToast('Blog eklenemedi', 'error');
    }
  };

  const handleCreateAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnn),
      });
      if (res.ok) {
        const created = await res.json();
        setAnnouncements((prev) => [created, ...prev]);
        setNewAnn({ title: '', message: '', type: 'info' });
        showToast('Duyuru yayınlandı!', 'success');
      }
    } catch (err) {
      showToast('Duyuru eklenemedi', 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold">Yönetici Yetkisi Gerekli</h2>
        <p className="text-xs text-slate-500">Bu panele erişmek için yönetici yetkisine sahip olmalısınız.</p>
      </div>
    );
  }

  const chartData = [
    { name: 'Görseller', value: stats?.totalImages || 0 },
    { name: 'Kullanıcılar', value: stats?.totalUsers || 1 },
    { name: 'İzlenmeler', value: stats?.totalViews || 0 },
    { name: 'İndirmeler', value: stats?.totalDownloads || 0 },
  ];

  const COLORS = ['#4f46e5', '#0284c7', '#10b981', '#f59e0b'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Admin Paneli
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sistem Yönetim Merkezi</h1>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" /> Verileri Yenile
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
            activeTab === 'stats' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> İstatistikler
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
            activeTab === 'images' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Resimler ({images.length})
        </button>

        <button
          onClick={() => setActiveTab('blogs')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
            activeTab === 'blogs' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" /> Blog ({blogs.length})
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
            activeTab === 'announcements' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" /> Duyurular
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
            activeTab === 'settings' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" /> Site Ayarları
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
            activeTab === 'ads' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Reklam Yönetimi
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
            activeTab === 'tests' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" /> Bağlantı Testleri
        </button>
      </div>

      {/* Tab 1: Stats & Graphs */}
      {activeTab === 'stats' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Toplam Görsel</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalImages}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Depolama Alanı</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalStorageMB} MB</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Toplam İzlenme</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalViews}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Silinen Görseller</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.deletedImagesCount}</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Sistem Metrikleri Dağılımı</h3>
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
        </div>
      )}

      {/* Tab 2: Images Management */}
      {activeTab === 'images' && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-900">Yüklü Görseller ({images.length})</h3>
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
            {images.map((img) => (
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
                      {img.format.toUpperCase()} • {(img.size / 1024).toFixed(0)} KB • Yükleyen: {img.userName || 'Anonim'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Sil
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Blogs Management */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateBlog} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Yeni Blog Yazısı Yayınla</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Başlık</label>
                <input
                  type="text"
                  required
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Özet</label>
                <input
                  type="text"
                  required
                  value={newBlog.summary}
                  onChange={(e) => setNewBlog({ ...newBlog, summary: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">İçerik (Markdown / Düz Metin)</label>
              <textarea
                rows={4}
                required
                value={newBlog.content}
                onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <button type="submit" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold">
              Yayınla
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateAnn} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Site İçi Duyuru Oluştur</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duyuru Başlığı</label>
                <input
                  type="text"
                  required
                  value={newAnn.title}
                  onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duyuru Mesajı</label>
                <input
                  type="text"
                  required
                  value={newAnn.message}
                  onChange={(e) => setNewAnn({ ...newAnn, message: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <button type="submit" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold">
              Duyuruyu Yayınla
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: Site Settings */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Site Ayarları & SEO</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Site Adı</label>
              <input
                type="text"
                value={settings.siteName || ''}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Maksimum Yükleme Boyutu (MB)</label>
              <input
                type="number"
                value={settings.maxUploadSizeMB || 25}
                onChange={(e) => setSettings({ ...settings, maxUploadSizeMB: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cloudinary Cloud Name</label>
            <input
              type="text"
              value={settings.cloudinaryCloudName || ''}
              onChange={(e) => setSettings({ ...settings, cloudinaryCloudName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
            />
          </div>

          <button
            onClick={handleSaveSettings}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
          >
            Ayarları Kaydet
          </button>
        </div>
      )}

      {/* Tab 6: Connection Tests */}
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
              className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
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
