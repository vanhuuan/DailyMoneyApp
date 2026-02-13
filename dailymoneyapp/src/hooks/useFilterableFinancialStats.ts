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

export interface FilterableFinancialStats {
  income: number;
  expenses: number;
  savings: number;
}

export type ViewMode = 'month' | 'year' | 'lifetime';

export function useFilterableFinancialStats(
  userId: string | null,
  viewMode: ViewMode = 'month',
  month?: number,
  year?: number
) {
  const [stats, setStats] = useState<FilterableFinancialStats>({
    income: 0,
    expenses: 0,
    savings: 0,
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

        let income = 0;
        let expenses = 0;

        if (viewMode === 'month') {
          [income, expenses] = await Promise.all([
            getMonthlyIncome(userId, month, year),
            getMonthlyExpenses(userId, month, year),
          ]);
        } else if (viewMode === 'year') {
          [income, expenses] = await Promise.all([
            getYearlyIncome(userId, year),
            getYearlyExpenses(userId, year),
          ]);
        } else {
          // lifetime
          [income, expenses] = await Promise.all([
            getLifetimeIncome(userId),
            getLifetimeExpenses(userId),
          ]);
        }

        setStats({
          income,
          expenses,
          savings: income - expenses,
        });
      } catch (err: any) {
        console.error('Error loading financial statistics:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải thống kê');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userId, viewMode, month, year]);

  return { stats, loading, error };
}
