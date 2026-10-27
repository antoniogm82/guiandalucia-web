import type { Metadata } from 'next';
import BlogList from '@/components/blog/BlogList';
import { BLOG } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Guías y artículos sobre qué ver y hacer en Andalucía: playas, pueblos, rutas y ciudades.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  return (
    <div className="wrap">
      <div className="rhead">
        <h1>Blog</h1>
        <p className="muted" style={{ maxWidth: '60ch', marginTop: 8 }}>Guías y artículos sobre qué ver y hacer en Andalucía. {BLOG.length} entradas.</p>
      </div>
      <BlogList posts={BLOG} />
      <div style={{ height: 80 }} />
    </div>
  );
}
