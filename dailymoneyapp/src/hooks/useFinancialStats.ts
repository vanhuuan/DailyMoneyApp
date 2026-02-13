'use client';

import { useState, useEffect } from 'react';
import {
  getMonthlyIncome,
  getYearlyIncome,
  getLifetimeIncome,
  getMonthlyExpenses,
  getYearlyExpenses,
  getLifetimeExpenses,
} from '@/lib/firebase';

export interface FinancialStats {
  monthly: {
    income: number;
    expenses: number;
    savings: number;
  };
  yearly: {
    income: number;
    expenses: number;
    savings: number;
  };
  lifetime: {
    income: number;
    expenses: number;
    savings: number;
  };
}

export function useFinancialStats(userId: string | null) {
  const [stats, setStats] = useState<FinancialStats>({
    monthly: { income: 0, expenses: 0, savings: 0 },
    yearly: { income: 0, expenses: 0, savings: 0 },
    lifetime: { income: 0, expenses: 0, savings: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [mIncome, yIncome, lIncome, mExpenses, yExpenses, lExpenses] =
          await Promise.all([
            getMonthlyIncome(userId),
            getYearlyIncome(userId),
            getLifetimeIncome(userId),
            getMonthlyExpenses(userId),
            getYearlyExpenses(userId),
            getLifetimeExpenses(userId),
          ]);

        setStats({
          monthly: {
            income: mIncome,
            expenses: mExpenses,
            savings: mIncome - mExpenses,
          },
          yearly: {
            income: yIncome,
            expenses: yExpenses,
            savings: yIncome - yExpenses,
          },
          lifetime: {
            income: lIncome,
            expenses: lExpenses,
            savings: lIncome - lExpenses,
          },
        });
      } catch (err: any) {
        console.error('Error loading financial statistics:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải thống kê');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userId]);

  return { stats, loading, error };
}
