import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  Globe,
  Lock,
  RefreshCw,
  Sparkles,
  Link as LinkIcon,
  Code,
  ExternalLink,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { ImageItem } from '../types';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { QRModal } from '../components/QRModal';

interface FileQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  errorMessage?: string;
  result?: ImageItem;
}

export const UploadPage: React.FC = () => {
  const [queue, setQueue] = useState<FileQueueItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [activeTab, setActiveTab] = useState<'page' | 'direct' | 'html' | 'markdown' | 'bbcode'>('page');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [qrModalUrl, setQrModalUrl] = useState<{ url: string; title: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { userProfile } = useAuth();

  const maxAllowedFiles = userProfile ? 15 : 5;

  // Clipboard paste handler (Ctrl+V) listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      const pastedFiles: File[] = [];

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        addFilesToQueue(pastedFiles);
        showToast(`${pastedFiles.length} resim panodan eklendi`, 'info');
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [userProfile]);

  const addFilesToQueue = (files: File[]) => {
    const maxMB = 25;
    let filesToProcess = files;

    if (files.length > maxAllowedFiles) {
      if (!userProfile) {
        showToast(
          'Üye olmadan aynı anda en fazla 5 resim yükleyebilirsiniz. 15 resim birden yüklemek için ücretsiz üye olun!',
          'warning'
        );
      } else {
        showToast('Aynı anda en fazla 15 resim yükleyebilirsiniz. İlk 15 resim işleme alındı.', 'info');
      }
      filesToProcess = files.slice(0, maxAllowedFiles);
    }

    const newItems: FileQueueItem[] = [];

    for (const file of filesToProcess) {
      if (file.size > maxMB * 1024 * 1024) {
        showToast(`${file.name} çok büyük! Maksimum dosya boyutu ${maxMB} MB olabilir.`, 'error');
        continue;
      }

      const newItem: FileQueueItem = {
        id: 'q_' + Math.random().toString(36).substring(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'pending',
        progress: 0,
      };
      newItems.push(newItem);
    }

    if (newItems.length > 0) {
      setQueue((prev) => [...prev, ...newItems]);
      // Auto start upload
      uploadQueueItems(newItems);
    }
  };

  const uploadQueueItems = async (items: FileQueueItem[]) => {
    for (const item of items) {
      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading', progress: 30 } : q))
      );

      const formData = new FormData();
      formData.append('images', item.file);
      formData.append('isPublic', 'false');
      if (userProfile) {
        formData.append('userId', userProfile.uid);
        formData.append('userName', userProfile.displayName);
        formData.append('userEmail', userProfile.email);
      }

      try {
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, progress: 65 } : q))
        );

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (res.ok && data.images && data.images.length > 0) {
          const resultImg: ImageItem = data.images[0];
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, status: 'completed', progress: 100, result: resultImg } : q
            )
          );

          // Save image ID locally for personal gallery
          try {
            const existingIds: string[] = JSON.parse(localStorage.getItem('my_uploaded_image_ids') || '[]');
            if (!existingIds.includes(resultImg.id)) {
              existingIds.unshift(resultImg.id);
              localStorage.setItem('my_uploaded_image_ids', JSON.stringify(existingIds));
            }
          } catch (e) {}

          // Confetti celebration
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });

          showToast('Resim başarıyla yüklendi!', 'success');
        } else {
          throw new Error(data.error || 'Yükleme başarısız oldu.');
        }
      } catch (err: any) {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: 'error', progress: 0, errorMessage: err.message || 'Yükleme hatası' }
              : q
          )
        );
        showToast(err.message || 'Resim yüklenemedi', 'error');
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files) as File[];
      addFilesToQueue(filesArray);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files) as File[];
      addFilesToQueue(filesArray);
    }
  };

  const removeQueueItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const retryQueueItem = (item: FileQueueItem) => {
    uploadQueueItems([item]);
  };

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Bağlantı panoya kopyalandı!', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getPageUrl = (id: string) => `${window.location.origin}/resim/${id}`;

  const getEmbedCode = (itemResult: ImageItem) => {
    const pageUrl = getPageUrl(itemResult.id);
    switch (activeTab) {
      case 'page':
        return pageUrl;
      case 'direct':
        return itemResult.url;
      case 'html':
        return `<a href="${pageUrl}" target="_blank"><img src="${itemResult.url}" alt="${itemResult.fileName}" /></a>`;
      case 'markdown':
        return `[![${itemResult.fileName}](${itemResult.url})](${pageUrl})`;
      case 'bbcode':
        return `[url=${pageUrl}][img]${itemResult.url}[/img][/url]`;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-6">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Hızlı Yükleme Stüdyosu
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Resmini Yükle ve Paylaş
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Dosyalarınızı buraya sürükleyin, bilgisayarınızdan seçin veya doğrudan panodan yapıştırın (Ctrl + V).
        </p>
      </div>

      {/* Settings & Limits Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Kişisel & Güvenli Yükleme</span>
          </div>

          {!userProfile ? (
            <div className="flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold">
              <span>Ziyaretçi Limiti: <strong>Aynı anda 5 Resim</strong></span>
              <Link
                to="/auth?tab=register"
                className="ml-1 text-indigo-600 font-bold hover:underline flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-indigo-100 shadow-2xs"
              >
                <UserPlus className="w-3 h-3" /> 15 Resim İçin Kaydol
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1.5 rounded-xl text-xs font-bold">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Üye Limiti: <strong>Aynı anda 15 Resim Aktif</strong></span>
            </div>
          )}
        </div>

        <span className="text-xs text-slate-500">
          Formatlar: <strong className="text-slate-800">PNG, JPG, WEBP, GIF, AVIF</strong> (Maks 25 MB)
        </span>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
            : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg, image/webp, image/gif, image/avif"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 shadow-xs">
            <Upload className="w-8 h-8 text-indigo-600" />
          </div>

          <div>
            <p className="text-lg font-bold text-slate-900">
              Resimleri Buraya Sürükleyin veya <span className="text-indigo-600 underline">Göz Atın</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Veya ekran görüntüsünü doğrudan buraya yapıştırın <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono text-[10px]">Ctrl+V</kbd>
            </p>
            <p className="text-xs text-indigo-600 font-semibold mt-2">
              {!userProfile
                ? '⚡ Misafir olarak aynı anda 5 resim yükleyebilirsiniz.'
                : '⚡ Üye olarak aynı anda 15 resim birden yükleyebilirsiniz.'}
            </p>
          </div>
        </div>
      </div>

      {/* Upload Queue List */}
      {queue.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Yüklenen Resimler ({queue.length})</h2>

          <div className="space-y-4">
            {queue.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900 truncate">{item.file.name}</p>
                      <span className="text-xs font-semibold text-slate-500">
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>

                    {/* Status Badge & Progress */}
                    <div className="mt-2 flex items-center justify-between text-xs">
                      {item.status === 'uploading' && (
                        <span className="text-indigo-600 font-medium flex items-center gap-1">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Yükleniyor... %{item.progress}
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tamamlandı
                        </span>
                      )}
                      {item.status === 'error' && (
                        <span className="text-rose-600 font-semibold">{item.errorMessage || 'Hata'}</span>
                      )}

                      <div className="flex items-center gap-2">
                        {item.status === 'error' && (
                          <button
                            onClick={() => retryQueueItem(item)}
                            className="text-xs text-indigo-600 font-semibold hover:underline"
                          >
                            Tekrar Dene
                          </button>
                        )}
                        <button
                          onClick={() => removeQueueItem(item.id)}
                          className="text-slate-400 hover:text-slate-600 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {item.status === 'uploading' && (
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Successful Result Code Embeds */}
                {item.status === 'completed' && item.result && (
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    {/* Embed Tabs */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-2">
                      <button
                        onClick={() => setActiveTab('page')}
                        className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                          activeTab === 'page'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Site Sayfa Bağlantısı
                      </button>
                      <button
                        onClick={() => setActiveTab('direct')}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                          activeTab === 'direct' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Direkt Resim
                      </button>
                      <button
                        onClick={() => setActiveTab('html')}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                          activeTab === 'html' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        HTML Kodu
                      </button>
                      <button
                        onClick={() => setActiveTab('markdown')}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                          activeTab === 'markdown' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Markdown
                      </button>
                      <button
                        onClick={() => setActiveTab('bbcode')}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                          activeTab === 'bbcode' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        BBCode
                      </button>
                    </div>

                    {/* Code Display Box */}
                    <div className="flex items-center gap-2 bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                      <span className="flex-1 truncate select-all">
                        {getEmbedCode(item.result)}
                      </span>

                      <button
                        onClick={() => copyCode(getEmbedCode(item.result!), `${item.id}_${activeTab}`)}
                        className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 transition-colors flex items-center gap-1 font-sans text-[11px] font-bold"
                        title="Kopyala"
                      >
                        {copiedKey === `${item.id}_${activeTab}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" /> Kopyalandı
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Kopyala
                          </>
                        )}
                      </button>
                    </div>

                    {/* Quick action triggers */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        onClick={() =>
                          setQrModalUrl({
                            url: getPageUrl(item.result!.id),
                            title: item.result!.fileName,
                          })
                        }
                        className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold"
                      >
                        <QrCode className="w-4 h-4 text-indigo-600" /> Sayfa QR Kodunu Üret
                      </button>

                      <a
                        href={getPageUrl(item.result.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-indigo-600 font-bold hover:underline bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg"
                      >
                        Sitedeki Resim Sayfasına Git <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
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

