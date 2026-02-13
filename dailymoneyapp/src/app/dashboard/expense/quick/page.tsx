'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createTransaction } from '@/lib/firebase';
import { parseCurrency, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function QuickExpensePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');
  const [expenseData, setExpenseData] = useState<any>(null);

  useEffect(() => {
    const handleQuickExpense = async () => {
      if (!user) {
        setStatus('error');
        setMessage('Vui lòng đăng nhập');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      try {
        // Get parameters from URL
        const description = searchParams.get('description') || searchParams.get('desc');
        const amountStr = searchParams.get('amount');
        const category = searchParams.get('category') || 'Ăn uống';
        const jarCode = searchParams.get('jar') || 'NEC';

        if (!description || !amountStr) {
          setStatus('error');
          setMessage('Thiếu thông tin chi tiêu');
          return;
        }

        const amount = parseCurrency(amountStr);

        if (amount <= 0) {
          setStatus('error');
          setMessage('Số tiền không hợp lệ');
          return;
        }

        // Save expense data for display
        setExpenseData({
          description,
          amount,
          category,
          jarCode,
        });

        // Create transaction
        await createTransaction(user.uid, {
          amount,
          jarCode,
          category,
          description,
          type: 'expense',
        });

        setStatus('success');
        setMessage(
          `Đã lưu chi tiêu: ${description} - ${formatCurrency(amount)}`
        );

        // Auto redirect after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } catch (error: any) {
        console.error('Error creating quick expense:', error);
        setStatus('error');
        setMessage(error.message || 'Có lỗi xảy ra khi lưu chi tiêu');
      }
    };

    handleQuickExpense();
  }, [user, searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        {status === 'processing' && (
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-600"></div>
            <h2 className="text-xl font-semibold text-gray-900">
              Đang lưu chi tiêu...
            </h2>
            <p className="mt-2 text-gray-600">Vui lòng đợi</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-900">
              Đã lưu thành công!
            </h2>
            <p className="mt-2 text-gray-600">{message}</p>

            {expenseData && (
              <div className="mt-4 rounded-lg bg-gray-50 p-4 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mô tả:</span>
                    <span className="font-medium">{expenseData.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(expenseData.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Danh mục:</span>
                    <span className="font-medium">{expenseData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hũ:</span>
                    <span className="font-medium">{expenseData.jarCode}</span>
                  </div>
                </div>
              </div>
            )}

            <p className="mt-4 text-sm text-gray-500">
              Tự động chuyển về Dashboard sau 3 giây...
            </p>

            <Link
              href="/dashboard"
              className="mt-4 inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Về Dashboard ngay
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-900">Có lỗi xảy ra</h2>
            <p className="mt-2 text-gray-600">{message}</p>

            <div className="mt-6 space-y-2">
              <Link
                href="/dashboard/expense"
                className="block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              >
                Thêm chi tiêu thủ công
              </Link>
              <Link
                href="/dashboard"
                className="block rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
              >
                Về Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
