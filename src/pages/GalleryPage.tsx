import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Grid,
  List as ListIcon,
  Filter,
  Eye,
  Download,
  Copy,
  Check,
  QrCode,
  Image as ImageIcon,
  SlidersHorizontal,
} from 'lucide-react';
import { ImageItem } from '../types';
import { useToast } from '../context/ToastContext';
import { QRModal } from '../components/QRModal';

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalUrl, setQrModalUrl] = useState<{ url: string; title: string } | null>(null);

  const { showToast } = useToast();

  const fetchGallery = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedFormat !== 'all') params.set('format', selectedFormat);
    params.set('sort', selectedSort);
    params.set('onlyPublic', 'true');

    fetch(`/api/images?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.images) {
          setImages(data.images);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedFormat, selectedSort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGallery();
  };

  const copyImageLink = (img: ImageItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(img.url);
    setCopiedId(img.id);
    showToast('Görsel adresi kopyalandı!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Resim Galerisi</h1>
          <p className="text-sm text-slate-500">
            Topluluk tarafından paylaşılan ve aranan herkese açık tüm görseller.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xs self-start">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Grid className="w-4 h-4" /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ListIcon className="w-4 h-4" /> Liste
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Resim adı, etiket veya format ara..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all"
          />
        </form>

        {/* Format Select */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="all">Tüm Formatlar</option>
            <option value="png">PNG</option>
            <option value="jpg">JPG / JPEG</option>
            <option value="webp">WEBP</option>
            <option value="gif">GIF</option>
            <option value="avif">AVIF</option>
          </select>

          {/* Sort Select */}
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="newest">En Yeniler</option>
            <option value="oldest">En Eskiler</option>
            <option value="views">En Çok İzlenenler</option>
            <option value="size">En Büyük Boyutlu</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-3xl bg-slate-200/60 animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Hiç resim bulunamadı</h3>
          <p className="text-xs text-slate-500">Filtrelerinizi değiştirmeyi veya yeni bir resim yüklemeyi deneyin.</p>
          <Link
            to="/upload"
            className="inline-block mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs shadow-sm"
          >
            Resim Yükle
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden flex flex-col hover:shadow-lg transition-all"
            >
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={img.thumbnailUrl || img.url}
                  alt={img.title || img.fileName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  {img.format}
                </span>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 truncate">
                    {img.title || img.fileName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {(img.size / 1024).toFixed(0)} KB • {img.width}x{img.height} px
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {img.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> {img.downloads}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => copyImageLink(img, e)}
                      title="Bağlantıyı Kopyala"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      {copiedId === img.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => setQrModalUrl({ url: img.url, title: img.title || img.fileName })}
                      title="QR Kod Oluştur"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/resim/${img.id}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                    >
                      İncele
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {images.map((img) => (
            <div key={img.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={img.thumbnailUrl || img.url}
                  alt={img.fileName}
                  className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">{img.title || img.fileName}</p>
                  <p className="text-xs text-slate-500">
                    {img.format.toUpperCase()} • {(img.size / 1024).toFixed(0)} KB • {img.width}x{img.height}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
                <span className="hidden sm:inline-flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {img.views}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> {img.downloads}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => copyImageLink(img, e)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    {copiedId === img.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <Link
                    to={`/resim/${img.id}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
                  >
                    Detay
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalUrl && (
        <QRModal
          url={qrModalUrl.url}
          title={qrModalUrl.title}
          onClose={() => setQrModalUrl(null)}
        />
      )}
    </div>
  );
};
