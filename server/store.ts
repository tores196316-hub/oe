import {
  ImageItem,
  BlogPost,
  Category,
  Comment,
  UserProfile,
  Announcement,
  AdConfig,
  SiteSettings,
  SystemStats,
  DMCAData,
  ContactData,
} from '../src/types/index.js';

// Pre-seeded Turkish Blog Articles
const initialBlogs: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Görsel Formatları Karşılaştırması: WEBP, AVIF, PNG ve JPEG Hangisi Seçilmeli?',
    slug: 'gorsel-formatlari-karsilastirmasi-webp-avif-png-jpeg',
    summary: 'Web siteleriniz ve sosyal medya paylaşımlarınız için doğru resim formatını seçerek yükleme sürelerini %70 oranında azaltabilirsiniz.',
    content: `Web performansının en kritik unsurlarından biri resim optimizasyonudur. 

### Modern Görsel Formatları: WEBP ve AVIF
Son yıllarda geliştirilen WEBP ve AVIF formatları, geleneksel JPEG ve PNG formatlarına kıyasla son derece yüksek sıkıştırma oranları sunar.

1. **AVIF (AV1 Image File Format):** En yüksek sıkıştırma kalitesine sahiptir.
2. **WEBP:** Tüm modern tarayıcılarda desteklenir ve şeffaflık (alpha channel) desteği sunar.
3. **PNG:** Vektörel grafikler, metin içeren görseller ve kayıpsız şeffaflık için idealdir.
4. **JPEG:** Fotoğraflar için geleneksel ve evrensel formattır.

PicVault olarak tüm görsellerinizi otomatik olarak en uygun format ve boyuta dönüştürerek ışık hızında sunuyoruz.`,
    category: 'Rehber',
    tags: ['WEBP', 'AVIF', 'SEO', 'Performans', 'Görsel Optimizasyonu'],
    coverImage: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=1200&q=80',
    authorName: 'PicVault Mühendislik Ekibi',
    createdAt: '2026-08-01T10:00:00.000Z',
    readTime: '4 dk',
    views: 1240,
  },
  {
    id: 'blog-2',
    title: 'Resim Barındırma ve Yüksek Hızlı CDN Kullanımının SEO\'ya Etkisi',
    slug: 'resim-barindirma-ve-cdn-kullaniminin-seoya-etkisi',
    summary: 'Google Core Web Vitals ölçümlerinde LCP (Largest Contentful Paint) skorunu yükseltmek için hızlı CDN altyapısı neden gereklidir?',
    content: `Arama motorları, sayfa yükleme hızını doğrudan bir sıralama faktörü olarak kabul eder. Yavaş yüklenen görseller sitenizin ziyaretçi kaybına ve arama sıralamalarında gerilemesine yol açar.

### CDN (Content Delivery Network) Avantajları
- **Düşük Gecikme Süresi (Latency):** Görseller ziyaretçiye en yakın kenar sunucudan (Edge Server) servis edilir.
- **Bant Genişliği Tasarrufu:** Ana sunucunuz üzerindeki yük azalır.
- **Önbellekleme (Caching):** Görseller tarayıcı ve CDN katmanında güvenle depolanır.`,
    category: 'SEO',
    tags: ['CDN', 'Core Web Vitals', 'LCP', 'Hız'],
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Safa Yılmaz',
    createdAt: '2026-08-04T14:30:00.000Z',
    readTime: '5 dk',
    views: 890,
  },
];

const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Rehber', slug: 'rehber', description: 'Görsel optimizasyonu ve ipuçları' },
  { id: 'cat-2', name: 'SEO', slug: 'seo', description: 'Arama motoru optimizasyonu teknikleri' },
  { id: 'cat-3', name: 'Duyurular', slug: 'duyurular', description: 'Platform güncellemeleri' },
];

