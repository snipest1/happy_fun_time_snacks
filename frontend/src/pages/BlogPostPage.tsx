import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
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

        <div className="prose prose-invert max-w-none">
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</div>
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
