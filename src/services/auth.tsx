import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not configured, we simulate a user for demo purposes
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured. Using mock auth.");
      // Don't auto-login in demo mode to let user see the login screen
      // currently just check session
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      // Mock login
      const mockUser: any = { id: 'mock-user-1', email: 'demo@voyageos.com', user_metadata: { full_name: 'Demo Traveler' } };
      setUser(mockUser);
      setSession({ user: mockUser, access_token: 'mock', token_type: 'bearer' } as any);
      toast.success("Demo Mode: Logged in!");
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) toast.error(error.message);
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
       toast.success("Demo Mode: Logged in!");
       const mockUser: any = { id: 'mock-user-1', email, user_metadata: { full_name: 'Demo Traveler' } };
       setUser(mockUser);
       return;
    }
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured()) {
        toast.success("Demo Mode: Account created!");
        return;
    }
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`
            }
        }
    });
    if (error) throw error;
    toast.success("Account created! Please sign in.");
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      setSession(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
