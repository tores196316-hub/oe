import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Bell, AlertTriangle, CheckCircle, Info, Sparkles, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export const AnnouncementBanner: React.FC = () => {
  const { announcements } = useSite();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const visibleAnnouncements = announcements.filter((a) => !dismissedIds.includes(a.id));

  if (visibleAnnouncements.length === 0) return null;

  const currentAnn = visibleAnnouncements[Math.min(currentIndex, visibleAnnouncements.length - 1)];

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % visibleAnnouncements.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + visibleAnnouncements.length) % visibleAnnouncements.length);
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-900',
          badge: 'bg-amber-500 text-white',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
        };
      case 'alert':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-900',
          badge: 'bg-rose-600 text-white',
          icon: <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />,
        };
      case 'success':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900',
          badge: 'bg-emerald-600 text-white',
          icon: <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />,
        };
      case 'update':
        return {
          bg: 'bg-purple-500/10 border-purple-500/20 text-purple-900',
          badge: 'bg-purple-600 text-white',
          icon: <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-900',
          badge: 'bg-indigo-600 text-white',
          icon: <Bell className="w-4 h-4 text-indigo-600 shrink-0" />,
        };
    }
  };

  const style = getTypeStyle(currentAnn.type);

  return (
    <div className={`relative border-b transition-all duration-300 ${style.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Content */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {style.icon}
          
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0 ${style.badge}`}>
            {currentAnn.badge || (currentAnn.type === 'update' ? 'YENİ' : 'DUYURU')}
          </span>

          <div className="flex items-center gap-2 min-w-0 flex-1 truncate">
            <span className="font-bold shrink-0">{currentAnn.title}:</span>
            <span className="truncate opacity-90">{currentAnn.message}</span>
          </div>

          {currentAnn.linkUrl && (
            <a
              href={currentAnn.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 font-semibold underline underline-offset-2 shrink-0 hover:opacity-80 transition-opacity"
            >
              {currentAnn.linkText || 'Detaylar'} <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {visibleAnnouncements.length > 1 && (
            <div className="flex items-center gap-1 bg-white/50 backdrop-blur-xs px-2 py-0.5 rounded-full border border-black/5 text-[11px] font-semibold">
              <button
                onClick={handlePrev}
                className="p-0.5 hover:bg-black/10 rounded-full transition-colors"
                title="Önceki Duyuru"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span>
                {currentIndex + 1}/{visibleAnnouncements.length}
              </span>
              <button
                onClick={handleNext}
                className="p-0.5 hover:bg-black/10 rounded-full transition-colors"
                title="Sonraki Duyuru"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => handleDismiss(currentAnn.id)}
            className="p-1 rounded-lg hover:bg-black/10 transition-colors opacity-70 hover:opacity-100"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
