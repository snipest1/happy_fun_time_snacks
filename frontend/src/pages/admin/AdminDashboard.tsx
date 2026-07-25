import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const deletePost = async (id: number) => {
    if (confirm('Delete this post?')) {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) {
        console.error('Error deleting post:', error);
      } else {
        fetchPosts();
      }
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    const { error } = await supabase
      .from('blog_posts')
      .update({ status: newStatus, published_at: newStatus === 'published' ? new Date().toISOString() : null })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      fetchPosts();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-teal-400">Blog Dashboard</h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/admin/post/new')}
              className="bg-teal-500 hover:bg-teal-600 px-6 py-2 rounded font-bold"
            >
              + New Post
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-bold"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Created</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-slate-700 hover:bg-slate-700">
                  <td className="px-6 py-3">{post.title}</td>
                  <td className="px-6 py-3">{post.category}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded text-sm font-bold ${post.status === 'published' ? 'bg-green-600' : 'bg-yellow-600'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-3 space-x-2">
                    <button
                      onClick={() => navigate(`/admin/post/${post.id}/edit`)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(post.id, post.status)}
                      className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
                    >
                      {post.status === 'draft' ? 'Publish' : 'Unpublish'}
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {posts.length === 0 && <p className="text-center py-8 text-slate-400">No posts yet. Create your first one!</p>}
      </div>
    </div>
  );
};
