import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, MessageSquare, Globe } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('Lütfen gerekli alanları doldurun.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSent(true);
        showToast('Mesajınız başarıyla iletildi!', 'success');
        setForm({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      showToast('Mesaj gönderilemedi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">İletişim & Destek</h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Sorularınız, önerileriniz veya sponsorluk görüşmeleriniz için bize dilediğiniz an ulaşabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" /> Bize Mesaj Gönderin
          </h2>

          {sent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="font-bold text-sm">Mesajınız Alındı!</p>
              <p className="text-xs text-emerald-700">En kısa sürede e-posta adresiniz üzerinden geri dönüş sağlayacağız.</p>
              <button
                onClick={() => setSent(false)}
                className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
              >
                Yeni Mesaj Yaz
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Adınız Soyadınız *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ahmet Yılmaz"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">E-posta Adresiniz *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ahmet@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Konu</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Destek, Öneri, Bildirim..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mesajınız *</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Mesajınızı detaylıca açıklayabilirsiniz..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4 text-indigo-400" />
                {loading ? 'Gönderiliyor...' : 'Mesajı Gönder'}
              </button>
            </form>
          )}
        </div>

        {/* Info & Map UI */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-slate-900">İletişim Bilgileri</h2>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">E-posta</p>
                  <p>destek@picvault.app</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Merkez Ofis</p>
                  <p>Maslak Teknoloji Vadisi, Sarıyer / İstanbul</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Sosyal Medya</p>
                  <p>@picvault_app (Twitter, GitHub, Discord)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simulated Google Maps Area */}
          <div className="p-4 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md overflow-hidden relative">
            <div className="h-44 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              <div className="relative z-10 text-center space-y-1">
                <MapPin className="w-8 h-8 text-indigo-400 animate-bounce mx-auto" />
                <p className="font-bold text-xs text-slate-200">İstanbul Veri Merkezi & Ofis</p>
                <span className="text-[10px] text-slate-400">41.1086° N, 29.0232° E</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
