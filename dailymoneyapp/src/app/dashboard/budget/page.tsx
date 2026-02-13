'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useState, useEffect } from 'react';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '@/lib/firebase/budgetService';
import { getMonthlyExpenses } from '@/lib/firebase/transactionService';
import { Budget } from '@/types';
import { JAR_DEFINITIONS } from '@/lib/constants/jars';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function BudgetPage() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    jarCode: 'NEC',
    amount: '',
    period: 'monthly' as 'monthly' | 'yearly',
    alertThreshold: '80',
  });

  useEffect(() => {
    loadBudgets();
  }, [user]);

  const loadBudgets = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const data = await getBudgets(user.uid);
      setBudgets(data);
    } catch (error) {
      console.error('Error loading budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
      const amount = parseFloat(formData.amount.replace(/[,\.]/g, ''));

      if (editingBudget) {
        await updateBudget(user.uid, editingBudget.id!, {
          jarCode: formData.jarCode,
          amount,
          period: formData.period,
          alertThreshold: parseInt(formData.alertThreshold),
        });
      } else {
        await createBudget(user.uid, {
          jarCode: formData.jarCode,
          amount,
          period: formData.period,
          startDate: new Date(),
          alertThreshold: parseInt(formData.alertThreshold),
        });
      }

      await loadBudgets();
      resetForm();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      jarCode: budget.jarCode,
      amount: budget.amount.toString(),
      period: budget.period,
      alertThreshold: budget.alertThreshold?.toString() || '80',
    });
    setShowForm(true);
  };

  const handleDelete = async (budgetId: string) => {
    if (!user?.uid) return;
    if (!confirm('Bạn có chắc muốn xóa ngân sách này?')) return;

    try {
      await deleteBudget(user.uid, budgetId);
      await loadBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingBudget(null);
    setFormData({
      jarCode: 'NEC',
      amount: '',
      period: 'monthly',
      alertThreshold: '80',
    });
  };

  const [spending, setSpending] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    loadSpending();
  }, [user, budgets]);

  const loadSpending = async () => {
    if (!user?.uid) return;

    const spendingData: { [key: string]: number } = {};
    
    for (const budget of budgets) {
      if (budget.period === 'monthly') {
        const spent = await getMonthlyExpenses(user.uid);
        spendingData[budget.id!] = spent;
      }
    }

    setSpending(spendingData);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-600';
    if (percentage >= 80) return 'bg-orange-600';
    return 'bg-green-600';
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ngân sách</h1>
          <p className="mt-2 text-gray-600">
            Đặt và theo dõi ngân sách cho từng hũ
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white hover:opacity-90"
        >
          + Thêm ngân sách
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            {editingBudget ? 'Chỉnh sửa' : 'Thêm'} ngân sách
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Hũ tiền
                </label>
                <select
                  value={formData.jarCode}
                  onChange={(e) =>
                    setFormData({ ...formData, jarCode: e.target.value })
                  }
                  className="w-full rounded-md border px-3 py-2"
                  required
                >
                  {JAR_DEFINITIONS.map((jar) => (
                    <option key={jar.code} value={jar.code}>
                      {jar.code} - {jar.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Số tiền
                </label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="5000000"
                  className="w-full rounded-md border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Chu kỳ
                </label>
                <select
                  value={formData.period}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      period: e.target.value as 'monthly' | 'yearly',
                    })
                  }
                  className="w-full rounded-md border px-3 py-2"
                >
                  <option value="monthly">Hàng tháng</option>
                  <option value="yearly">Hàng năm</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Cảnh báo khi đạt (%)
                </label>
                <input
                  type="number"
                  value={formData.alertThreshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      alertThreshold: e.target.value,
                    })
                  }
                  min="1"
                  max="100"
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              >
                {editingBudget ? 'Cập nhật' : 'Thêm'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border px-6 py-2 hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budgets List */}
      {budgets.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-600">
            Chưa có ngân sách nào. Hãy tạo ngân sách đầu tiên!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget) => {
            const jar = JAR_DEFINITIONS.find((j) => j.code === budget.jarCode);
            const spent = spending[budget.id!] || 0;
            const percentage = (spent / budget.amount) * 100;

            return (
              <div
                key={budget.id}
                className="rounded-lg bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${jar?.color} text-white`}
                    >
                      {jar?.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{budget.jarCode}</h3>
                      <p className="text-sm text-gray-500">
                        {budget.period === 'monthly' ? 'Hàng tháng' : 'Hàng năm'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Đã chi</span>
                    <span className="font-medium">
                      {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full transition-all ${getProgressColor(
                        percentage
                      )}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span
                      className={
                        percentage >= 100
                          ? 'font-medium text-red-600'
                          : 'text-gray-500'
                      }
                    >
                      {percentage.toFixed(1)}% đã sử dụng
                    </span>
                    {percentage >= (budget.alertThreshold || 80) && (
                      <span className="text-orange-600">⚠️ Cảnh báo!</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
