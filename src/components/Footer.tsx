import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Lock, FileText, HelpCircle, Heart, Bell } from 'lucide-react';
import { Announcement } from '../types';

export const Footer: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetch('/api/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAnnouncements(data.filter((a) => a.active));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Active Announcement Bar */}
        {announcements.length > 0 && (
          <div className="mb-12 p-4 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-200 flex items-start gap-3 backdrop-blur-md">
            <Bell className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="font-semibold text-sm text-white">{announcements[0].title}</p>
              <p className="text-xs text-indigo-300/90 mt-0.5">{announcements[0].message}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-200" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">PicVault</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Apple, Discord ve Linear tarzında tasarlanmış ultra hızlı, güvenli ve ücretsiz resim yükleme ve CDN barındırma platformu.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Cloudinary CDN
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-indigo-400" /> SSL 256-bit
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/upload" className="hover:text-white transition-colors">
                  Resim Yükle
                </Link>
              </li>
              <li>
                <Link to="/galeri" className="hover:text-white transition-colors">
                  Resim Galerisi
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Blog & Rehberler
                </Link>
              </li>
              <li>
                <Link to="/sss" className="hover:text-white transition-colors">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Kurumsal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/hakkimizda" className="hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="hover:text-white transition-colors">
                  İletişim & Destek
                </Link>
              </li>
              <li>
                <Link to="/dmca" className="hover:text-white transition-colors">
                  DMCA Bildirimi
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Yasal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/gizlilik-politikasi" className="hover:text-white transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link to="/kullanim-sartlari" className="hover:text-white transition-colors">
                  Kullanım Şartları
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PicVault Inc. Tüm hakları saklıdır.</p>
          <p className="flex items-center gap-1">
            Yüksek performans ile <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> geliştirildi.
          </p>
        </div>
      </div>
    </footer>
  );
};
