import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SiteSettings, AdConfig, Announcement, SystemStats } from '../types';

interface SiteContextType {
  settings: Partial<SiteSettings>;
  ads: Partial<AdConfig>;
  announcements: Announcement[];
  allAnnouncements: Announcement[];
  stats: SystemStats | null;
  loading: boolean;
  refreshData: () => Promise<void>;
  setAnnouncementsState: React.Dispatch<React.SetStateAction<Announcement[]>>;
  setSettingsState: React.Dispatch<React.SetStateAction<Partial<SiteSettings>>>;
  setAdsState: React.Dispatch<React.SetStateAction<Partial<AdConfig>>>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<Partial<SiteSettings>>({
    siteName: 'İnan Hızlı Medya',
    siteDescription: 'Hızlı ve güvenli görsel yükleme platformu',
    maxUploadSizeMB: 25,
  });
  const [ads, setAdsState] = useState<Partial<AdConfig>>({});
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSiteData = useCallback(async () => {
    try {
      const [settingsRes, annRes, statsRes] = await Promise.all([
        fetch('/api/settings').then((r) => r.json()).catch(() => null),
        fetch('/api/announcements').then((r) => r.json()).catch(() => []),
        fetch('/api/stats').then((r) => r.json()).catch(() => null),
      ]);

      if (settingsRes) {
        if (settingsRes.settings) setSettingsState(settingsRes.settings);
        if (settingsRes.ads) setAdsState(settingsRes.ads);
      }

      if (Array.isArray(annRes)) {
        setAllAnnouncements(annRes);
        setAnnouncements(annRes.filter((a: Announcement) => a.active));
      }

      if (statsRes) {
        setStats(statsRes);
      }
    } catch (err) {
      console.warn('Site Context fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteData();

    // Fast polling every 4 seconds to ensure live instant sync without needing F5 refresh across tabs
    const interval = setInterval(() => {
      fetchSiteData();
    }, 4000);

    return () => clearInterval(interval);
  }, [fetchSiteData]);

  return (
    <SiteContext.Provider
      value={{
        settings,
        ads,
        announcements,
        allAnnouncements,
        stats,
        loading,
        refreshData: fetchSiteData,
        setAnnouncementsState: setAllAnnouncements,
        setSettingsState,
        setAdsState,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
