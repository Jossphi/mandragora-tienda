import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({ user: null, profile: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recovering, setRecovering] = useState(false);

  const loadProfile = useCallback(async (u) => {
    if (!u) { setProfile(null); return; }
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, department_id, district, address, reference, roles(name)')
      .eq('id', u.id)
      .maybeSingle();
    setProfile(data || null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      loadProfile(u).finally(() => setLoading(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
      const u = session?.user ?? null;
      setUser(u);
      // Defer DB calls out of the auth callback (recommended by supabase-js).
      setTimeout(() => loadProfile(u), 0);
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const refreshProfile = useCallback(() => loadProfile(user), [loadProfile, user]);
  const signOut = useCallback(() => supabase.auth.signOut(), []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, signOut, recovering, endRecovery: () => setRecovering(false) }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
