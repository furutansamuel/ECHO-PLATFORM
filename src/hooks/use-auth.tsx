import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import * as Supabase from '@supabase/supabase-js';
import * as Sonner from 'sonner';

export type UserRole = 'citizen' | 'volunteer' | 'administrator';

interface UserProfile {
  id: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: Supabase.User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Supabase.User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isDemo = localStorage.getItem('echo_demo_mode') === 'true';

    if (isDemo) {
      // Simulate demo user
      const demoUser = {
        id: 'demo-user-id',
        email: 'demo@echo.eco',
        user_metadata: { full_name: 'Demo Showcase User' },
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {},
        created_at: new Date().toISOString(),
      } as Supabase.User;
      setUser(demoUser);
      setProfile({ 
        id: 'demo-user-id', 
        role: 'citizen', 
        full_name: 'Demo Showcase User',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'
      });
      setLoading(false);
    } else {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      });
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // First try to get the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist yet, we might want to create it if it's a new signup
          // But for now we'll just set a default role for demo purposes or handle in register
          console.log('Profile not found, user might need to complete registration');
        } else {
          throw error;
        }
      }

      if (data) {
        setProfile(data as UserProfile);
      } else {
        // Fallback for demo/dev if profiles table isn't set up yet
        setProfile({ id: userId, role: 'citizen' });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback role if database isn't fully ready
      setProfile({ id: userId, role: 'citizen' });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const isDemo = localStorage.getItem('echo_demo_mode') === 'true';
    if (isDemo) {
      localStorage.removeItem('echo_demo_mode');
      localStorage.removeItem('echo_presentation_mode');
      window.location.href = '/';
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      Sonner.toast.error(error.message);
    } else {
      Sonner.toast.success('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
