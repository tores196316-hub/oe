import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Yükleme & Kullanım',
    question: 'PicVault tamamen ücretsiz mi?',
    answer: 'Evet! PicVault temel kullanımda tamamen ücretsizdir. Hiçbir gizli ücret veya kredi kartı tanımı gerektirmez.',
  },
  {
    category: 'Yükleme & Kullanım',
    question: 'Maksimum dosya boyutu ve desteklenen formatlar nelerdir?',
    answer: 'Maksimum dosya yükleme boyutu 25 MB’dir. PNG, JPG, JPEG, WEBP, GIF ve AVIF formatları tam olarak desteklenmektedir.',
  },
  {
    category: 'Güvenlik & Gizlilik',
    question: 'Yüklediğim resimler ne kadar süre saklanır?',
    answer: 'Telif ihlali veya kullanım şartlarına aykırı bir durum tespit edilmediği sürece resimleriniz süresiz olarak saklanır.',
  },
  {
    category: 'Güvenlik & Gizlilik',
    question: 'Yüklediğim resmi nasıl silebilirim?',
    answer: 'Resmi yükledikten sonra size verilen silme bağlantısını kullanarak veya resmi inceleme sayfasındaki "Sil" butonuna tıklayarak silebilirsiniz.',
  },
  {
    category: 'Teknik & API',
    question: 'Cloudinary CDN altyapısı nasıl çalışıyor?',
    answer: 'Görselleriniz otomatik olarak yüksek performanslı Cloudinary CDN ağında saklanır. Sayfa yükleme hızlarınızı artırmak için otomatik WebP sıkıştırması uygulanır.',
  },
];

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> SSS
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sıkça Sorulan Sorular</h1>
        <p className="text-sm text-slate-500">Platform hakkında merak ettiğiniz tüm soruların yanıtları.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>{faq.question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
