import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSite } from '../context/SiteContext';
import { Announcement } from '../types';
import {
  Megaphone,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  Bell,
  Calendar,
  X,
  Maximize2,
  Tag,
  ArrowRight,
  CheckCheck,
} from 'lucide-react';

export const HomeAnnouncementWidget: React.FC = () => {
  const { announcements } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'update' | 'alert' | 'info'>('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('read_announcement_ids') || '[]');
    } catch {
      return [];
    }
  });

  const activeAnnouncements = announcements.filter((a) => a.active);

  if (activeAnnouncements.length === 0) return null;

  const filtered = activeAnnouncements.filter((a) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'update') return a.type === 'update';
    if (selectedCategory === 'alert') return a.type === 'alert' || a.type === 'warning';
    if (selectedCategory === 'info') return a.type === 'info' || a.type === 'success';
    return true;
  });

  const markAsRead = (id: string) => {
    if (readIds.includes(id)) return;
    const updated = [...readIds, id];
    setReadIds(updated);
    try {
      localStorage.setItem('read_announcement_ids', JSON.stringify(updated));
    } catch {}
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'alert':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'update':
        return <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />;
      case 'info':
      default:
        return <Megaphone className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800';
      case 'alert':
        return 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800';
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800';
      case 'update':
        return 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800';
      case 'info':
      default:
        return 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800';
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#12131b] border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-6">
        {/* Widget Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                Güncel Duyurular & Yenilikler
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300">
                  {activeAnnouncements.length} Aktif
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sistem güncellemeleri, sunucu bakımları ve yeni özellik duyuruları.
              </p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedCategory('update')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'update'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              🚀 Sürüm Güncellemeleri
            </button>
            <button
              onClick={() => setSelectedCategory('alert')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'alert'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              ⚠️ Uyarilar & Bakım
            </button>
          </div>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full py-10 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto stroke-1 opacity-40 text-indigo-500" />
              <p className="text-xs font-semibold">Bu kategoride yayınlanmış duyuru bulunmuyor.</p>
            </div>
          ) : (
            filtered.map((ann) => {
              const isUnread = !readIds.includes(ann.id);
              return (
                <div
                  key={ann.id}
                  onClick={() => markAsRead(ann.id)}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 group ${
                    isUnread
                      ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/80 shadow-2xs hover:border-indigo-400'
                      : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Badge & Date */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getBadgeIcon(ann.type)}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getBadgeStyle(
                            ann.type
                          )}`}
                        >
                          {ann.badge || (ann.type === 'update' ? 'SÜRÜM' : 'DUYURU')}
                        </span>
                        {isUnread && (
                          <span className="px-1.5 py-0.2 rounded-md bg-indigo-600 text-white text-[9px] font-black tracking-wider uppercase">
                            YENİ
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(ann.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {ann.title}
                    </h3>

                    {/* Message teaser */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {ann.message}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAnnouncement(ann);
                        markAsRead(ann.id);
                      }}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Detaylı Oku</span>
                    </button>

                    {ann.linkUrl && (
                      <a
                        href={ann.linkUrl}
                        target={ann.linkUrl.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <span>{ann.linkText || 'Sayfaya Git'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detailed View Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0f1017] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 bg-slate-900 text-white relative">
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    {selectedAnnouncement.badge || 'DUYURU DETAYI'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(selectedAnnouncement.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white leading-snug">{selectedAnnouncement.title}</h3>
              </div>

              <div className="p-6 space-y-5 bg-white dark:bg-[#0f1017]">
                <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                  {selectedAnnouncement.message}
                </p>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Kapat
                  </button>

                  {selectedAnnouncement.linkUrl && (
                    <a
                      href={selectedAnnouncement.linkUrl}
                      target={selectedAnnouncement.linkUrl.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>{selectedAnnouncement.linkText || 'Sayfaya Git'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
