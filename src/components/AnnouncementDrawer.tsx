import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSite } from '../context/SiteContext';
import { Announcement } from '../types';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  X,
  ExternalLink,
  CheckCheck,
  Calendar,
  Info,
  Search,
  Filter,
  RefreshCw,
  ChevronRight,
  ShieldAlert,
  Megaphone,
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
  const { announcements, allAnnouncements } = useSite();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'update' | 'alert'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Use active announcements first; fallback to allAnnouncements if active is empty
  const availableAnnouncements = announcements.length > 0 ? announcements : allAnnouncements;

  const filteredAnnouncements = availableAnnouncements.filter((a) => {
    // Filter type
    if (activeFilter === 'unread' && readIds.includes(a.id)) return false;
    if (activeFilter === 'update' && a.type !== 'update') return false;
    if (activeFilter === 'alert' && a.type !== 'alert' && a.type !== 'warning') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchMsg = a.message.toLowerCase().includes(q);
      const matchBadge = a.badge?.toLowerCase().includes(q);
      if (!matchTitle && !matchMsg && !matchBadge) return false;
    }

    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'alert':
        return <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'update':
        return <Sparkles className="w-4 h-4 text-purple-500 shrink-0 animate-pulse" />;
      case 'info':
      default:
        return <Megaphone className="w-4 h-4 text-indigo-500 shrink-0" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80';
      case 'alert':
        return 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80';
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80';
      case 'update':
        return 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/80';
      case 'info':
      default:
        return 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80';
    }
  };

  const unreadCount = availableAnnouncements.filter((a) => !readIds.includes(a.id)).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Drawer content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl h-full bg-white dark:bg-[#0f1017] shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 z-10"
        >
          {/* Top Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                  Duyuru & Bildirim Merkezi
                  {unreadCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-black shadow-xs">
                      {unreadCount} Yeni
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sistem güncellemeleri, duyurular ve bilgilendirmeler</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Pencereyi Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Action Bar */}
          <div className="p-4 bg-white dark:bg-[#0f1017] border-b border-slate-100 dark:border-slate-800/80 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Duyurularda veya bildirimlerde ara..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === 'all'
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Tümü ({availableAnnouncements.length})
                </button>
                <button
                  onClick={() => setActiveFilter('unread')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === 'unread'
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Okunmamış ({unreadCount})
                </button>
                <button
                  onClick={() => setActiveFilter('update')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === 'update'
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Güncellemeler
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-extrabold flex items-center gap-1 cursor-pointer shrink-0 ml-1 px-2.5 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                  title="Tümünü Okundu Olarak İşaretle"
                >
                  <CheckCheck className="w-4 h-4" /> Tümünü Okundu Yap
                </button>
              )}
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {filteredAnnouncements.length === 0 ? (
              <div className="py-20 text-center space-y-3 text-slate-400">
                <Bell className="w-14 h-14 mx-auto stroke-1 opacity-25 text-indigo-500" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Duyuru veya Bildirim Bulunamadı</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {activeFilter === 'unread'
                    ? 'Tüm bildirimleri okudunuz! "Tümü" sekmesinden geçmiş duyurulara ulaşabilirsiniz.'
                    : 'Arama kriterlerinize uyan bildirim bulunmamaktadır.'}
                </p>
                {(activeFilter !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setActiveFilter('all');
                      setSearchQuery('');
                    }}
                    className="mt-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 cursor-pointer transition-colors"
                  >
                    Tüm Duyuruları Listele
                  </button>
                )}
              </div>
            ) : (
              filteredAnnouncements.map((ann) => {
                const isUnread = !readIds.includes(ann.id);
                const isExpanded = expandedId === ann.id;
                return (
                  <div
                    key={ann.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                      isUnread
                        ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200/90 dark:border-indigo-800/80 shadow-xs'
                        : 'bg-white dark:bg-[#141620] border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getIcon(ann.type)}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getBadgeStyle(
                            ann.type
                          )}`}
                        >
                          {ann.badge || (ann.type === 'update' ? 'SÜRÜM' : 'DUYURU')}
                        </span>
                        {isUnread && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                            Yeni
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono shrink-0">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(ann.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug mb-1.5">
                      {ann.title}
                    </h4>

                    <p
                      className={`text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${
                        isExpanded ? '' : 'line-clamp-3'
                      }`}
                    >
                      {ann.message}
                    </p>

                    {ann.message.length > 140 && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : ann.id)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1.5 cursor-pointer inline-flex items-center gap-0.5"
                      >
                        {isExpanded ? 'Daha Az Göster' : 'Devamını Oku...'}
                      </button>
                    )}

                    {ann.linkUrl && (
                      <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <a
                          href={ann.linkUrl}
                          target={ann.linkUrl.startsWith('http') ? '_blank' : '_self'}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                        >
                          <span>{ann.linkText || 'Detayları İncele'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-900/50">
            <button
              onClick={() => {
                localStorage.removeItem('dismissed_announcement_ids');
                localStorage.removeItem('read_announcement_ids');
                window.location.reload();
              }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer p-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Okundu Geçmişini Sıfırla
            </button>
            <span className="text-xs font-mono font-semibold text-slate-400">v2.5.0</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
