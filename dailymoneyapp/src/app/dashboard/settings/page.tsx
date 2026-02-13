'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useUserProfile } from '@/hooks/useUserProfile';
import { updateUserProfile } from '@/lib/firebase';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { formatCurrency, parseCurrency } from '@/lib/utils';

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { profile, loading: profileLoading, refetch } = useUserProfile(user);

  const [name, setName] = useState(profile?.name || '');
  const [monthlyIncome, setMonthlyIncome] = useState(
    profile?.monthlyIncome ? profile.monthlyIncome.toString() : ''
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update form when profile loads
  useState(() => {
    if (profile) {
      setName(profile.name);
      setMonthlyIncome(profile.monthlyIncome?.toString() || '');
    }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Vui lòng đăng nhập');
      return;
    }

    if (!name.trim()) {
      setError('Vui lòng nhập tên');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const parsedIncome = parseCurrency(monthlyIncome);

      await updateUserProfile(user.uid, {
        name: name.trim(),
        monthlyIncome: parsedIncome,
      });

      setSuccess('Cập nhật thành công!');
      await refetch();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (err: any) {
      console.error('Error logging out:', err);
      setError('Có lỗi khi đăng xuất');
    }
  };

  if (profileLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const parsedIncome = parseCurrency(monthlyIncome);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Cài Đặt</h1>
        <p className="mt-2 text-gray-600">
          Quản lý thông tin cá nhân và cài đặt tài khoản
        </p>
      </div>

      {/* Account Info */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Thông tin tài khoản</h2>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">Email không thể thay đổi</p>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Tên hiển thị
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              disabled={saving}
            />
          </div>

          {/* Monthly Income */}
          <div>
            <label
              htmlFor="monthlyIncome"
              className="block text-sm font-medium text-gray-700"
            >
              Thu nhập tháng (tham khảo)
            </label>
            <input
              type="text"
              id="monthlyIncome"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="VD: 15000000 hoặc 15.000.000"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              disabled={saving}
            />
            {parsedIncome > 0 && (
              <p className="mt-1 text-sm text-gray-600">
                {formatCurrency(parsedIncome)}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Chỉ dùng để tham khảo, không ảnh hưởng đến phân bổ thực tế
            </p>
          </div>

          {/* Error & Success */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>

      {/* App Info */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Về ứng dụng</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>DailyMoneyApp</strong> - Quản lý tài chính thông minh với AI
          </p>
          <p>Phiên bản: 1.0.0 (Beta)</p>
          <p>
            Phương pháp 6 hũ được phát triển bởi T. Harv Eker, giúp bạn quản lý
            tài chính hiệu quả.
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-red-900">Nguy hiểm</h2>
        <p className="mb-4 text-sm text-red-800">
          Đăng xuất khỏi tài khoản của bạn
        </p>
        <button
          onClick={handleLogout}
          className="rounded-md border border-red-600 bg-white px-6 py-2 font-medium text-red-600 hover:bg-red-50"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
