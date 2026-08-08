import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Upload,
  Shield,
  Zap,
  Globe,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { HomeAnnouncementWidget } from '../components/HomeAnnouncementWidget';

export const HomePage: React.FC = () => {
  const { stats } = useSite();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-16 pb-8 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/5 dark:bg-slate-800/80 border border-slate-900/10 dark:border-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Cloudinary Altyapısı & Sınırsız Hızlı CDN</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
          >
            Resimlerinizi Işık Hızında Yükleyin, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 dark:from-indigo-400 dark:via-sky-400 dark:to-purple-300">
              Güvenle Paylaşın
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Sürükle bırak, kopyala-yapıştır veya seç. Otomatik WEBP dönüşümü, anında silme bağlantıları ve %100 ücretsiz Cloudinary CDN desteği.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/upload"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 dark:bg-indigo-600 text-white font-semibold text-base shadow-xl hover:bg-slate-800 dark:hover:bg-indigo-500 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
            >
              <Upload className="w-5 h-5 text-indigo-400 dark:text-indigo-200 group-hover:animate-bounce" />
              <span>Resmini Hemen Yükle</span>
            </Link>
          </motion.div>

          {/* Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-500" /> %100 Ücretsiz ve Güvenli
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Kayıpsız WebP / AVIF
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-sky-500" /> Global CDN Barındırma
            </span>
          </div>
        </div>
      </section>

      {/* Featured Homepage Announcement Hub Widget */}
      <HomeAnnouncementWidget />

      {/* Real-time System Statistics Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-[#12131b]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col">
            <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Toplam Yüklenen</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {stats ? stats.totalImages.toLocaleString('tr-TR') : '0'}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Gerçek Yükleme Sayısı</span>
          </div>

          <div className="p-6 rounded-3xl bg-white/70 dark:bg-[#12131b]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col">
            <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Toplam Depolama</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {stats ? `${stats.totalStorageMB} MB` : '0 MB'}
            </span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">Gerçek CDN Kullanımı</span>
          </div>

          <div className="p-6 rounded-3xl bg-white/70 dark:bg-[#12131b]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col">
            <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Toplam Görüntülenme</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {stats ? stats.totalViews.toLocaleString('tr-TR') : '0'}
            </span>
            <span className="text-xs text-sky-600 dark:text-sky-400 font-medium mt-1">Gerçek İzlenme Sayısı</span>
          </div>

          <div className="p-6 rounded-3xl bg-white/70 dark:bg-[#12131b]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col">
            <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">İndirmeler</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {stats ? stats.totalDownloads.toLocaleString('tr-TR') : '0'}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">Gerçek İndirme Sayısı</span>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid (Linear-style ultra clean) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Neden İnan Hızlı Medya?</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Apple sadeliği, Discord pratikliği ve Linear hızı tek bir platformda birleşti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#12131b] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Işık Hızında Yükleme & CDN</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Resimleriniz anında Cloudinary global CDN ağına iletilir. Saniyeler içinde tüm dünyadan kesintisiz erişilebilir.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#12131b] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Otomatik Format Optimizasyonu</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Yüklediğiniz ağır PNG ve JPEG resimler kalite kaybı olmadan WEBP ve AVIF formatlarına dönüştürülür.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#12131b] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tam Gizlilik & Kontrol</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Görsellerinizi ister herkese açık sergileyin, ister gizli tutun. Tek tıkla silme bağlantıları ile tam kontrol sizde.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
