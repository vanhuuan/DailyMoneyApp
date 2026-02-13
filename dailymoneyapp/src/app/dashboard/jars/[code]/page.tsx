'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useJars } from '@/hooks/useJars';
import { useTransactions } from '@/hooks/useTransactions';
import { JAR_DEFINITIONS, getJarByCode } from '@/lib/constants/jars';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function JarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jarCode = params.code as string;
  const { user } = useAuth();
  const { jars, loading: jarsLoading } = useJars(user?.uid || null);
  const { transactions, loading: transactionsLoading } = useTransactions(
    user?.uid || null,
    jarCode,
    50
  );

  const [jarDefinition, setJarDefinition] = useState(getJarByCode(jarCode));

  useEffect(() => {
    const def = getJarByCode(jarCode);
    if (!def) {
      router.push('/dashboard/jars');
    } else {
      setJarDefinition(def);
    }
  }, [jarCode, router]);

  if (!jarDefinition) {
    return null;
  }

  if (jarsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const jarData = jars?.[jarCode];
  const allocated = jarData?.allocated || 0;
  const balance = jarData?.balance || 0;
  const spent = jarData?.spent || 0;
  const spentPercentage = allocated > 0 ? (spent / allocated) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/jars"
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          ← Quay lại
        </Link>
        <div className="flex items-center gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl ${jarDefinition.color} text-white`}
          >
            {jarDefinition.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{jarDefinition.name}</h1>
            <p className="text-gray-600">
              {jarDefinition.percentage}% thu nhập tháng
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-2 font-semibold">Mục đích</h2>
        <p className="mb-4 text-gray-700">{jarDefinition.description}</p>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600">Ví dụ:</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
            {jarDefinition.examples.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Số dư hiện tại</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {formatCurrency(balance)}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Phân bổ tháng này</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatCurrency(allocated)}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Đã chi tiêu</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {formatCurrency(spent)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Tiến độ chi tiêu</h2>
          <span className="text-2xl font-bold">{spentPercentage.toFixed(0)}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full transition-all ${jarDefinition.color}`}
            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <span>Đã dùng: {formatCurrency(spent)}</span>
          <span>Còn lại: {formatCurrency(Math.max(balance, 0))}</span>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Lịch sử giao dịch</h2>
          <Link
            href={`/dashboard/expense?jar=${jarCode}`}
            className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            + Thêm chi tiêu
          </Link>
        </div>

        {transactionsLoading ? (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Đang tải giao dịch...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-600">
              Chưa có giao dịch nào trong hũ này
            </p>
            <Link
              href={`/dashboard/expense?jar=${jarCode}`}
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              Thêm chi tiêu đầu tiên →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
              >
                <div className="flex-1">
                  <p className="font-medium">{tx.description}</p>
                  <p className="text-sm text-gray-500">
                    {tx.category}
                    {tx.recognizedText && (
                      <span className="ml-2 text-xs">
                        ({tx.recognizedText})
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">
                    -{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatRelativeTime(tx.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
