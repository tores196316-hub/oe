import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Eye, Clock, ArrowLeft, Search, Tag, User, Share2 } from 'lucide-react';
import { BlogPost } from '../types';
import { useToast } from '../context/ToastContext';

export const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBlogs(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Blog & Rehberler</h1>
        <p className="text-sm text-slate-500">
          Görsel optimizasyonu, web performansı, CDN teknolojileri ve SEO hakkında en güncel yazılar.
        </p>

        {/* Search */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Blog başlıklarında ara..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-3xl bg-slate-200/60 animate-pulse" />
          <div className="h-64 rounded-3xl bg-slate-200/60 animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredBlogs.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col space-y-4"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-48 object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-300"
              />
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                    {post.category}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mt-2">
                    {post.title}
                  </h2>
                  <p className="text-xs text-slate-500 line-clamp-3 mt-1.5 leading-relaxed">{post.summary}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {post.authorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/blogs/${slug}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Yazı Bulunamadı</h2>
        <Link to="/blog" className="inline-block px-4 py-2 bg-slate-900 text-white rounded-xl text-xs">
          Blog Listesine Dön
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" /> Tüm Bloglar
      </Link>

      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
          {post.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {post.title}
        </h1>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-4">
            <span>{post.authorName}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
            <span>•</span>
            <span>{post.readTime} okuma</span>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showToast('Yazı adresi kopyalandı!', 'success');
            }}
            className="flex items-center gap-1 text-indigo-600 font-semibold hover:underline"
          >
            <Share2 className="w-4 h-4" /> Paylaş
          </button>
        </div>
      </div>

      <img src={post.coverImage} alt={post.title} className="w-full h-80 object-cover rounded-3xl shadow-md" />

      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base space-y-4">
        {post.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
        <Tag className="w-4 h-4 text-slate-400" />
        {post.tags.map((t) => (
          <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
            #{t}
          </span>
        ))}
      </div>
    </article>
  );
};
