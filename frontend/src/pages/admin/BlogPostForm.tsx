import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'R&D' | 'Case Study' | 'Industry Insights';
  featured: boolean;
  featured_image: string;
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
    featured_image: '',
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploading(true);

    try {
      // Validate file type
      if (!file.type.match(/image\/jpeg|image\/jpg/)) {
        throw new Error('Only JPEG files are allowed');
      }

      // Validate file size (5MB max)
      const maxSizeBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        throw new Error('File size must be less than 5MB');
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        // Store as data URI (automatically escaped by React/Supabase)
        setForm({ ...form, featured_image: base64String });
        setUploadError('');
      };
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
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
        const { id: _, created_at: __, ...updateData } = form as any;
        const { error } = await supabase
          .from('blog_posts')
          .update({
            ...updateData,
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-slate-300 font-bold">Content (Markdown)</label>
              <button
                type="button"
                onClick={() => setShowMarkdownHelp(!showMarkdownHelp)}
                className="text-teal-400 hover:text-teal-300 text-sm font-bold"
              >
                {showMarkdownHelp ? 'Hide Help' : 'Show Markdown Guide'}
              </button>
            </div>

            {showMarkdownHelp && (
              <div className="bg-slate-700 p-4 rounded mb-4 text-sm text-slate-200 space-y-2">
                <p className="font-bold text-teal-400">Markdown Formatting Guide:</p>
                <div className="font-mono space-y-1">
                  <p># H1 Heading</p>
                  <p>## H2 Heading</p>
                  <p>### H3 Heading</p>
                  <p>**bold text**</p>
                  <p>*italic text*</p>
                  <p>***bold italic***</p>
                  <p>[link text](https://example.com)</p>
                  <p>![alt text](https://example.com/image.jpg)</p>
                </div>
              </div>
            )}

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

          <div>
            <label className="block text-slate-300 mb-2 font-bold">Featured Image</label>
            <div className="space-y-4">
              {/* URL Input */}
              <div>
                <label className="block text-slate-400 text-sm mb-2">Or paste image URL:</label>
                <input
                  type="text"
                  value={form.featured_image.startsWith('data:') ? '' : form.featured_image}
                  onChange={(e) => setForm({ ...form, featured_image: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-400 outline-none text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-slate-400 text-sm mb-2">Or upload JPEG file (max 5MB):</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,image/jpeg"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-400 outline-none text-sm disabled:opacity-50"
                />
              </div>

              {uploading && <p className="text-teal-400 text-sm">Processing image...</p>}
              {uploadError && <p className="text-red-400 text-sm">{uploadError}</p>}

              {/* Preview */}
              {form.featured_image && (
                <div className="mt-4">
                  <p className="text-slate-400 text-sm mb-2">Preview:</p>
                  <img 
                    src={form.featured_image} 
                    alt="Featured" 
                    className="max-h-48 rounded border border-slate-600"
                  />
                </div>
              )}
            </div>
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
