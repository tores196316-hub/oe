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
  const { announcements } = useSite();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'update' | 'alert'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredAnnouncements = announcements.filter((a) => {
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

  const unreadCount = announcements.filter((a) => !readIds.includes(a.id)).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs">
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
          {/* Top Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                  Duyuru & Bildirimler
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black">
                      {unreadCount} Yeni
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Platform duyuruları ve sistem haberleri</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Action Bar */}
          <div className="p-4 bg-white dark:bg-[#0f1017] border-b border-slate-100 dark:border-slate-800/80 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Duyurularda ara..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === 'all'
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Tümü ({announcements.length})
                </button>
                <button
                  onClick={() => setActiveFilter('unread')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === 'unread'
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Okunmamış ({unreadCount})
                </button>
                <button
                  onClick={() => setActiveFilter('update')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === 'update'
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Güncellemeler
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-extrabold flex items-center gap-1 cursor-pointer shrink-0 ml-1"
                  title="Tümünü Okundu Olarak İşaretle"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Okundu Yap
                </button>
              )}
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredAnnouncements.length === 0 ? (
              <div className="py-20 text-center space-y-3 text-slate-400">
                <Bell className="w-12 h-12 mx-auto stroke-1 opacity-30 text-indigo-500" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Duyuru Bulunamadı</p>
                <p className="text-xs text-slate-400">Kriterlerinize uyan kayıtlı bir duyuru mevcut değil.</p>
              </div>
            ) : (
              filteredAnnouncements.map((ann) => {
                const isUnread = !readIds.includes(ann.id);
                const isExpanded = expandedId === ann.id;
                return (
                  <div
                    key={ann.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 ${
                      isUnread
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/80 shadow-2xs'
                        : 'bg-white dark:bg-[#141620] border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getIcon(ann.type)}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${getBadgeStyle(
                            ann.type
                          )}`}
                        >
                          {ann.badge || (ann.type === 'update' ? 'SÜRÜM' : 'DUYURU')}
                        </span>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
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

                    <p
                      className={`text-xs text-slate-600 dark:text-slate-300 leading-relaxed ${
                        isExpanded ? '' : 'line-clamp-3'
                      }`}
                    >
                      {ann.message}
                    </p>

                    {ann.message.length > 140 && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : ann.id)}
                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1 cursor-pointer"
                      >
                        {isExpanded ? 'Daha Az Göster' : 'Devamını Oku...'}
                      </button>
                    )}

                    {ann.linkUrl && (
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
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
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40">
            <button
              onClick={() => {
                localStorage.removeItem('dismissed_announcement_ids');
                localStorage.removeItem('read_announcement_ids');
                window.location.reload();
              }}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Gizlenen Duyuruları Sıfırla
            </button>
            <span className="text-[11px] font-mono text-slate-400">v2.5.0</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
