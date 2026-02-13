'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTransactions, getTransactionsByJar } from '@/lib/firebase';
import { Transaction } from '@/types';

export function useTransactions(
  userId: string | null,
  jarCode?: string,
  maxResults: number = 50
) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = jarCode
        ? await getTransactionsByJar(userId, jarCode, maxResults)
        : await getTransactions(userId, maxResults);
      setTransactions(data);
      setError(null);
    } catch (err: any) {
      console.error('Error loading transactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, jarCode, maxResults]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return { transactions, loading, error, refetch: loadTransactions };
}
