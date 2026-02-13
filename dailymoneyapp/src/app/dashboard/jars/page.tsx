'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useJars } from '@/hooks/useJars';
import { JAR_DEFINITIONS } from '@/lib/constants/jars';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function JarsPage() {
  const { user } = useAuth();
  const { jars, loading } = useJars(user?.uid || null);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const jarsData = JAR_DEFINITIONS.map((jar) => {
    const realData = jars?.[jar.code];
    return {
      ...jar,
      allocated: realData?.allocated || 0,
      spent: realData?.spent || 0,
      balance: realData?.balance || 0,
    };
  });

  const totalAllocated = jarsData.reduce((sum, jar) => sum + jar.allocated, 0);
  const totalBalance = jarsData.reduce((sum, jar) => sum + jar.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">6 Hũ Tài Chính</h1>
        <p className="mt-2 text-gray-600">
          Quản lý chi tiêu theo phương pháp 6 hũ của T. Harv Eker
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Tổng phân bổ tháng này</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatCurrency(totalAllocated)}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Tổng số dư hiện tại</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {formatCurrency(totalBalance)}
          </p>
        </div>
      </div>

      {/* Jars Grid */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Chi tiết từng hũ</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jarsData.map((jar) => {
            const spentPercentage =
              jar.allocated > 0 ? (jar.spent / jar.allocated) * 100 : 0;

            return (
              <Link
                key={jar.code}
                href={`/dashboard/jars/${jar.code}`}
                className="group rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${jar.color} text-white`}
                    >
                      {jar.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-blue-600">
                        {jar.name}
                      </h3>
                      <p className="text-sm text-gray-500">{jar.percentage}%</p>
                    </div>
                  </div>
                </div>

                {/* Balance */}
                <div className="mb-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số dư</span>
                    <span className="font-semibold">
                      {formatCurrency(jar.balance)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phân bổ</span>
                    <span className="text-gray-500">
                      {formatCurrency(jar.allocated)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Đã chi</span>
                    <span className="text-red-600">
                      {formatCurrency(jar.spent)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-gray-500">Đã dùng</span>
                    <span className="font-medium">
                      {spentPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full transition-all ${jar.color}`}
                      style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 text-xs text-gray-500">
                  <p className="line-clamp-2">{jar.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h3 className="mb-2 font-semibold text-blue-900">
          💡 Về phương pháp 6 hũ
        </h3>
        <p className="text-sm text-blue-800">
          Phương pháp 6 hũ giúp bạn quản lý tài chính một cách khoa học bằng
          cách chia thu nhập thành 6 phần theo tỷ lệ cố định. Mỗi hũ có mục đích
          riêng, giúp bạn cân bằng giữa chi tiêu hiện tại và tích lũy tương lai.
        </p>
      </div>
    </div>
  );
}
