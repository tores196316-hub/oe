import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { AnnouncementModal } from './components/AnnouncementModal';

import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { GalleryPage } from './pages/GalleryPage';
import { ImageDetailPage } from './pages/ImageDetailPage';
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
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <SiteProvider>
              <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#0b0c10] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300">
                <AnnouncementBanner />
                <AnnouncementModal />
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/galeri" element={<Navigate to="/profil" replace />} />
                    <Route path="/resim/:id" element={<ImageDetailPage />} />
                    <Route path="/blog" element={<Navigate to="/" replace />} />
                    <Route path="/blog/:slug" element={<Navigate to="/" replace />} />
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
            </SiteProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

