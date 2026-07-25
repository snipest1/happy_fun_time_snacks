import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import { supabase } from '../utils/supabaseClient';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  category: string;
  published_at: string;
  author: string;
}

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', postSlug)
      .eq('status', 'published')
      .single();

    if (error) {
      setError('Post not found');
    } else {
      setPost(data);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error || !post) return <div className="text-center py-12 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/blog" className="text-teal-400 hover:text-teal-300 mb-6 inline-block">
          ← Back to Blog
        </Link>

        {post.featured_image && (
          <div className="w-full h-96 rounded-lg overflow-hidden mb-8 bg-slate-800">
            <img 
              src={post.featured_image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded text-sm">{post.category}</span>
            <span className="text-slate-500">{new Date(post.published_at).toLocaleDateString()}</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
          <div className="border-b border-slate-700 pb-6">
            <p className="text-slate-400">By {post.author}</p>
          </div>
        </div>

        <div className="space-y-4">
          <style>{`
            .markdown-content h1 { font-size: 2.25rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; }
            .markdown-content h2 { font-size: 1.875rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; }
            .markdown-content h3 { font-size: 1.5rem; font-weight: bold; margin-top: 1.25rem; margin-bottom: 0.5rem; }
            .markdown-content p { margin-bottom: 1rem; }
            .markdown-content a { color: #14b8a6; text-decoration: underline; }
            .markdown-content a:hover { color: #0d9488; }
            .markdown-content img { border-radius: 0.5rem; margin: 1.5rem 0; max-width: 100%; }
          `}</style>
          <div 
            className="markdown-content text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: marked(post.content) }}
          />
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8">
          <Link to="/blog" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded inline-block">
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
};
