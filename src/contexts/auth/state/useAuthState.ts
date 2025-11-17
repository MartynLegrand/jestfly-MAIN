import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../../integrations/supabase/client';
import { UserProfile } from '../../../types/auth';
import { initializeAuthState } from '../utils/initAuthState';
import { toast } from 'sonner';

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        setLoading(true);
        const { user, profile, error: initError } = await initializeAuthState();

        if (!mounted) return;

        if (initError) {
          setError(initError);
          setCurrentUser(user);
          setUserData(profile);
        } else {
          setCurrentUser(user);
          setUserData(profile);
          setError(null);
        }
      } catch (err: any) {
        if (!mounted) return;
        console.error('Erro ao inicializar autenticação:', err);
        setError(err.message || 'Erro desconhecido');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          setCurrentUser(session.user);
          const { profile } = await initializeAuthState();
          if (profile) {
            setUserData(profile);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setUserData(null);
        } else if (event === 'USER_UPDATED' && session?.user) {
          setCurrentUser(session.user);
          const { profile } = await initializeAuthState();
          if (profile) {
            setUserData(profile);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshUserData = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUserData(data as UserProfile);
      }
    } catch (err: any) {
      console.error('Erro ao atualizar dados do usuário:', err);
      toast.error('Erro ao atualizar perfil');
    }
  };

  const checkPermission = (requiredRoles: string[]): boolean => {
    if (!userData) return false;

    if (userData.profile_type === 'admin') return true;

    return requiredRoles.includes(userData.profile_type || '');
  };

  const isAdmin = userData?.profile_type === 'admin';
  const isArtist = userData?.profile_type === 'artist';

  return {
    currentUser,
    userData,
    loading,
    error,
    setError,
    setUserData,
    isAdmin,
    isArtist,
    hasPermission: checkPermission,
    refreshUserData,
  };
};
