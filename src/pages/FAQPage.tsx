import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Search,
  UploadCloud,
  ShieldCheck,
  Zap,
  Code2,
  Users,
  MessageSquare,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'upload' | 'security' | 'cdn' | 'api';
  tags?: string[];
}

const CATEGORIES = [
  { id: 'all', label: 'Tüm Sorular', icon: HelpCircle },
  { id: 'upload', label: 'Yükleme & Limitler', icon: UploadCloud },
  { id: 'cdn', label: 'WebP/AVIF & CDN', icon: Zap },
  { id: 'security', label: 'Güvenlik & Gizlilik', icon: ShieldCheck },
  { id: 'api', label: 'Geliştirici & API', icon: Code2 },
  { id: 'general', label: 'Üyelik & Genel', icon: Users },
];

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'upload',
    question: 'İnan Hızlı Medya tamamen ücretsiz mi? Herhangi bir gizli ücret var mı?',
    answer: 'Evet! İnan Hızlı Medya temel kullanımıyla %100 ücretsizdir. Görsel yüklemek, bağlantı paylaşmak veya gömme (embed) kodlarını kullanmak için herhangi bir kredi kartı bilgisi ya da ücret talep edilmez.',
    tags: ['ücretsiz', 'limit', 'fiyatlandırma'],
  },
  {
    id: 'faq-2',
    category: 'upload',
    question: 'Maksimum dosya yükleme boyutu ve desteklenen formatlar nelerdir?',
    answer: 'Tek seferde maksimum 25 MB büyüklüğünde dosyalar yükleyebilirsiniz. Desteklenen temel formatlar: PNG, JPG, JPEG, WEBP, GIF, AVIF, SVG ve HEIC/HEIF görselleridir.',
    tags: ['dosya boyutu', 'formatlar', 'limit'],
  },
  {
    id: 'faq-3',
    category: 'cdn',
    question: 'Görsellerim Cloudinary üzerinden nasıl otomatik olarak WebP ve optimize ediliyor?',
    answer: 'Yüklediğiniz her görsel, Cloudinary küresel CDN ağına iletilerek arka planda otomatik olarak `f_auto,q_auto` algoritmasıyla işlenir. Ziyaretçinin tarayıcısına bağlı olarak (WebP/AVIF) en yüksek kalitede ancak %70\'e kadar daha küçük dosya boyutuyla sunulur.',
    tags: ['webp', 'avif', 'cloudinary', 'sıkıştırma', 'hız'],
  },
  {
    id: 'faq-4',
    category: 'upload',
    question: 'Aynı anda birden fazla resim (Toplu Yükleme) yükleyebilir miyim?',
    answer: 'Evet! Sürükle-bırak alanına dilediğiniz kadar resmi aynı anda bırakabilir veya dosya seçiciden çoklu seçim yapabilirsiniz. Yükleme sırası canlı ilerleme çubuğuyla takip edilebilir.',
    tags: ['toplu yükleme', 'sürükle bırak', 'çoklu'],
  },
  {
    id: 'faq-5',
    category: 'security',
    question: 'Yüklediğim resimler ne kadar süre sunucuda saklanır?',
    answer: 'İnan Hızlı Medya\'ya yüklenen görseller, Kullanım Şartları ve DMCA kurallarına aykırı bir durum tespit edilmediği sürece süresiz (kalıcı) olarak saklanır ve erişime açık kalır.',
    tags: ['saklama süresi', 'kalıcı', 'silinme'],
  },
  {
    id: 'faq-6',
    category: 'security',
    question: 'Yüklediğim bir resmi daha sonra nasıl silebilirim?',
    answer: 'Resmi yükledikten hemen sonra size verilen özel "Silme Bağlantısını" (Delete Token) kullanabilir ya da üye girişi yaptıysanız Profil sayfanızdaki "Yüklediklerim" panelinden tek tıkla resmi kalıcı olarak silebilirsiniz.',
    tags: ['resim silme', 'silme linki', 'profil'],
  },
  {
    id: 'faq-7',
    category: 'api',
    question: 'Geliştiriciler için REST API ve API Anahtarı desteği var mı?',
    answer: 'Evet! Profil sayfanızdan kendinize özel bir API Anahtarı (Developer API Key) üretebilirsiniz. POST /api/upload endpoint\'ini kullanarak kendi web sitelerinizden veya mobil uygulamalarınızdan doğrudan resim yükleyebilirsiniz.',
    tags: ['api', 'developer', 'rest api', 'api key'],
  },
  {
    id: 'faq-8',
    category: 'upload',
    question: 'HTML, Markdown, BBCode ve WebP direkt bağlantılarını nasıl alabilirim?',
    answer: 'Yüklenen her görselin detay sayfasında ve yükleme tamamlanma ekranında; Direkt Link, Optimize WebP Linki, HTML <img> Kodu, Forum BBCode ve Markdown gömme kodları kopyalanmaya hazır olarak sunulur.',
    tags: ['embed', 'bbcode', 'html', 'markdown', 'direkt link'],
  },
  {
    id: 'faq-9',
    category: 'security',
    question: 'Telif hakkı ihlali (DMCA) veya uygunsuz içerik bildirimi nasıl yapılır?',
    answer: 'Sitemizin alt kısmındaki "DMCA & Telif İhlali" veya "İletişim" formunu kullanarak ihlal edilen görselin bağlantısını iletebilirsiniz. İnceleme ekibimiz maksimum 24 saat içinde içeriği yayından kaldırır.',
    tags: ['dmca', 'telif', 'şikayet', 'bildirim'],
  },
  {
    id: 'faq-10',
    category: 'general',
    question: 'Üye olmadan resim yükleyebilir miyim?',
    answer: 'Kesinlikle! Üye olmadan ziyaretçi (misafir) olarak resim yükleyebilirsiniz. Ancak üye olmanız durumunda yüklediğiniz tüm resimleri tek bir panelden yönetebilir, istatistiklerinizi ve izlenme sayılarınızı görebilirsiniz.',
    tags: ['üyesiz yükleme', 'misafir', 'hesap'],
  },
  {
    id: 'faq-11',
    category: 'general',
    question: 'Karanlık Mod (Dark Mode) ve Tema tercihi var mı?',
    answer: 'Evet, sağ üst gezinti çubuğundaki Güneş/Aygah simgesine tıklayarak Aydınlık ve Karanlık mod arasında anında geçiş yapabilirsiniz. Tercihiniz tarayıcınıza kaydedilir.',
    tags: ['karanlık mod', 'dark mode', 'tema'],
  },
];

