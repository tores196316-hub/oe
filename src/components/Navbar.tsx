import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { useTheme } from '../context/ThemeContext';
import { AnnouncementDrawer } from './AnnouncementDrawer';
import {
  Upload,
  Grid,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Info,
  Phone,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { userProfile, isAdmin, logout } = useAuth();
  const { settings, announcements } = useSite();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [readAnnIds, setReadAnnIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('read_announcement_ids') || '[]');
      if (Array.isArray(saved)) {
        setReadAnnIds(saved);
      }
    } catch {}
  }, []);

  const unreadCount = announcements.filter((a) => a.active && !readAnnIds.includes(a.id)).length;

  const handleMarkAllRead = () => {
    const allIds = announcements.map((a) => a.id);
    setReadAnnIds(allIds);
    try {
      localStorage.setItem('read_announcement_ids', JSON.stringify(allIds));
    } catch {}
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Yükle', path: '/upload', icon: Upload, highlight: true },
    { name: 'Görsellerim', path: '/profil', icon: Grid },
    { name: 'Hakkımızda', path: '/hakkimizda', icon: Info },
    { name: 'İletişim', path: '/iletisim', icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-[#0c0d14]/85 border-b border-slate-200/60 dark:border-slate-800/80 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-indigo-400 dark:text-indigo-200" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              {settings.siteName || 'İnan Hızlı Medya'}
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                PRO
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);

            if (link.highlight) {
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-sm hover:shadow transition-all mx-1"
                >
                  <Upload className="w-4 h-4 text-indigo-400 dark:text-indigo-200" />
                  {link.name}
                </Link>
              );
            }

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/80 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Auth & Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
            title={isDark ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'}
            aria-label="Tema Değiştir"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Duyuru Merkezi"
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-[#0c0d14] shadow-2xs animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Admin Paneli
            </Link>
          )}

          {userProfile ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Link
                to="/profil"
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-slate-700 dark:text-slate-300"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200 uppercase">
                  {userProfile.displayName?.substring(0, 2) || 'US'}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate">
                  {userProfile.displayName}
                </span>
              </Link>
              <button
                onClick={logout}
                className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors px-2 py-1 cursor-pointer"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/giris"
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                to="/kayit"
                className="px-3.5 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white transition-colors"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle, Theme Switcher & Bell */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Aydınlık Mod' : 'Karanlık Mod'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="relative p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Duyuru Merkezi"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
            )}
          </button>

          <Link
            to="/upload"
            className="p-2 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center"
          >
            <Upload className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0c0d14]/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                isActive(link.path)
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {link.icon && <link.icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />}
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setDrawerOpen(true);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
            >
              <span className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Duyurular & Bildirimler
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-bold">
                  {unreadCount} yeni
                </span>
              )}
            </button>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <ShieldCheck className="w-5 h-5" />
                Admin Paneli
              </Link>
            )}

            {userProfile ? (
              <>
                <Link
                  to="/profil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <Grid className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  Profilim ({userProfile.displayName})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/giris"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/kayit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-medium text-sm"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-over Notification Drawer */}
      <AnnouncementDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        readIds={readAnnIds}
        onMarkAllRead={handleMarkAllRead}
      />
    </header>
  );
};

