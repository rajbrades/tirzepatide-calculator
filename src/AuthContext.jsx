import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ALLOWED_DOMAIN = '10xhealthsystem.com';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check current session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          // Verify domain
          const email = session.user.email;
          if (email && email.endsWith(`@${ALLOWED_DOMAIN}`)) {
            setUser(session.user);
          } else {
            // Sign out if wrong domain
            await supabase.auth.signOut();
            setError(`Access restricted to @${ALLOWED_DOMAIN} emails only.`);
          }
        }
      } catch (err) {
        console.error('Session error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const email = session.user.email;
        if (email && email.endsWith(`@${ALLOWED_DOMAIN}`)) {
          setUser(session.user);
          setError(null);
        } else {
          // Sign out if wrong domain
          await supabase.auth.signOut();
          setUser(null);
          setError(`Access restricted to @${ALLOWED_DOMAIN} emails only.`);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithMicrosoft = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email profile openid',
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  const signInWithEmail = async (email) => {
    setError(null);

    // Validate domain before sending magic link
    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      setError(`Access restricted to @${ALLOWED_DOMAIN} emails only.`);
      return { success: false };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithMicrosoft, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
