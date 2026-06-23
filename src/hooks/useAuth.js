import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
  const [session, setSession] = useState(supabase.auth.getSession ? null : null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session || null);
      setUser(data.session?.user || null);
      setLoading(false);
      if (data.session?.user) {
        await fetchProfile(data.session.user.id);
      }
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, sessionData) => {
      if (!mounted) return;
      setSession(sessionData?.session || null);
      setUser(sessionData?.session?.user || null);
      if (sessionData?.session?.user) {
        await fetchProfile(sessionData.session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, user_id, favourite_station, daily_route')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to load profile', error);
      return;
    }

    setProfile(data || null);
  };

  const signUp = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  };

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setProfile(null);
    return { error };
  };

  const upsertProfile = async ({ favourite_station, daily_route }) => {
    if (!user) return null;
    const { data, error } = await supabase.from('profiles').upsert({
      user_id: user.id,
      favourite_station,
      daily_route,
    }, { onConflict: ['user_id'] }).select().single();

    if (!error) {
      setProfile(data);
    }
    return { data, error };
  };

  return useMemo(() => ({
    session,
    user,
    loading,
    profile,
    signUp,
    signIn,
    signOut,
    upsertProfile,
  }), [session, user, loading, profile]);
}