const initialImages: ImageItem[] = [
  {
    id: 'img-demo-1',
    publicId: 'picvault/demo_1',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    title: 'Doğa Manzarası & Dağlar',
    description: 'Yüksek çözünürlüklü vadi manzarası',
    fileName: 'doga-manzarasi.jpg',
    size: 2450000,
    format: 'jpg',
    width: 1920,
    height: 1080,
    isPublic: true,
    folder: '/uploads/2026/08/',
    userName: 'Ahmet Demir',
    createdAt: new Date().toISOString(),
    views: 342,
    downloads: 89,
    tags: ['doğa', 'manzara', 'dağ'],
  },
  {
    id: 'img-demo-2',
    publicId: 'picvault/demo_2',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    title: 'Soyut Neon 3D Tasarım',
    description: 'Ultra minimal neon dijital sanat çalışması',
    fileName: 'soyut-art.png',
    size: 1820000,
    format: 'png',
    width: 1440,
    height: 900,
    isPublic: true,
    folder: '/uploads/2026/08/',
    userName: 'Elif Kaya',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    views: 512,
    downloads: 140,
    tags: ['art', '3d', 'minimal'],
  },
  {
    id: 'img-demo-3',
    publicId: 'picvault/demo_3',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
    title: 'Kodlama & Minimal Çalışma Alanı',
    description: 'Modern yazılım geliştirici masaüstü düzeni',
    fileName: 'workspace.webp',
    size: 980000,
    format: 'webp',
    width: 1920,
    height: 1280,
    isPublic: true,
    folder: '/uploads/2026/08/',
    userName: 'Mehmet Öz',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    views: 230,
    downloads: 45,
    tags: ['yazılım', 'kod', 'teknoloji'],
  },
];

class MemoryStore {
  public images: ImageItem[] = [...initialImages];
  public blogs: BlogPost[] = [...initialBlogs];
  public categories: Category[] = [...initialCategories];
  public comments: Comment[] = [];
  public users: UserProfile[] = [
    {
      uid: 'admin-1',
      email: 'tores196316@gmail.com',
      displayName: 'Sistem Yöneticisi',
      role: 'admin',
      apiKey: 'pv_live_sec_9938120381920381',
      totalUploads: 12,
      totalViews: 1084,
      totalDownloads: 274,
      totalStorageBytes: 5250000,
      createdAt: '2026-08-01T00:00:00.000Z',
    },
  ];
  public announcements: Announcement[] = [
    {
      id: 'ann-1',
      title: 'PicVault V2.0 Yayında!',
      message: 'Cloudinary entegrasyonu, AVIF & WEBP desteği ve yenilenen ultra hızlı CDN altyapımızla hizmetinizdeyiz.',
      type: 'info',
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];
  public dmcaNotices: DMCAData[] = [];
  public contacts: ContactData[] = [];

  public adConfig: AdConfig = {
    popupEnabled: false,
    popupCode: '<!-- Popup Ad Code -->',
    bannerEnabled: true,
    bannerCode: '<div class="p-3 text-center bg-slate-100 rounded text-xs text-slate-500">Sponsorlu Reklam Alanı</div>',
    sidebarEnabled: false,
    sidebarCode: '',
    footerEnabled: true,
    footerCode: '<div class="p-2 text-center text-xs text-slate-400">Görsel Yükleme Platformu Sponsoru</div>',
    timerSeconds: 5,
  };

  public siteSettings: SiteSettings = {
    siteName: 'PicVault',
    siteDescription: 'Apple, Discord ve Linear tarzında ultra minimal, hızlı ve güvenli resim yükleme platformu.',
    logoUrl: '/favicon.ico',
    faviconUrl: '/favicon.ico',
    seoKeywords: 'resim yükle, hızlı görsel barındırma, image host, ücretsiz resim yükleme, cloudinary, webp dönüştürücü',
    analyticsId: 'G-PV12345678',
    maxUploadSizeMB: 25,
    allowedFormats: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif'],
    requireAuthToUpload: false,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || 'lnjqbjeh',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '649449775168273',
    hasCloudinarySecret: Boolean(process.env.CLOUDINARY_API_SECRET) || true,
  };

  public deletedImagesCount = 0;

  public getStats(): SystemStats {
    const totalStorageBytes = this.images.reduce((acc, img) => acc + (img.size || 0), 0);
    const totalViews = this.images.reduce((acc, img) => acc + (img.views || 0), 0);
    const totalDownloads = this.images.reduce((acc, img) => acc + (img.downloads || 0), 0);

    return {
      totalImages: this.images.length,
      totalUsers: this.users.length,
      totalViews,
      totalDownloads,
      totalStorageMB: Math.round((totalStorageBytes / (1024 * 1024)) * 100) / 100,
      bandwidthUsedMB: Math.round(((totalStorageBytes * (totalDownloads + 1)) / (1024 * 1024)) * 100) / 100,
      deletedImagesCount: this.deletedImagesCount,
    };
  }
}

export const store = new MemoryStore();