export const FAQPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<string | null>('faq-1');

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-extrabold text-indigo-700 dark:text-indigo-300 inline-flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Sıkça Sorulan Sorular & Yardım
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Aklınıza Takılan Her Şeyi Cevapladık
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Görsel yükleme limitleri, Cloudinary WebP dönüşümü, API entegrasyonu ve gizlilik standartlarımız hakkında detaylı bilgi edinin.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Soru veya anahtar kelime arayın (örn. WebP, limit, API, silme)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-[#12131b] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 px-2 py-1 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-md scale-[1.02]'
                  : 'bg-white dark:bg-[#12131b] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-300 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#12131b] rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Aradığınız kriterlere uygun soru bulunamadı</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Farklı bir arama kelimesi deneyebilir veya doğrudan İletişim ekibimizle bağlantıya geçebilirsiniz.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold"
            >
              Aramayı Sıfırla
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIndex === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl bg-white dark:bg-[#12131b] border transition-all duration-200 ${
                  isOpen
                    ? 'border-indigo-500/40 dark:border-indigo-500/50 shadow-md ring-1 ring-indigo-500/20'
                    : 'border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-xl transition-colors shrink-0 ${isOpen ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 rounded-b-2xl space-y-3">
                    <p className="pt-2">{faq.answer}</p>
                    {faq.tags && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {faq.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Support / Help Banner Card at Bottom */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-indigo-900/50">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            Aradığınız Cevabı Bulamadınız mı?
          </h3>
          <p className="text-xs text-slate-300 max-w-md">
            Destek ekibimiz sorularınızı yanıtlamaktan mutluluk duyar. Bize dilediğiniz zaman mesaj gönderebilirsiniz.
          </p>
        </div>

        <Link
          to="/contact"
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shrink-0 cursor-pointer"
        >
          <span>İletişim Formuna Git</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
