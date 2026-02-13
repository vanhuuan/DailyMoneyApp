'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useJars } from '@/hooks/useJars';
import { useTransactions } from '@/hooks/useTransactions';
import { useFilterableFinancialStats, ViewMode } from '@/hooks/useFilterableFinancialStats';
import { JAR_DEFINITIONS } from '@/lib/constants/jars';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

export default function StatisticsPage() {
  const { user } = useAuth();
  const { jars, loading: jarsLoading } = useJars(user?.uid || null);
  const { transactions, loading: transactionsLoading } = useTransactions(
    user?.uid || null,
    undefined,
    100
  );

  // Filter states
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const { stats, loading: statsLoading } = useFilterableFinancialStats(
    user?.uid || null,
    viewMode,
    selectedMonth,
    selectedYear
  );

  if (jarsLoading || transactionsLoading || statsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalAllocated = jars
    ? Object.values(jars).reduce((sum, jar) => sum + jar.allocated, 0)
    : 0;
  const totalBalance = jars
    ? Object.values(jars).reduce((sum, jar) => sum + jar.balance, 0)
    : 0;
  const totalSpent = jars
    ? Object.values(jars).reduce((sum, jar) => sum + jar.spent, 0)
    : 0;

  // Spending by jar
  const spendingByJar = JAR_DEFINITIONS.map((jar) => {
    const jarData = jars?.[jar.code];
    return {
      ...jar,
      spent: jarData?.spent || 0,
      allocated: jarData?.allocated || 0,
    };
  }).sort((a, b) => b.spent - a.spent);

  // Spending by category
  const categoryMap: { [key: string]: number } = {};
  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
    }
  });
  const spendingByCategory = Object.entries(categoryMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Transaction count
  const transactionCount = transactions.length;

  // Helper functions for date formatting
  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  const getViewTitle = () => {
    if (viewMode === 'month') {
      return `${monthNames[selectedMonth]} ${selectedYear}`;
    } else if (viewMode === 'year') {
      return `Năm ${selectedYear}`;
    }
    return 'Cả đời';
  };

  const getViewIcon = () => {
    if (viewMode === 'month') return '📅';
    if (viewMode === 'year') return '📆';
    return '⭐';
  };

  const getGradient = () => {
    if (viewMode === 'month') return 'from-green-50 to-emerald-50';
    if (viewMode === 'year') return 'from-blue-50 to-indigo-50';
    return 'from-purple-50 to-pink-50';
  };

  // Generate year options (last 10 years)
  const yearOptions = Array.from({ length: 10 }, (_, i) => now.getFullYear() - i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Thống Kê</h1>
        <p className="mt-2 text-gray-600">
          Tổng quan chi tiêu và tài chính của bạn
        </p>
      </div>

      {/* Filter Controls */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Bộ lọc</h2>
        
        {/* View Mode Tabs */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors ${
              viewMode === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📅 Theo tháng
          </button>
          <button
            onClick={() => setViewMode('year')}
            className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors ${
              viewMode === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📆 Theo năm
          </button>
          <button
            onClick={() => setViewMode('lifetime')}
            className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors ${
              viewMode === 'lifetime'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⭐ Cả đời
          </button>
        </div>

        {/* Date Selectors */}
        {viewMode !== 'lifetime' && (
          <div className="grid gap-4 md:grid-cols-2">
            {viewMode === 'month' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Chọn tháng
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {monthNames.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Chọn năm
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Income & Savings Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Thu nhập & Tích góp</h2>

        {/* Dynamic Stats Card */}
        <div className={`rounded-lg bg-gradient-to-r ${getGradient()} p-6 shadow-sm`}>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {getViewIcon()} {getViewTitle()}
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600">Thu nhập</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {formatCurrency(stats.income)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Chi tiêu</p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                {formatCurrency(stats.expenses)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tích góp</p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  stats.savings >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(stats.savings)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Tổng quan hũ tiết kiệm</h2>
        <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Tổng phân bổ</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatCurrency(totalAllocated)}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Tổng đã chi</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {formatCurrency(totalSpent)}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Tổng số dư</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {formatCurrency(totalBalance)}
          </p>
        </div>
      </div>
      </div>

      {/* Transaction Summary */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Tổng quan giao dịch</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Tổng số giao dịch</p>
            <p className="mt-1 text-2xl font-bold">{transactionCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Trung bình mỗi giao dịch</p>
            <p className="mt-1 text-2xl font-bold">
              {transactionCount > 0
                ? formatCurrency(totalSpent / transactionCount)
                : formatCurrency(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Spending by Jar */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Chi tiêu theo hũ</h2>
        <div className="space-y-4">
          {spendingByJar.map((jar) => {
            const percentage =
              jar.allocated > 0 ? (jar.spent / jar.allocated) * 100 : 0;

            return (
              <div key={jar.code}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${jar.color} text-white`}
                    >
                      {jar.icon}
                    </div>
                    <span className="font-medium">{jar.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatCurrency(jar.spent)} / {formatCurrency(jar.allocated)}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full transition-all ${jar.color}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {percentage.toFixed(1)}% đã sử dụng
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spending by Category */}
      {spendingByCategory.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Top 5 danh mục chi tiêu
          </h2>
          <div className="space-y-3">
            {spendingByCategory.map((item, index) => {
              const percentage =
                totalSpent > 0 ? (item.amount / totalSpent) * 100 : 0;

              return (
                <div key={item.category}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium">
                      {index + 1}. {item.category}
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {percentage.toFixed(1)}% tổng chi tiêu
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {transactionCount === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-600">
            Chưa có dữ liệu thống kê. Hãy bắt đầu ghi chi tiêu!
          </p>
        </div>
      )}
    </div>
  );
}
