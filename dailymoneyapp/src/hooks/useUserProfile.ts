'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUserProfile, createUserProfile } from '@/lib/firebase';
import { UserProfile } from '@/types';
import { User } from 'firebase/auth';

export function useUserProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let userProfile = await getUserProfile(user.uid);

      // Create profile if doesn't exist
      if (!userProfile) {
        await createUserProfile(user.uid, {
          email: user.email || '',
          name: user.displayName || 'User',
        });
        userProfile = await getUserProfile(user.uid);
      }

      setProfile(userProfile);
      setError(null);
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { profile, loading, error, refetch: loadProfile };
}
