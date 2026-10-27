'use client';

import { useState } from 'react';
import BlogCard from '@/components/blog/BlogCard';
import type { BlogPost } from '@/lib/data';

// Listado del blog con filtro por categoría.
export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const cats = [...new Set(posts.map((b) => b.cat).filter(Boolean))];
  const [cat, setCat] = useState('');
  return (
    <>
      <div className="chips" id="bchips" role="group" aria-label="Filtrar por categoría" style={{ margin: '0 0 20px' }}>
        {['', ...cats].map((c) => (
          <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c || 'Todas'}</button>
        ))}
      </div>
      <div className="bgrid big" id="bgrid">
        {posts.filter((b) => !cat || b.cat === cat).map((b) => <BlogCard key={b.slug} post={b} />)}
      </div>
    </>
  );
}
