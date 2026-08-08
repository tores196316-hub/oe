import React, { useState } from 'react';
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
  Shield,
  CheckCheck,
  Calendar,
  Info,
} from 'lucide-react';

interface AnnouncementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  readIds: string[];
  onMarkAllRead: () => void;
}

export const AnnouncementDrawer: React.FC<AnnouncementDrawerProps> = ({
  isOpen,
  onClose,
  readIds,
  onMarkAllRead,
}) => {
  const { announcements } = useSite();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const displayList = announcements.filter((a) => {
    if (activeFilter === 'unread') {
      return !readIds.includes(a.id);
    }
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'update':
        return <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-indigo-500 shrink-0" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'alert':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'update':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'info':
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Drawer content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-md h-full bg-white dark:bg-[#0f1017] shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">Duyuru Merkezi</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Güncellemeler ve sistem haberleri</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Header / Filters */}
          <div className="px-5 py-3 bg-white dark:bg-[#0f1017] border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Tümü ({announcements.length})
              </button>
              <button
                onClick={() => setActiveFilter('unread')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'unread'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Okunmamış ({announcements.filter((a) => !readIds.includes(a.id)).length})
              </button>
            </div>

            <button
              onClick={onMarkAllRead}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Okundu Yap
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {displayList.length === 0 ? (
              <div className="py-16 text-center space-y-3 text-slate-400">
                <Bell className="w-10 h-10 mx-auto stroke-1 opacity-40 text-indigo-400" />
                <p className="text-sm font-medium">Gösterilecek duyuru bulunmuyor.</p>
              </div>
            ) : (
              displayList.map((ann) => {
                const isUnread = !readIds.includes(ann.id);
                return (
                  <div
                    key={ann.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isUnread
                        ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-200/80 dark:border-indigo-800/60 shadow-2xs'
                        : 'bg-white dark:bg-[#141620] border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {getIcon(ann.type)}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getBadgeStyle(
                            ann.type
                          )}`}
                        >
                          {ann.badge || (ann.type === 'update' ? 'SÜRÜM' : 'DUYURU')}
                        </span>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(ann.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-1">
                      {ann.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{ann.message}</p>

                    {ann.linkUrl && (
                      <a
                        href={ann.linkUrl}
                        target={ann.linkUrl.startsWith('http') ? '_blank' : '_self'}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                      >
                        <span>{ann.linkText || 'Detayları İncele'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40">
            <button
              onClick={() => {
                localStorage.removeItem('dismissed_announcement_ids');
                window.dispatchEvent(new Event('storage'));
                window.location.reload();
              }}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline cursor-pointer"
            >
              Gizlenen Banner Duyurularını Göster
            </button>
            <span className="text-[11px] text-slate-400">İnan Hızlı Medya</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
