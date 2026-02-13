'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { formatCurrency } from '@/lib/utils';
import { JAR_DEFINITIONS } from '@/lib/constants/jars';
import { useJars } from '@/hooks/useJars';
import { useTransactions } from '@/hooks/useTransactions';
import { useUserProfile } from '@/hooks/useUserProfile';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile } = useUserProfile(user);
  const { jars, loading: jarsLoading } = useJars(user?.uid || null);
  const { transactions, loading: transactionsLoading } = useTransactions(
    user?.uid || null,
    undefined,
    5
  );

  // Calculate total balance from jars
  const totalBalance = jars
    ? Object.values(jars).reduce((sum, jar) => sum + jar.balance, 0)
    : 0;

  const monthlyIncome = profile?.monthlyIncome || 0;

  // Combine jar definitions with real data
  const jarsData = JAR_DEFINITIONS.map((jar) => {
    const realData = jars?.[jar.code];
    return {
      ...jar,
      allocated: realData?.allocated || 0,
      spent: realData?.spent || 0,
      balance: realData?.balance || 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Xin chào, {user?.displayName || 'bạn'}!
        </h1>
        <p className="mt-1 text-gray-600">
          Chào mừng trở lại với DailyMoneyApp
        </p>
      </div>

      {/* Total Balance Card */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <p className="text-sm opacity-90">Tổng số dư</p>
        <h2 className="mt-2 text-4xl font-bold">
          {formatCurrency(totalBalance)}
        </h2>
        <p className="mt-2 text-sm opacity-75">
          Thu nhập tháng này:{' '}
          <span className="font-semibold">
            {formatCurrency(monthlyIncome)}
          </span>
        </p>
        <Link
          href="/dashboard/income"
          className="mt-4 inline-block rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100"
        >
          + Thêm thu nhập
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/dashboard/chat"
          className="block rounded-lg bg-white p-6 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <h3 className="font-semibold">AI Chat</h3>
              <p className="text-sm text-gray-600">Ghi chi tiêu nhanh</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/income"
          className="block rounded-lg bg-white p-6 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <h3 className="font-semibold">Thêm thu nhập</h3>
              <p className="text-sm text-gray-600">Phân bổ vào 6 hũ</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/statistics"
          className="block rounded-lg bg-white p-6 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h3 className="font-semibold">Thống kê</h3>
              <p className="text-sm text-gray-600">Xem báo cáo</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/shortcuts"
          className="block rounded-lg bg-white p-6 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
              <span className="text-2xl">🎙️</span>
            </div>
            <div>
              <h3 className="font-semibold">Siri Shortcuts</h3>
              <p className="text-sm text-gray-600">Điều khiển giọng nói</p>
            </div>
          </div>
        </Link>
      </div>

      {/* 6 Jars Grid */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">6 Hũ tài chính</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jarsData.map((jar) => (
            <div
              key={jar.code}
              className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                    style={{
                      backgroundColor: getJarColorHex(jar.color),
                      opacity: 0.2,
                    }}
                  >
                    {jar.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{jar.code}</h3>
                    <p className="text-sm text-gray-500">{jar.name}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{jar.percentage}%</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phân bổ</span>
                  <span className="font-medium">
                    {formatCurrency(jar.allocated)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Đã chi</span>
                  <span className="font-medium">
                    {formatCurrency(jar.spent)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Còn lại</span>
                  <span className={jar.balance < 0 ? 'text-red-600' : ''}>
                    {formatCurrency(jar.balance)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          (jar.spent / (jar.allocated || 1)) * 100,
                          100
                        )}%`,
                        backgroundColor: getJarColorHex(jar.color),
                      }}
                    />
                  </div>
                </div>
              </div>

              <Link
                href={`/dashboard/jars/${jar.code}`}
                className="mt-4 block rounded-md border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      {!transactionsLoading && transactions.length > 0 && (
        <div>
          <h2 className="mb-4 text-2xl font-bold">Giao dịch gần đây</h2>
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                    style={{
                      backgroundColor: getJarColorHex(`jar-${tx.jarCode.toLowerCase()}`),
                      opacity: 0.2,
                    }}
                  >
                    {JAR_DEFINITIONS.find(j => j.code === tx.jarCode)?.icon}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-gray-500">
                      {tx.jarCode} • {tx.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">
                    -{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started */}
      {monthlyIncome === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">🎉 Chào mừng!</h3>
            <p className="mt-2 text-gray-600">
              Bạn đã setup thành công DailyMoneyApp. Hãy bắt đầu bằng cách
              thêm thu nhập tháng này!
            </p>
            <Link
              href="/dashboard/income"
              className="mt-4 inline-block rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 font-medium text-white hover:opacity-90"
            >
              + Thêm thu nhập ngay
            </Link>
          </div>
        </div>
      )}

      {/* Loading State */}
      {jarsLoading && (
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</p>
        </div>
      )}
    </div>
  );
}

// Helper function to get hex color from jar color class
function getJarColorHex(colorClass: string): string {
  const colorMap: Record<string, string> = {
    'jar-nec': '#22C55E',
    'jar-ffa': '#F59E0B',
    'jar-ltss': '#3B82F6',
    'jar-edu': '#8B5CF6',
    'jar-play': '#EC4899',
    'jar-give': '#EF4444',
  };
  return colorMap[colorClass] || '#6B7280';
}
