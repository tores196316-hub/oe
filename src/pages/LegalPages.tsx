import React, { useState } from 'react';
import { ShieldCheck, FileText, AlertOctagon, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gizlilik Politikası</h1>
        <p className="text-xs text-slate-500 mt-1">Son Güncelleme: 07 Ağustos 2026</p>
      </div>

      <div className="prose prose-slate text-sm text-slate-700 space-y-4 leading-relaxed">
        <p>
          PicVault platformu olarak ziyaretçilerimizin ve kullanıcılarımızın gizliliğine yüksek seviyede önem gösteriyoruz. Bu Gizlilik Politikası belgesi, PicVault tarafından toplanan ve kaydedilen bilgi türlerini ve bunları nasıl kullandığımızı açıklamaktadır.
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">1. Toplanan Bilgiler</h3>
        <p>
          Görsel yüklediğinizde, yüklenen dosya metadataları (dosya boyutu, çözünürlük, yükleme tarihi) ve isteğe bağlı kullanıcı bilgileri sistemlerimizde güvenle saklanır.
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">2. Görsel Depolama ve CDN</h3>
        <p>
          Tüm yüklenen görseller Cloudinary CDN altyapısında barındırılır. Kullanıcılar yükledikleri içerikleri diledikleri an silebilirler.
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">3. Çerezler (Cookies)</h3>
        <p>
          Sitemiz çerezleri kullanıcı oturum tercihlerini hatırda tutmak ve site performansını optimize etmek amacıyla kullanır.
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Kullanım Şartları</h1>
        <p className="text-xs text-slate-500 mt-1">Son Güncelleme: 07 Ağustos 2026</p>
      </div>

      <div className="prose prose-slate text-sm text-slate-700 space-y-4 leading-relaxed">
        <p>
          PicVault platformuna erişerek ve kullanarak aşağıdaki şart ve koşulları kabul etmiş sayılırsınız.
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">1. Yasaklı İçerikler</h3>
        <p>
          Yasadışı, telif hakkı ihlali içeren, pornografik, telifli içerikler, zararlı yazılım veya şiddet barındıran görsellerin yüklenmesi kesinlikle yasaktır. Bu tür içerikler anında tespit edilir ve sistemden kaldırılır.
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">2. Hizmet Garantisi</h3>
        <p>
          PicVault kesintisiz hizmet vermeyi amaçlar ancak beklenmeyen teknik arızalar nedeniyle oluşabilecek veri kayıplarından doğrudan sorumlu tutulamaz.
        </p>
      </div>
    </div>
  );
};

export const DMCAPage: React.FC = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    companyName: '',
    imageUrl: '',
    originalWorkUrl: '',
    statement: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.imageUrl || !form.statement) {
      showToast('Lütfen zorunlu alanları doldurun.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/dmca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
        showToast('DMCA bildirimi başarıyla alındı', 'success');
      }
    } catch (err) {
      showToast('DMCA formu gönderilemedi.', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="border-b border-slate-200 pb-4 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <AlertOctagon className="w-7 h-7 text-rose-600" /> DMCA Telif Hakkı Bildirimi
        </h1>
        <p className="text-xs text-slate-500">
          Telif hakkı size veya temsil ettiğiniz kuruma ait olan bir görselin sitemizde izinsiz paylaşıldığını düşünüyorsanız lütfen aşağıdaki formu doldurun.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-3xl bg-emerald-50 text-emerald-900 text-center space-y-3 border border-emerald-200">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold">DMCA Bildirimi İncelemeye Alındı</h3>
          <p className="text-xs text-emerald-800">
            Telif ihlali talebiniz Hukuk Ekibimiz tarafından maksimum 24 saat içerisinde incelenerek gereği yapılacaktır.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Adınız Soyadınız *</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">E-posta Adresiniz *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kurum / Firma Adı (Opsiyonel)</label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">İhlal Edilen Görsel URL Adresi *</label>
            <input
              type="url"
              required
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://picvault.app/resim/pv_1234"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Orijinal Eser Bağlantısı / Kanıt *</label>
            <input
              type="url"
              required
              value={form.originalWorkUrl}
              onChange={(e) => setForm({ ...form, originalWorkUrl: e.target.value })}
              placeholder="https://original-site.com/art/123"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Açıklama & Beyan *</label>
            <textarea
              rows={3}
              required
              value={form.statement}
              onChange={(e) => setForm({ ...form, statement: e.target.value })}
              placeholder="Eserin telif haklarına sahip olduğumu ve kaldırılmasını talep ettiğimi beyan ederim..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-xs flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 text-indigo-400" /> DMCA Talebi Gönder
          </button>
        </form>
      )}
    </div>
  );
};
