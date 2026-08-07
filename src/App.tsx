import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { GalleryPage } from './pages/GalleryPage';
import { ImageDetailPage } from './pages/ImageDetailPage';
import { BlogPage, BlogPostPage } from './pages/BlogPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage, TermsPage, DMCAPage } from './pages/LegalPages';
import { FAQPage } from './pages/FAQPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen bg-[#fbfbfd] text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/galeri" element={<GalleryPage />} />
                <Route path="/resim/:id" element={<ImageDetailPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/hakkimizda" element={<AboutPage />} />
                <Route path="/iletisim" element={<ContactPage />} />
                <Route path="/gizlilik-politikasi" element={<PrivacyPolicyPage />} />
                <Route path="/kullanim-sartlari" element={<TermsPage />} />
                <Route path="/dmca" element={<DMCAPage />} />
                <Route path="/sss" element={<FAQPage />} />
                <Route path="/giris" element={<AuthPage />} />
                <Route path="/kayit" element={<AuthPage />} />
                <Route path="/profil" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}
