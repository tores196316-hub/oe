import React from 'react';
import { Shield, Zap, Cloud, Lock, Sparkles, CheckCircle2, Globe, Server } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <span className="px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> PicVault Vizyonu
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Sade, Güvenli ve Ultra Hızlı Görsel Barındırma
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Apple'ın rafine estetiği, Discord'un pratik paylaşım deneyimi ve Linear'ın yüksek performans prensiplerinden ilham alarak tasarlandı.
        </p>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Cloud className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Cloudinary Küresel CDN Altyapısı</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Resimleriniz tüm dünyadaki en yakın Edge sunuculara dağıtılır. Işık hızında yüklenme süreleriyle ziyaretçilerinize kusursuz bir deneyim sunar.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Uçtan Uca Veri Güvenliği</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Yüklediğiniz tüm resimler SSL 256-bit şifreleme katmanı ile korunur. Dilediğiniz an tek tıkla sistemden silebilirsiniz.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Akıllı Dönüştürücü (AVIF & WEBP)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Görsellerinizin boyutu kalite kaybı yaşanmadan %70'e kadar küçültülür, bant genişliğiniz verimli kullanılır.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Geliştirici Dostu API</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Uygulama ve web siteleriniz için kolay entegre edilebilir REST API anahtarı ve doğrudan gömme (embed) kodları.
          </p>
        </div>
      </div>
    </div>
  );
};
