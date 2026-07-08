import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabaseClient';

interface AuthContextType {
  user: any;
  loading: boolean;
  passwordExpired: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isPasswordExpired = (lastPasswordChange: string): boolean => {
  if (!lastPasswordChange) return true;
  
  const lastChange = new Date(lastPasswordChange);
  const now = new Date();
  const daysElapsed = (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysElapsed > 90;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [passwordExpired, setPasswordExpired] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('last_password_change')
          .eq('id', session.user.id)
          .single();
        
        if (userProfile?.last_password_change) {
          setPasswordExpired(isPasswordExpired(userProfile.last_password_change));
        }
      }
      
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPasswordExpired(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, passwordExpired, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
