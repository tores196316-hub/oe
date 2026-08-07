export interface ImageItem {
  id: string;
  publicId: string;
  url: string;
  thumbnailUrl: string;
  title?: string;
  description?: string;
  fileName: string;
  size: number; // bytes
  format: string;
  width: number;
  height: number;
  isPublic: boolean;
  folder: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  createdAt: string;
  views: number;
  downloads: number;
  deleteToken?: string;
  tags?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  coverImage: string;
  authorName: string;
  createdAt: string;
  readTime: string;
  views: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Comment {
  id: string;
  imageId?: string;
  blogId?: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
  apiKey: string;
  totalUploads: number;
  totalViews: number;
  totalDownloads: number;
  totalStorageBytes: number;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  active: boolean;
  createdAt: string;
}

export interface AdConfig {
  popupEnabled: boolean;
  popupCode: string;
  bannerEnabled: boolean;
  bannerCode: string;
  sidebarEnabled: boolean;
  sidebarCode: string;
  footerEnabled: boolean;
  footerCode: string;
  timerSeconds: number;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  seoKeywords: string;
  analyticsId: string;
  maxUploadSizeMB: number;
  allowedFormats: string[];
  requireAuthToUpload: boolean;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  hasCloudinarySecret: boolean;
  firebaseProjectId?: string;
}

export interface SystemStats {
  totalImages: number;
  totalUsers: number;
  totalViews: number;
  totalDownloads: number;
  totalStorageMB: number;
  bandwidthUsedMB: number;
  deletedImagesCount: number;
}

export interface DMCAData {
  id?: string;
  fullName: string;
  email: string;
  companyName?: string;
  imageUrl: string;
  originalWorkUrl: string;
  statement: string;
  status?: 'pending' | 'reviewed' | 'removed';
  createdAt?: string;
}

export interface ContactData {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
}
