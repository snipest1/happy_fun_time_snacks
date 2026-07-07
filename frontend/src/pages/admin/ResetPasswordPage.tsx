import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { validatePassword } from '../../utils/passwordValidation';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validation = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validation.isValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw new Error(error.message);

      navigate('/admin/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-teal-400 mb-6 text-center">Set New Password</h1>

        {error && <div className="bg-red-600 text-white p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-400 outline-none"
              required
            />
          </div>

          {password && (
            <div className="bg-slate-700 p-3 rounded text-sm text-slate-300">
              <p className="font-bold mb-2">Password Requirements:</p>
              <ul className="space-y-1">
                <li className={password.length >= 8 && password.length <= 15 ? 'text-green-400' : 'text-red-400'}>
                  ✓ 8-15 characters
                </li>
                <li className={/[a-z]/.test(password) ? 'text-green-400' : 'text-red-400'}>
                  ✓ Lowercase letter
                </li>
                <li className={/[A-Z]/.test(password) ? 'text-green-400' : 'text-red-400'}>
                  ✓ Uppercase letter
                </li>
                <li className={/[0-9]/.test(password) ? 'text-green-400' : 'text-red-400'}>
                  ✓ Number
                </li>
                <li className={/[!@#$%^&*();[\]_\-]/.test(password) ? 'text-green-400' : 'text-red-400'}>
                  ✓ Special character (!@#$%^&*;[]_-)
                </li>
              </ul>
            </div>
          )}

          <div>
            <label className="block text-slate-300 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-400 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !validation.isValid}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
