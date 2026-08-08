import React from 'react';
import { Shield, Zap, Cloud, Lock, Sparkles, CheckCircle2, Globe, Server } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <span className="px-3 py-1 rounded-full bg-slate-900/5 dark:bg-slate-800/80 border border-slate-900/10 dark:border-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> İnan Hızlı Medya Vizyonu
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Sade, Güvenli ve Ultra Hızlı Görsel Barındırma
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Apple'ın rafine estetiği, Discord'un pratik paylaşım deneyimi ve Linear'ın yüksek performans prensiplerinden ilham alarak tasarlandı.
        </p>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-[#12131b] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Cloud className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cloudinary Küresel CDN Altyapısı</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Resimleriniz tüm dünyadaki en yakın Edge sunuculara dağıtılır. Işık hızında yüklenme süreleriyle ziyaretçilerinize kusursuz bir deneyim sunar.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-[#12131b] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Uçtan Uca Veri Güvenliği</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Yüklediğiniz tüm resimler SSL 256-bit şifreleme katmanı ile korunur. Dilediğiniz an tek tıkla sistemden silebilirsiniz.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-[#12131b] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Akıllı Dönüştürücü (AVIF & WEBP)</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Görsellerinizin boyutu kalite kaybı yaşanmadan %70'e kadar küçültülür, bant genişliğiniz verimli kullanılır.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-[#12131b] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Geliştirici Dostu API</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Uygulama ve web siteleriniz için kolay entegre edilebilir REST API anahtarı ve doğrudan gömme (embed) kodları.
          </p>
        </div>
      </div>
    </div>
  );
};
