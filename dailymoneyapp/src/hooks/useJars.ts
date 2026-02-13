'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllJars } from '@/lib/firebase';
import { AllJarsData } from '@/types';

export function useJars(userId: string | null) {
  const [jars, setJars] = useState<AllJarsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJars = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const jarsData = await getAllJars(userId);
      setJars(jarsData);
      setError(null);
    } catch (err: any) {
      console.error('Error loading jars:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadJars();
  }, [loadJars]);

  return { jars, loading, error, refetch: loadJars };
}
