'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useState, useEffect } from 'react';
import { createTransaction } from '@/lib/firebase';
import { JAR_DEFINITIONS } from '@/lib/constants/jars';
import { formatCurrency, parseCurrency } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AddExpensePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultJar = searchParams.get('jar') || 'NEC';

  const [amount, setAmount] = useState('');
  const [jarCode, setJarCode] = useState(defaultJar);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const parsedAmount = parseCurrency(amount);

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

    if (!category.trim()) {
      setError('Vui lòng nhập danh mục');
      return;
    }

    if (!description.trim()) {
      setError('Vui lòng nhập mô tả');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await createTransaction(user.uid, {
        amount: parsedAmount,
        jarCode,
        category: category.trim(),
        description: description.trim(),
        type: 'expense',
      });

      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error adding expense:', err);
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
        <h1 className="text-3xl font-bold">Thêm Chi Tiêu</h1>
        <p className="mt-2 text-gray-600">
          Ghi lại chi tiêu của bạn và phân loại vào hũ phù hợp
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
              placeholder="VD: 150000 hoặc 150.000"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              disabled={loading}
            />
            {parsedAmount > 0 && (
              <p className="mt-1 text-sm text-gray-600">
                {formatCurrency(parsedAmount)}
              </p>
            )}
          </div>

          {/* Jar Selection */}
          <div>
            <label
              htmlFor="jarCode"
              className="block text-sm font-medium text-gray-700"
            >
              Chọn hũ <span className="text-red-500">*</span>
            </label>
            <select
              id="jarCode"
              value={jarCode}
              onChange={(e) => setJarCode(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              disabled={loading}
            >
              {JAR_DEFINITIONS.map((jar) => (
                <option key={jar.code} value={jar.code}>
                  {jar.icon} {jar.name} ({jar.percentage}%)
                </option>
              ))}
            </select>
            {jarCode && (
              <p className="mt-1 text-sm text-gray-600">
                {JAR_DEFINITIONS.find((j) => j.code === jarCode)?.description}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="VD: Ăn uống, Di chuyển, Mua sắm, etc."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Ăn trưa tại quán cơm..."
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
            {loading ? 'Đang xử lý...' : '💸 Thêm chi tiêu'}
          </button>
        </form>
      </div>

      {/* Quick Tip */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> Để ghi chi tiêu nhanh hơn bằng giọng nói, hãy
          dùng tính năng{' '}
          <Link
            href="/dashboard/chat"
            className="font-medium underline hover:text-blue-700"
          >
            AI Voice Chat
          </Link>
          . Bạn chỉ cần nói &quot;Vừa ăn trưa 50 nghìn&quot; và AI sẽ tự động phân loại!
        </p>
      </div>
    </div>
  );
}
