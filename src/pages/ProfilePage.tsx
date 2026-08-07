import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ImageItem } from '../types';
import {
  User,
  Key,
  HardDrive,
  Eye,
  Download,
  Upload,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const { showToast } = useToast();

  const [apiKey, setApiKey] = useState(
    userProfile?.apiKey || 'pv_sec_live_' + Math.random().toString(36).substring(2, 18)
  );
  const [copiedKey, setCopiedKey] = useState(false);
  const [userImages, setUserImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    fetch('/api/images?onlyPublic=false')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.images) {
          setUserImages(data.images);
        }
      })
      .catch(() => {});
  }, []);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    showToast('API Anahtarı kopyalandı!', 'success');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const regenerateApiKey = () => {
    const newKey = 'pv_sec_live_' + Math.random().toString(36).substring(2, 22);
    setApiKey(newKey);
    showToast('Yeni API Anahtarı üretildi!', 'info');
  };

  const deleteUserImage = async (id: string) => {
    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUserImages((prev) => prev.filter((i) => i.id !== id));
        showToast('Resim silindi', 'success');
      }
    } catch (err) {
      showToast('Resim silinemedi', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-2xl flex items-center justify-center uppercase shadow-md">
            {userProfile?.displayName?.substring(0, 2) || 'US'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{userProfile?.displayName || 'Kullanıcı'}</h1>
            <p className="text-xs text-slate-500">{userProfile?.email || 'kullanici@example.com'}</p>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              {userProfile?.role === 'admin' ? 'Sistem Yöneticisi' : 'Standart Üye'}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
        >
          Oturumu Kapat
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Yüklenen Resimler</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{userImages.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Toplam İzlenme</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {userImages.reduce((acc, img) => acc + img.views, 0)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Toplam İndirme</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {userImages.reduce((acc, img) => acc + img.downloads, 0)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Harcanan Alan</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {(userImages.reduce((acc, img) => acc + img.size, 0) / (1024 * 1024)).toFixed(1)} MB
          </p>
        </div>
      </div>

      {/* API Key Developer Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" /> API Anahtarı (Developer API)
          </h2>
          <button
            onClick={regenerateApiKey}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Yenile
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Bu anahtarı kullanarak harici uygulamalarınızdan doğrudan resim yükleyebilirsiniz.
        </p>

        <div className="flex items-center gap-2 bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs">
          <span className="flex-1 truncate">{apiKey}</span>
          <button
            onClick={copyApiKey}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300"
          >
            {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* User Uploads Manager */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Yüklediğim Resimler</h2>

        {userImages.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs space-y-2">
            <p>Henüz resim yüklemediniz.</p>
            <Link to="/upload" className="inline-block px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold">
              İlk Resmini Yükle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userImages.map((img) => (
              <div
                key={img.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 justify-between"
              >
                <img
                  src={img.thumbnailUrl || img.url}
                  alt={img.fileName}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-slate-900 truncate">{img.title || img.fileName}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {(img.size / 1024).toFixed(0)} KB • {img.views} İzlenme
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    to={`/resim/${img.id}`}
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteUserImage(img.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
