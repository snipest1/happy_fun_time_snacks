import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  featured: boolean;
  published_at: string;
  created_at: string;
}

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
      setFilteredPosts(data || []);
    }
    setLoading(false);
  };

  const filterByCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === '') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.category === category));
    }
  };

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  const categories = ['R&D', 'Case Study', 'Industry Insights'];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-teal-400 mb-4">Blog</h1>
        <p className="text-slate-400 mb-8 text-lg">Smart vending insights, tech development, and industry updates.</p>

        {/* Category Filter */}
        <div className="flex gap-3 mb-12 flex-wrap">
          <button
            onClick={() => filterByCategory('')}
            className={`px-4 py-2 rounded font-bold transition ${
              selectedCategory === ''
                ? 'bg-teal-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Posts
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => filterByCategory(cat)}
              className={`px-4 py-2 rounded font-bold transition ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No posts in this category yet.</div>
        ) : (
          <>
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-teal-400 mb-6">Featured</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="bg-slate-800 hover:bg-slate-700 rounded-lg overflow-hidden border-l-4 border-orange-500 transition group"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-bold">Featured</span>
                          <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded text-sm">{post.category}</span>
                        </div>
                        <h3 className="text-2xl font-bold group-hover:text-teal-400 transition mb-2">{post.title}</h3>
                        <p className="text-slate-400 mb-4">{post.excerpt}</p>
                        <div className="text-sm text-slate-500">{new Date(post.published_at).toLocaleDateString()}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            {regularPosts.length > 0 && (
              <div>
                <h2 className={`text-3xl font-bold text-teal-400 mb-6 ${featuredPosts.length > 0 ? 'mt-8' : ''}`}>
                  {featuredPosts.length > 0 ? 'More Posts' : 'Latest Posts'}
                </h2>
                <div className="space-y-4">
                  {regularPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="bg-slate-800 hover:bg-slate-700 rounded-lg p-6 transition group border border-slate-700 hover:border-teal-500"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded text-sm">{post.category}</span>
                          </div>
                          <h3 className="text-xl font-bold group-hover:text-teal-400 transition mb-2">{post.title}</h3>
                          <p className="text-slate-400">{post.excerpt}</p>
                        </div>
                        <div className="text-sm text-slate-500 ml-4 whitespace-nowrap">
                          {new Date(post.published_at).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
