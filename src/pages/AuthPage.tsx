import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterPage = location.pathname === '/kayit';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginGoogle, loginWithEmail } = useAuth();
  const { showToast } = useToast();

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      await loginGoogle();
      showToast('Google ile giriş başarılı!', 'success');
      navigate('/profil');
    } catch (err: any) {
      showToast('Giriş başarısız: ' + (err.message || 'Hata oluştu'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          {isRegisterPage ? 'Yeni Hesap Oluştur' : 'PicVault\'a Giriş Yap'}
        </h1>
        <p className="text-xs text-slate-500">
          Görsellerinizi yönetin, özel galeriler oluşturun ve API anahtarınızı alın.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.24c-.25-.75-.38-1.55-.38-2.36s.13-1.61.38-2.36V6.37H1.29C.47 8.01 0 9.94 0 12s.47 3.99 1.29 5.63l3.99-3.39z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.37l3.99 3.39c.95-2.85 3.6-4.96 6.72-4.96z"
            />
          </svg>
          Google ile {isRegisterPage ? 'Kayıt Ol' : 'Giriş Yap'}
        </button>

        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-[10px] uppercase font-bold text-slate-400">veya</span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginWithEmail(email);
            showToast(
              email.trim().toLowerCase() === 'tores196316@gmail.com'
                ? 'Yönetici olarak giriş yapıldı'
                : 'E-posta ile giriş yapıldı',
              'success'
            );
            navigate(email.trim().toLowerCase() === 'tores196316@gmail.com' ? '/admin' : '/profil');
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">E-posta Adresi</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@domain.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2"
          >
            {isRegisterPage ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {isRegisterPage ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
};
