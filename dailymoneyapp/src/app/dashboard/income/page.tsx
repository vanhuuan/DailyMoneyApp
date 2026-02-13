'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useState } from 'react';
import { addIncome } from '@/lib/firebase';
import { JAR_DEFINITIONS, calculateJarAllocation } from '@/lib/constants/jars';
import { formatCurrency, parseCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddIncomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const parsedAmount = parseCurrency(amount);

  // Calculate allocations preview
  const allocations = JAR_DEFINITIONS.map((jar) => ({
    ...jar,
    allocated: calculateJarAllocation(parsedAmount, jar.percentage),
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Vui lòng đăng nhập');
      return;
    }

    if (parsedAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (!source.trim()) {
      setError('Vui lòng nhập nguồn thu nhập');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await addIncome(user.uid, {
        amount: parsedAmount,
        source: source.trim(),
        note: note.trim(),
      });

      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error adding income:', err);
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          ← Quay lại
        </Link>
        <h1 className="text-3xl font-bold">Thêm Thu Nhập</h1>
        <p className="mt-2 text-gray-600">
          Nhập thu nhập của bạn để tự động phân bổ vào 6 hũ
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Số tiền <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="VD: 15000000 hoặc 15.000.000"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              disabled={loading}
            />
            {parsedAmount > 0 && (
              <p className="mt-1 text-sm text-gray-600">
                {formatCurrency(parsedAmount)}
              </p>
            )}
          </div>

          {/* Source */}
          <div>
            <label
              htmlFor="source"
              className="block text-sm font-medium text-gray-700"
            >
              Nguồn thu nhập <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="VD: Lương tháng 1, Bonus, Freelance, etc."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Note */}
          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700"
            >
              Ghi chú
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú thêm (tùy chọn)..."
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || parsedAmount <= 0}
            className="w-full rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : '💰 Thêm thu nhập'}
          </button>
        </form>
      </div>

      {/* Allocation Preview */}
      {parsedAmount > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Xem trước phân bổ tự động
          </h2>
          <div className="space-y-3">
            {allocations.map((jar) => (
              <div
                key={jar.code}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-xl ${jar.color} text-white`}
                  >
                    {jar.icon}
                  </div>
                  <div>
                    <p className="font-medium">{jar.name}</p>
                    <p className="text-sm text-gray-500">{jar.percentage}%</p>
                  </div>
                </div>
                <p className="text-lg font-bold">
                  {formatCurrency(jar.allocated)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-900">
              💡 Sau khi bạn nhấn &quot;Thêm thu nhập&quot;, số tiền sẽ được tự động phân
              bổ vào 6 hũ theo tỷ lệ cố định. Bạn có thể xem và quản lý chi tiết
              từng hũ tại trang{' '}
              <Link
                href="/dashboard/jars"
                className="font-medium underline hover:text-blue-700"
              >
                Quản lý 6 hũ
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
