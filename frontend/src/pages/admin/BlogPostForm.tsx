import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'R&D' | 'Case Study' | 'Industry Insights';
  featured: boolean;
}

export const BlogPostForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<BlogPostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'R&D',
    featured: false,
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost(parseInt(id));
    }
  }, [id]);

  const fetchPost = async (postId: number) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) {
      setError('Failed to load post');
    } else {
      setForm(data);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm({
      ...form,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (id) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            ...form,
            updated_at: new Date().toISOString(),
          })
          .eq('id', parseInt(id));

        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert([form]);
        if (error) throw error;
      }

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-teal-400 mb-8">{id ? 'Edit Post' : 'New Post'}</h1>

        {error && <div className="bg-red-600 text-white p-4 rounded mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-lg space-y-6">
          <div>
            <label className="block text-slate-300 mb-2 font-bold">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-bold">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-bold">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-bold">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={12}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-400 outline-none font-mono text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-bold">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as any })}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-400 outline-none"
            >
              <option value="R&D">R&D</option>
              <option value="Case Study">Case Study</option>
              <option value="Industry Insights">Industry Insights</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="mr-3"
            />
            <label className="text-slate-300 font-bold">Featured Post</label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-8 rounded disabled:opacity-50"
            >
              {saving ? 'Saving...' : id ? 'Update Post' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-8 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
