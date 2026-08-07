import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import { store } from './server/store.js';
import {
  testCloudinaryConnection,
  uploadToCloudinary,
  deleteFromCloudinary,
  getCloudinaryClient,
} from './server/cloudinary.js';
import { generateSitemapXml, generateRobotsTxt } from './server/seo.js';
import { ImageItem, BlogPost, DMCAData, ContactData } from './src/types/index.js';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Trust proxy for rate limiting behind Cloud Run / Nginx
  app.set('trust proxy', 1);

  // Security Middlewares
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disabled CSP to allow external image CDN URLs & embedded scripts seamlessly
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Rate Limiting for API routes
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 300 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Çok fazla istek gönderdiniz, lütfen 15 dakika sonra tekrar deneyin.' },
  });

  app.use('/api', apiLimiter);

  // Configure Multer memory storage for uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: (store.siteSettings.maxUploadSizeMB || 25) * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
      const allowedMimes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif',
        'image/avif',
      ];
      if (allowedMimes.includes(file.mimetype.toLowerCase())) {
        cb(null, true);
      } else {
        cb(new Error(`Desteklenmeyen dosya türü: ${file.mimetype}. İzin verilenler: PNG, JPG, WEBP, GIF, AVIF`));
      }
    },
  });

  // Healthcheck API
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 1. Upload API Endpoint
  app.post('/api/upload', upload.array('images', 10), async (req, res): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ error: 'Yüklenecek resim seçilmedi.' });
        return;
      }

      const isPublic = req.body.isPublic === 'false' ? false : true;
      const userId = req.body.userId || undefined;
      const userName = req.body.userName || 'Anonim Ziyaretçi';
      const userEmail = req.body.userEmail || undefined;
      const customFolder = req.body.folder || `/uploads/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/`;

      const uploadedResults: ImageItem[] = [];

      for (const file of files) {
        const ext = path.extname(file.originalname).replace('.', '').toLowerCase() || 'jpg';
        const fileId = 'pv_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
        const deleteToken = 'del_' + Math.random().toString(36).substring(2, 15);

        let secureUrl = '';
        let thumbnailUrl = '';
        let publicId = `picvault/uploads/${fileId}`;
        let format = ext;
        let width = 1200;
        let height = 800;
        let size = file.size;

        const { isConfigured } = getCloudinaryClient();

        if (isConfigured) {
          try {
            const cloudRes = await uploadToCloudinary(file.buffer, file.originalname, customFolder);
            secureUrl = cloudRes.secureUrl;
            thumbnailUrl = cloudRes.thumbnailUrl;
            publicId = cloudRes.publicId;
            format = cloudRes.format;
            width = cloudRes.width;
            height = cloudRes.height;
            size = cloudRes.size;
          } catch (cloudErr) {
            console.warn('Cloudinary upload error, using local fallback URL:', cloudErr);
            const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            secureUrl = base64;
            thumbnailUrl = base64;
          }
        } else {
          // Fallback to high-speed inline Data URL when Cloudinary keys are not yet entered in Admin Panel or .env
          const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
          secureUrl = base64;
          thumbnailUrl = base64;
        }

        const imageRecord: ImageItem = {
          id: fileId,
          publicId,
          url: secureUrl,
          thumbnailUrl,
          title: req.body.title || file.originalname.split('.')[0],
          description: req.body.description || '',
          fileName: file.originalname,
          size,
          format,
          width,
          height,
          isPublic,
          folder: customFolder,
          userId,
          userEmail,
          userName,
          createdAt: new Date().toISOString(),
          views: 0,
          downloads: 0,
          deleteToken,
          tags: req.body.tags ? String(req.body.tags).split(',').map((t) => t.trim()) : [],
        };

        store.images.unshift(imageRecord);
        uploadedResults.push(imageRecord);
      }

      res.status(200).json({
        success: true,
        count: uploadedResults.length,
        images: uploadedResults,
      });
    } catch (error: any) {
      console.error('Upload Endpoint Error:', error);
      res.status(500).json({ error: error.message || 'Resim yüklenirken hata oluştu.' });
    }
  });

  // 2. Images Gallery Endpoint
  app.get('/api/images', (req, res) => {
    let result = [...store.images];

    // Filter by public or user
    if (req.query.userId) {
      result = result.filter((i) => i.userId === req.query.userId);
    } else if (req.query.onlyPublic !== 'false') {
      result = result.filter((i) => i.isPublic);
    }

    // Search query
    if (req.query.search) {
      const q = String(req.query.search).toLowerCase();
      result = result.filter(
        (i) =>
          i.fileName.toLowerCase().includes(q) ||
          (i.title && i.title.toLowerCase().includes(q)) ||
          (i.tags && i.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Format filter
    if (req.query.format && req.query.format !== 'all') {
      result = result.filter((i) => i.format.toLowerCase() === String(req.query.format).toLowerCase());
    }

    // Sort
    const sort = String(req.query.sort || 'newest');
    if (sort === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sort === 'views') {
      result.sort((a, b) => b.views - a.views);
    } else if (sort === 'size') {
      result.sort((a, b) => b.size - a.size);
    } else {
      // newest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json({
      total: result.length,
      images: result,
    });
  });

  // 3. Single Image Details + Increment Views
  app.get('/api/images/:id', (req, res): void => {
    const img = store.images.find((i) => i.id === req.params.id);
    if (!img) {
      res.status(404).json({ error: 'Görsel bulunamadı.' });
      return;
    }
    img.views += 1;
    res.json(img);
  });

  // 4. Increment Downloads
  app.post('/api/images/:id/download', (req, res): void => {
    const img = store.images.find((i) => i.id === req.params.id);
    if (!img) {
      res.status(404).json({ error: 'Görsel bulunamadı.' });
      return;
    }
    img.downloads += 1;
    res.json({ success: true, downloads: img.downloads });
  });

  // 5. Delete Image
  app.delete('/api/images/:id', async (req, res): Promise<void> => {
    const idx = store.images.findIndex((i) => i.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Görsel bulunamadı.' });
      return;
    }

    const img = store.images[idx];
    const deleteToken = req.query.token || req.body.deleteToken;

    // Delete from Cloudinary if possible
    if (img.publicId) {
      await deleteFromCloudinary(img.publicId);
    }

    store.images.splice(idx, 1);
    store.deletedImagesCount += 1;

    res.json({ success: true, message: 'Görsel başarıyla silindi.' });
  });

  // 6. Blog Endpoints
  app.get('/api/blogs', (_req, res) => {
    res.json(store.blogs);
  });

  app.get('/api/blogs/:slug', (req, res): void => {
    const post = store.blogs.find((b) => b.slug === req.params.slug || b.id === req.params.slug);
    if (!post) {
      res.status(404).json({ error: 'Blog yazısı bulunamadı.' });
      return;
    }
    post.views += 1;
    res.json(post);
  });

  app.post('/api/blogs', (req, res) => {
    const newBlog: BlogPost = {
      id: 'blog-' + Date.now(),
      title: req.body.title,
      slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: req.body.content,
      summary: req.body.summary,
      category: req.body.category || 'Genel',
      tags: req.body.tags || ['Görsel'],
      coverImage: req.body.coverImage || 'https://images.unsplash.com/photo-1542744094-3a31b272c490',
      authorName: req.body.authorName || 'Admin',
      createdAt: new Date().toISOString(),
      readTime: '3 dk',
      views: 0,
    };
    store.blogs.unshift(newBlog);
    res.json(newBlog);
  });

  app.delete('/api/blogs/:id', (req, res) => {
    store.blogs = store.blogs.filter((b) => b.id !== req.params.id);
    res.json({ success: true });
  });

  // 7. Stats Endpoint
  app.get('/api/stats', (_req, res) => {
    res.json(store.getStats());
  });

  // 8. Admin Cloudinary Connection Test
  app.post('/api/admin/cloudinary-test', async (req, res) => {
    const { cloudName, apiKey, apiSecret } = req.body;
    const testRes = await testCloudinaryConnection({ cloudName, apiKey, apiSecret });
    res.json(testRes);
  });

  // 9. Admin Firebase Connection Test
  app.post('/api/admin/firebase-test', (req, res) => {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || store.siteSettings.firebaseProjectId;
    if (projectId) {
      res.json({
        success: true,
        message: `Firebase Projesi (${projectId}) yapılandırması hazır!`,
      });
    } else {
      res.json({
        success: false,
        message: 'Firebase proje ID henüz yapılandırılmamış.',
      });
    }
  });

  // 10. Settings API
  app.get('/api/settings', (_req, res) => {
    res.json({
      settings: store.siteSettings,
      ads: store.adConfig,
      announcements: store.announcements.filter((a) => a.active),
    });
  });

  app.post('/api/settings', (req, res) => {
    if (req.body.settings) {
      store.siteSettings = { ...store.siteSettings, ...req.body.settings };
    }
    if (req.body.ads) {
      store.adConfig = { ...store.adConfig, ...req.body.ads };
    }
    res.json({ success: true, settings: store.siteSettings, ads: store.adConfig });
  });

  // 11. Announcements API
  app.get('/api/announcements', (_req, res) => {
    res.json(store.announcements);
  });

  app.post('/api/announcements', (req, res) => {
    const newAnn = {
      id: 'ann-' + Date.now(),
      title: req.body.title,
      message: req.body.message,
      type: req.body.type || 'info',
      active: true,
      createdAt: new Date().toISOString(),
    };
    store.announcements.unshift(newAnn);
    res.json(newAnn);
  });

  // 12. DMCA API
  app.post('/api/dmca', (req, res) => {
    const dmca: DMCAData = {
      id: 'dmca-' + Date.now(),
      fullName: req.body.fullName,
      email: req.body.email,
      companyName: req.body.companyName,
      imageUrl: req.body.imageUrl,
      originalWorkUrl: req.body.originalWorkUrl,
      statement: req.body.statement,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    store.dmcaNotices.push(dmca);
    res.json({ success: true, message: 'DMCA bildiriminiz başarıyla alındı.' });
  });

  // 13. Contact API
  app.post('/api/contact', (req, res) => {
    const contact: ContactData = {
      id: 'cnt-' + Date.now(),
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      createdAt: new Date().toISOString(),
    };
    store.contacts.push(contact);
    res.json({ success: true, message: 'Mesajınız tarafımıza ulaştı.' });
  });

  // 14. SEO Endpoints
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = process.env.APP_URL || `http://${req.headers.host}`;
    const xml = generateSitemapXml(baseUrl);
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  app.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.APP_URL || `http://${req.headers.host}`;
    const txt = generateRobotsTxt(baseUrl);
    res.header('Content-Type', 'text/plain');
    res.send(txt);
  });

  // Vite Middleware integration for SPA dev & static file serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PicVault Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
