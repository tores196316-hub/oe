import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface QRModalProps {
  url: string;
  title: string;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ url, title, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    QRCode.toDataURL(
      url,
      {
        width: 300,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      },
      (err, code) => {
        if (!err && code) {
          setQrDataUrl(code);
        }
      }
    );
  }, [url]);

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('Bağlantı kopyalandı!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `picvault-qr-${Date.now()}.png`;
    a.click();
    showToast('QR Kod indirildi', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col items-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-bold text-lg text-slate-900 text-center mb-1">QR Kod İle Paylaş</h3>
        <p className="text-xs text-slate-500 text-center mb-4 max-w-[240px] truncate">{title}</p>

        {qrDataUrl ? (
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-inner mb-4">
            <img src={qrDataUrl} alt="QR Code" className="w-52 h-52 object-contain" />
          </div>
        ) : (
          <div className="w-52 h-52 bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center mb-4 text-xs text-slate-400">
            QR Oluşturuluyor...
          </div>
        )}

        <div className="flex items-center gap-2 w-full">
          <button
            onClick={copyUrl}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
            {copied ? 'Kopyalandı' : 'Linki Kopyala'}
          </button>

          <button
            onClick={downloadQR}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            QR'ı İndir
          </button>
        </div>
      </div>
    </div>
  );
};
