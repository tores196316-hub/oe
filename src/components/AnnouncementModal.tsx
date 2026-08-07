import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSite } from '../context/SiteContext';
import { Announcement } from '../types';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  X,
  ExternalLink,
  ShieldAlert,
  Info,
  ChevronRight,
} from 'lucide-react';

export const AnnouncementModal: React.FC = () => {
  const { announcements } = useSite();
  const [activeModalAnn, setActiveModalAnn] = useState<Announcement | null>(null);

  useEffect(() => {
    try {
      const closedModalIds: string[] = JSON.parse(
        localStorage.getItem('closed_announcement_modals') || '[]'
      );

      // Find the highest priority active announcement configured for modal display
      const target = announcements.find((a) => {
        if (!a.active) return false;
        if (closedModalIds.includes(a.id)) return false;
        return a.displayMode === 'modal' || a.displayMode === 'both' || a.priority === 'high';
      });

      if (target) {
        setActiveModalAnn(target);
      } else {
        setActiveModalAnn(null);
      }
    } catch {
      // Fallback
    }
  }, [announcements]);

  const handleClose = () => {
    if (!activeModalAnn) return;
    try {
      const closedModalIds: string[] = JSON.parse(
        localStorage.getItem('closed_announcement_modals') || '[]'
      );
      if (!closedModalIds.includes(activeModalAnn.id)) {
        closedModalIds.push(activeModalAnn.id);
        localStorage.setItem('closed_announcement_modals', JSON.stringify(closedModalIds));
      }
    } catch {}
    setActiveModalAnn(null);
  };

  if (!activeModalAnn) return null;

  const getTypeTheme = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          headerBg: 'bg-gradient-to-r from-amber-600 to-amber-700',
          badgeBg: 'bg-amber-400/20 text-amber-200 border-amber-300/30',
          icon: <AlertTriangle className="w-6 h-6 text-amber-200" />,
          btnClass: 'bg-amber-600 hover:bg-amber-700 text-white',
        };
      case 'alert':
        return {
          headerBg: 'bg-gradient-to-r from-rose-600 to-rose-700',
          badgeBg: 'bg-rose-400/20 text-rose-200 border-rose-300/30',
          icon: <ShieldAlert className="w-6 h-6 text-rose-200" />,
          btnClass: 'bg-rose-600 hover:bg-rose-700 text-white',
        };
      case 'success':
        return {
          headerBg: 'bg-gradient-to-r from-emerald-600 to-emerald-700',
          badgeBg: 'bg-emerald-400/20 text-emerald-200 border-emerald-300/30',
          icon: <CheckCircle className="w-6 h-6 text-emerald-200" />,
          btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        };
      case 'update':
        return {
          headerBg: 'bg-gradient-to-r from-purple-600 to-indigo-700',
          badgeBg: 'bg-purple-400/20 text-purple-200 border-purple-300/30',
          icon: <Sparkles className="w-6 h-6 text-purple-200" />,
          btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        };
      case 'info':
      default:
        return {
          headerBg: 'bg-gradient-to-r from-indigo-600 to-slate-800',
          badgeBg: 'bg-indigo-400/20 text-indigo-200 border-indigo-300/30',
          icon: <Info className="w-6 h-6 text-indigo-200" />,
          btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        };
    }
  };

  const theme = getTypeTheme(activeModalAnn.type);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className={`p-6 text-white ${theme.headerBg} relative`}>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
              title="Kapat"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                {theme.icon}
              </div>
              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${theme.badgeBg}`}
                >
                  {activeModalAnn.badge || 'ÖNEMLİ DUYURU'}
                </span>
                <span className="text-[11px] text-white/70 block mt-0.5">
                  {new Date(activeModalAnn.createdAt).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight leading-snug">
              {activeModalAnn.title}
            </h3>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {activeModalAnn.message}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-center"
              >
                Anladım, Kapat
              </button>

              {activeModalAnn.linkUrl && (
                <a
                  href={activeModalAnn.linkUrl}
                  target={activeModalAnn.linkUrl.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs ${theme.btnClass}`}
                >
                  <span>{activeModalAnn.linkText || 'Detayları İncele'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
