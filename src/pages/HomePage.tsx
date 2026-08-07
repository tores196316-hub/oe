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
  Search,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';

export const HomePage: React.FC = () => {
  const { stats } = useSite();

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-12 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-xs font-semibold text-slate-800"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Cloudinary Altyapısı & Sınırsız Hızlı CDN</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]"
          >
            Resimlerinizi Işık Hızında Yükleyin, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-sky-600 to-slate-900">
              Güvenle Paylaşın
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
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
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 text-white font-semibold text-base shadow-xl hover:bg-slate-800 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
            >
              <Upload className="w-5 h-5 text-indigo-400 group-hover:animate-bounce" />
              <span>Resmini Hemen Yükle</span>
            </Link>

            <Link
              to="/galeri"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-semibold text-base shadow-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Galeriyi İncele</span>
            </Link>
          </motion.div>

          {/* Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
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

      {/* Real-time System Statistics Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-xs flex flex-col">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Toplam Yüklenen</span>
            <span className="text-3xl font-bold text-slate-900 mt-2">
              {stats ? stats.totalImages.toLocaleString('tr-TR') : '0'}
            </span>
            <span className="text-xs text-emerald-600 font-medium mt-1">Gerçek Yükleme Sayısı</span>
          </div>

          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-xs flex flex-col">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Toplam Depolama</span>
            <span className="text-3xl font-bold text-slate-900 mt-2">
              {stats ? `${stats.totalStorageMB} MB` : '0 MB'}
            </span>
            <span className="text-xs text-indigo-600 font-medium mt-1">Gerçek CDN Kullanımı</span>
          </div>

          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-xs flex flex-col">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Toplam Görüntülenme</span>
            <span className="text-3xl font-bold text-slate-900 mt-2">
              {stats ? stats.totalViews.toLocaleString('tr-TR') : '0'}
            </span>
            <span className="text-xs text-sky-600 font-medium mt-1">Gerçek İzlenme Sayısı</span>
          </div>

          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-xs flex flex-col">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">İndirmeler</span>
            <span className="text-3xl font-bold text-slate-900 mt-2">
              {stats ? stats.totalDownloads.toLocaleString('tr-TR') : '0'}
            </span>
            <span className="text-xs text-amber-600 font-medium mt-1">Gerçek İndirme Sayısı</span>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid (Linear-style ultra clean) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Neden PicVault?</h2>
          <p className="text-sm text-slate-500">
            Apple sadeliği, Discord pratikliği ve Linear hızı tek bir platformda birleşti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-slate-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Işık Hızında Yükleme & CDN</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Resimleriniz anında Cloudinary global CDN ağına iletilir. Saniyeler içinde tüm dünyadan kesintisiz erişilebilir.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-slate-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Otomatik Format Optimizasyonu</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Yüklediğiniz ağır PNG ve JPEG resimler kalite kaybı olmadan WEBP ve AVIF formatlarına dönüştürülür.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-slate-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Tam Gizlilik & Kontrol</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Görsellerinizi ister herkese açık sergileyin, ister gizli tutun. Tek tıkla silme bağlantıları ile tam kontrol sizde.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
