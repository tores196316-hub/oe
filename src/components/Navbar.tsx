import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Upload,
  Grid,
  FileText,
  Shield,
  HelpCircle,
  User,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Info,
  Phone,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { userProfile, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Yükle', path: '/upload', icon: Upload, highlight: true },
    { name: 'Galeri', path: '/galeri', icon: Grid },
    { name: 'Blog', path: '/blog', icon: FileText },
    { name: 'Hakkımızda', path: '/hakkimizda', icon: Info },
    { name: 'İletişim', path: '/iletisim', icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/75 border-b border-slate-200/60 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
              PicVault
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
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
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white shadow-sm hover:bg-slate-800 hover:shadow transition-all mx-1"
                >
                  <Upload className="w-4 h-4 text-indigo-400" />
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
                    ? 'text-slate-900 bg-slate-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Auth & Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 border border-indigo-200/80 text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Admin Paneli
            </Link>
          )}

          {userProfile ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                to="/profil"
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-700"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 uppercase">
                  {userProfile.displayName?.substring(0, 2) || 'US'}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate">
                  {userProfile.displayName}
                </span>
              </Link>
              <button
                onClick={logout}
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors px-2 py-1"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/giris"
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                to="/kayit"
                className="px-3.5 py-2 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 transition-colors"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/upload"
            className="p-2 rounded-xl bg-slate-900 text-white flex items-center justify-center"
          >
            <Upload className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                isActive(link.path)
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.icon && <link.icon className="w-5 h-5 text-slate-500" />}
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-200 space-y-2">
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold bg-indigo-50 text-indigo-700"
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
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-5 h-5 text-slate-500" />
                  Profilim ({userProfile.displayName})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-rose-600 hover:bg-rose-50"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/giris"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/kayit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
