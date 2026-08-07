import { store } from './store.js';

export function generateSitemapXml(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const now = new Date().toISOString().split('T')[0];

  const staticPages = [
    '',
    '/upload',
    '/galeri',
    '/blog',
    '/hakkimizda',
    '/iletisim',
    '/gizlilik-politikasi',
    '/kullanim-sartlari',
    '/dmca',
    '/sss',
    '/giris',
    '/kayit',
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static routes
  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBase}${page}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${page === '' || page === '/galeri' ? 'always' : 'weekly'}</changefreq>\n`;
    xml += `    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Public images
  for (const img of store.images.filter((i) => i.isPublic)) {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBase}/resim/${img.id}</loc>\n`;
    xml += `    <lastmod>${img.createdAt.split('T')[0] || now}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  }

  // Blogs
  for (const post of store.blogs) {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBase}/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${post.createdAt.split('T')[0] || now}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

export function generateRobotsTxt(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /profil
Sitemap: ${cleanBase}/sitemap.xml
`;
}
