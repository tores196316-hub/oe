import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSite } from '../context/SiteContext';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  Maximize2,
} from 'lucide-react';
import { Announcement } from '../types';

export const AnnouncementBanner: React.FC = () => {
  const { announcements } = useSite();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [selectedAnnForDetail, setSelectedAnnForDetail] = useState<Announcement | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('dismissed_announcement_ids') || '[]');
      if (Array.isArray(saved)) {
        setDismissedIds(saved);
      }
    } catch {}
  }, []);

  const visibleAnnouncements = announcements.filter(
    (a) => a.active && !dismissedIds.includes(a.id)
  );

  if (visibleAnnouncements.length === 0) return null;

  const safeIndex = Math.min(currentIndex, visibleAnnouncements.length - 1);
  const currentAnn = visibleAnnouncements[safeIndex];

  const handleDismiss = (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      localStorage.setItem('dismissed_announcement_ids', JSON.stringify(updated));
    } catch {}

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % visibleAnnouncements.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + visibleAnnouncements.length) % visibleAnnouncements.length
    );
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white shadow-xs',
          badge: 'bg-amber-900/40 text-amber-100 border-amber-300/30',
          icon: <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0" />,
        };
      case 'alert':
        return {
          bg: 'bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 text-white shadow-xs',
          badge: 'bg-rose-900/40 text-rose-100 border-rose-300/30',
          icon: <AlertTriangle className="w-4 h-4 text-rose-200 shrink-0" />,
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white shadow-xs',
          badge: 'bg-emerald-900/40 text-emerald-100 border-emerald-300/30',
          icon: <CheckCircle className="w-4 h-4 text-emerald-200 shrink-0" />,
        };
      case 'update':
        return {
          bg: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-xs',
          badge: 'bg-white/20 text-indigo-100 border-white/20',
          icon: <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/40',
          badge: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30',
          icon: <Bell className="w-4 h-4 text-indigo-400 shrink-0" />,
        };
    }
  };

  const style = getTypeStyle(currentAnn.type);

  return (
    <>
      <div
        className={`announcement-banner-container w-full relative transition-all duration-300 overflow-hidden shadow-xs z-30 ${style.bg}`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Main Content Area */}
          <div className="flex items-center gap-3 min-w-0 flex-1 w-full">
            <div className="p-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 shrink-0">
              {style.icon}
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${style.badge}`}
            >
              {currentAnn.badge || (currentAnn.type === 'update' ? 'YENİ' : 'DUYURU')}
            </span>

            {/* Flexible Message Box */}
            <div className="flex-1 min-w-0 text-left overflow-hidden">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-extrabold text-white text-xs sm:text-sm shrink-0">
                  {currentAnn.title}:
                </span>
                <span className="text-white/95 font-medium text-xs sm:text-sm leading-relaxed">
                  {currentAnn.message}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-2">
              <button
                onClick={() => setSelectedAnnForDetail(currentAnn)}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 border border-white/25 text-white font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Tüm Metni Gör"
              >
                <Maximize2 className="w-3 h-3" />
                <span className="hidden xs:inline">Detaylı Oku</span>
              </button>

              {currentAnn.linkUrl && (
                <a
                  href={currentAnn.linkUrl}
                  target={currentAnn.linkUrl.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-[11px] transition-all flex items-center gap-1 shadow-sm shrink-0"
                >
                  <span>{currentAnn.linkText || 'İncele'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation & Close Controls */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {visibleAnnouncements.length > 1 && (
              <div className="flex items-center gap-1 bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-xs font-bold text-white shadow-2xs">
                <button
                  onClick={handlePrev}
                  className="p-0.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                  title="Önceki Duyuru"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-1 text-[11px] tracking-widest font-mono">
                  {safeIndex + 1}/{visibleAnnouncements.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-0.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                  title="Sonraki Duyuru"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={() => handleDismiss(currentAnn.id)}
              className="p-1.5 rounded-xl hover:bg-black/25 transition-colors text-white/80 hover:text-white cursor-pointer"
              title="Duyuruyu Gizle"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal if clicked */}
      <AnimatePresence>
        {selectedAnnForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-6 bg-slate-900 text-white relative">
                <button
                  onClick={() => setSelectedAnnForDetail(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    {selectedAnnForDetail.badge || 'DUYURU DETAYI'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(selectedAnnForDetail.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">{selectedAnnForDetail.title}</h3>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                  {selectedAnnForDetail.message}
                </p>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedAnnForDetail(null)}
                    className="px-5 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Kapat
                  </button>

                  {selectedAnnForDetail.linkUrl && (
                    <a
                      href={selectedAnnForDetail.linkUrl}
                      target={selectedAnnForDetail.linkUrl.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span>{selectedAnnForDetail.linkText || 'Sayfaya Git'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
