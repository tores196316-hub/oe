import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Download,
  Copy,
  Check,
  Share2,
  Trash2,
  ExternalLink,
  QrCode,
  Eye,
  Calendar,
  HardDrive,
  Maximize2,
  Minimize2,
  Info,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { ImageItem } from '../types';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { QRModal } from '../components/QRModal';

export const ImageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [image, setImage] = useState<ImageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeEmbed, setActiveEmbed] = useState<'page' | 'short_direct' | 'direct' | 'webp' | 'html' | 'markdown' | 'bbcode'>('short_direct');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const { showToast } = useToast();
  const { userProfile } = useAuth();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/images/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Görsel bulunamadı');
        return res.json();
      })
      .then((data) => {
        setImage(data);
      })
      .catch((err) => {
        setError(err.message || 'Görsel yüklenemedi');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = () => {
    if (!image) return;

    // Trigger download stats
    fetch(`/api/images/${image.id}/download`, { method: 'POST' }).catch(() => {});

    const a = document.createElement('a');
    a.href = image.url;
    a.download = image.fileName;
    a.target = '_blank';
    a.click();

    showToast('İndirme başlatıldı', 'success');
  };

  const handleShare = async () => {
    if (!image) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title || image.fileName,
          text: 'İnan Hızlı Medya üzerinden resim detayını incele:',
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link panoya kopyalandı!', 'success');
    }
  };

  const handleDelete = async () => {
    if (!image) return;
    if (userProfile?.role !== 'admin') {
      showToast('Normal kullanıcıların resim silme yetkisi bulunmamaktadır.', 'error');
      setDeleteModalOpen(false);
      return;
    }
    try {
      const res = await fetch(`/api/images/${image.id}?role=admin`, {
        method: 'DELETE',
        headers: { 'x-admin-role': 'admin' },
      });
      if (res.ok) {
        showToast('Görsel başarıyla silindi', 'success');
        navigate('/upload');
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Silme işlemi başarısız.');
      }
    } catch (err: any) {
      showToast(err.message || 'Hata oluştu', 'error');
    }
  };

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Link panoya kopyalandı!', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-500">Görsel detayları yükleniyor...</p>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4 bg-white dark:bg-[#12131b] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Görsel Bulunamadı</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Aradığınız resim kaldırılmış veya geçersiz bir bağlantı kullanıyor olabilirsiniz.</p>
        <Link
          to="/galeri"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-semibold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Galeriye Dön
        </Link>
      </div>
    );
  }

  const sitePageUrl = image ? `${window.location.origin}/resim/${image.id}` : '';
  const shortDirectUrl = image ? `${window.location.origin}/i/${image.id}` : '';

  const getEmbedCode = () => {
    if (!image) return '';
    switch (activeEmbed) {
      case 'short_direct':
        return shortDirectUrl;
      case 'page':
        return sitePageUrl;
      case 'direct':
        return image.url;
      case 'webp':
        return image.webpUrl || shortDirectUrl;
      case 'html':
        return `<a href="${sitePageUrl}" target="_blank"><img src="${shortDirectUrl}" alt="${image.title || image.fileName}" /></a>`;
      case 'markdown':
        return `[![${image.title || image.fileName}](${shortDirectUrl})](${sitePageUrl})`;
      case 'bbcode':
        return `[url=${sitePageUrl}][img]${shortDirectUrl}[/img][/url]`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top back button */}
      <Link
        to="/galeri"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#12131b] border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Galeriye Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Image View Box */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-3xl bg-slate-900 dark:bg-[#0c0d13] overflow-hidden shadow-xl flex items-center justify-center p-4 min-h-[400px] border dark:border-slate-800">
            <img
              src={image.url}
              alt={image.title || image.fileName}
              className={`max-h-[600px] w-auto object-contain rounded-xl transition-all ${
                isFullscreen ? 'fixed inset-0 z-50 max-h-screen w-full bg-slate-950 p-6 object-contain' : ''
              }`}
            />

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/70 text-white hover:bg-slate-900 backdrop-blur-md transition-colors"
              title="Tam Ekran Modu"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#12131b] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownload}
                className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-4 h-4 text-indigo-400 dark:text-indigo-200" />
                İndir
              </button>

              <button
                onClick={() => copyCode(sitePageUrl, 'direct_btn')}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                {copiedKey === 'direct_btn' ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                )}
                Linki Kopyala
              </button>

              <button
                onClick={handleShare}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                Paylaş
              </button>

              <button
                onClick={() => setQrModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <QrCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                QR Kod
              </button>

              <a
                href={image.url}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                Yeni Sekmede Aç
              </a>
            </div>

            {userProfile?.role === 'admin' && (
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                title="Sil (Yönetici Yetkisi)"
              >
                <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Sil
              </button>
            )}
          </div>

          {/* Embed Code Tabs */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#12131b] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-wide uppercase">Gömme Kodları (Embed)</h3>

            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <button
                onClick={() => setActiveEmbed('short_direct')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  activeEmbed === 'short_direct'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                    : 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100'
                }`}
              >
                🔥 Kısa Direkt Link
              </button>
              <button
                onClick={() => setActiveEmbed('page')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeEmbed === 'page' ? 'bg-slate-900 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Sayfa Linki
              </button>
              <button
                onClick={() => setActiveEmbed('direct')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeEmbed === 'direct' ? 'bg-slate-900 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                CDN Ham Link
              </button>
              <button
                onClick={() => setActiveEmbed('webp')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  activeEmbed === 'webp' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100'
                }`}
              >
                ⚡ WebP Link (Optimize)
              </button>
              <button
                onClick={() => setActiveEmbed('html')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  activeEmbed === 'html' ? 'bg-slate-900 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                HTML koda
              </button>
              <button
                onClick={() => setActiveEmbed('markdown')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  activeEmbed === 'markdown' ? 'bg-slate-900 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Markdown
              </button>
              <button
                onClick={() => setActiveEmbed('bbcode')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  activeEmbed === 'bbcode' ? 'bg-slate-900 dark:bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                BBCode Forum
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 dark:bg-slate-950 text-slate-100 p-3.5 rounded-2xl font-mono text-xs overflow-x-auto border dark:border-slate-800">
              <span className="flex-1 truncate">{getEmbedCode()}</span>
              <button
                onClick={() => copyCode(getEmbedCode(), 'embed_copy')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 shrink-0 transition-colors"
              >
                {copiedKey === 'embed_copy' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Image Details */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#12131b] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{image.title || image.fileName}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Yükleyen: {image.userName || 'Anonim'}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Dosya Boyutu
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{(image.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Çözünürlük
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {image.width} x {image.height} px
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Format
                </span>
                <span className="font-bold uppercase text-slate-800 dark:text-slate-200">{image.format}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Yükleme Tarihi
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {new Date(image.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Görüntülenme
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{image.views}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> İndirilme
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{image.downloads}</span>
              </div>
            </div>

            {/* Cloudinary CDN Status Badge */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-900 dark:text-indigo-200 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Cloudinary CDN ile otomatik optimize edildi.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#12131b] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Resmi Silmek İstiyor musunuz?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bu işlem resmi sunucularımızdan ve Cloudinary CDN üzerinden kalıcı olarak silecektir.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrModalOpen && (
        <QRModal
          url={image.url}
          title={image.title || image.fileName}
          onClose={() => setQrModalOpen(false)}
        />
      )}
    </div>
  );
};
