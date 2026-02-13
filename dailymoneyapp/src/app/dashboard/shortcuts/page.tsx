'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ShortcutsPage() {
  const [copied, setCopied] = useState('');

  const shortcuts = [
    {
      id: 'quick-expense',
      name: 'Ghi chi tiêu thông minh',
      description: 'Nói "Tôi ăn trưa 50000" để lưu chi tiêu tự động',
      url: `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard/expense/quick`,
      siriCommand: 'Tôi ăn trưa năm mươi nghìn',
      icon: '🎙️',
      color: 'from-orange-500 to-red-500',
      isAdvanced: true,
    },
    {
      id: 'expense',
      name: 'Ghi chi tiêu (mở form)',
      description: 'Mở trang ghi chi tiêu nhanh chóng',
      url: `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard/expense`,
      siriCommand: 'Ghi chi tiêu',
      icon: '💸',
      color: 'from-red-500 to-pink-500',
    },
    {
      id: 'income',
      name: 'Ghi thu nhập',
      description: 'Thêm thu nhập và phân bổ tự động',
      url: `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard/income`,
      siriCommand: 'Ghi thu nhập',
      icon: '💰',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'statistics',
      name: 'Xem thống kê',
      description: 'Xem tổng quan tài chính của bạn',
      url: `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard/statistics`,
      siriCommand: 'Xem thống kê tài chính',
      icon: '📊',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      id: 'jars',
      name: 'Quản lý 6 hũ',
      description: 'Xem và quản lý 6 hũ tiết kiệm',
      url: `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard/jars`,
      siriCommand: 'Mở 6 hũ',
      icon: '🏺',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Siri Shortcuts</h1>
        <p className="mt-2 text-gray-600">
          Thiết lập lối tắt giọng nói để sử dụng app nhanh hơn
        </p>
      </div>

      {/* Instructions */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          📱 Cách thiết lập Siri Shortcuts
        </h2>
        <ol className="space-y-3 text-gray-700">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              1
            </span>
            <span>
              Mở app <strong>Shortcuts</strong> (Lối tắt) trên iPhone/iPad của
              bạn
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              2
            </span>
            <span>
              Nhấn nút <strong>+</strong> ở góc trên bên phải để tạo shortcut
              mới
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              3
            </span>
            <span>
              Tìm và thêm action <strong>&quot;Open URL&quot;</strong> (Mở URL)
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              4
            </span>
            <span>
              Dán URL từ các shortcut bên dưới vào ô <strong>URL</strong>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              5
            </span>
            <span>
              Nhấn vào tên shortcut ở trên cùng, đặt tên và thêm{' '}
              <strong>Siri phrase</strong>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              6
            </span>
            <span>
              Lưu lại và thử nói <strong>&quot;Hey Siri&quot;</strong> + câu
              lệnh bạn vừa thiết lập
            </span>
          </li>
        </ol>
      </div>

      {/* Shortcuts List */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">🔗 Các Shortcuts có sẵn</h2>
        <div className="space-y-4">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.id}
              className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${shortcut.color} text-2xl text-white shadow-lg`}
                  >
                    {shortcut.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {shortcut.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {shortcut.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {/* URL */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shortcut.url}
                      className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono text-gray-700"
                    />
                    <button
                      onClick={() => copyToClipboard(shortcut.url, shortcut.id)}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      {copied === shortcut.id ? '✓ Đã copy' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Siri Command Suggestion */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Gợi ý câu lệnh Siri
                  </label>
                  <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
                    <span className="text-sm text-gray-700">
                      &quot;{shortcut.siriCommand}&quot;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Tutorial: Smart Expense Tracking */}
      <div className="rounded-lg bg-gradient-to-r from-orange-50 to-red-50 p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          🎙️ Hướng dẫn: Ghi chi tiêu thông minh bằng giọng nói
        </h2>
        
        <div className="mb-4 rounded-lg bg-white p-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Ví dụ câu lệnh:</p>
          <div className="space-y-2">
            <div className="rounded bg-orange-100 px-3 py-2 text-sm">
              <strong>&quot;Hey Siri, tôi ăn trưa 50000&quot;</strong>
            </div>
            <div className="rounded bg-orange-100 px-3 py-2 text-sm">
              <strong>&quot;Hey Siri, tôi cafe 30000&quot;</strong>
            </div>
            <div className="rounded bg-orange-100 px-3 py-2 text-sm">
              <strong>&quot;Hey Siri, tôi mua sách 200000&quot;</strong>
            </div>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-700">
          <p className="mb-2">
            <strong>Cách tạo Shortcut thông minh:</strong>
          </p>
          <ol className="ml-4 space-y-2">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>Mở app <strong>Shortcuts</strong> → Nhấn <strong>+</strong> để tạo mới</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>Thêm action <strong>&quot;Ask for Input&quot;</strong> (Hỏi người dùng nhập)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>
                Đặt câu hỏi: <strong>&quot;Bạn chi tiêu gì?&quot;</strong><br />
                Input Type: <strong>Text</strong><br />
                Default Answer để trống
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>Thêm action <strong>&quot;Split Text&quot;</strong> để tách text</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">5.</span>
              <span>
                Text: chọn <strong>&quot;Provided Input&quot;</strong> (input từ bước 2)<br />
                Separator: <strong>Space</strong> (khoảng trắng)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">6.</span>
              <span>Thêm action <strong>&quot;Get Item from List&quot;</strong></span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">7.</span>
              <span>
                List: chọn <strong>&quot;Split Text&quot;</strong> (từ bước 4)<br />
                Get: <strong>Last Item</strong> (item cuối = số tiền)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">8.</span>
              <span>Thêm action <strong>&quot;Text&quot;</strong> để tạo mô tả</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">9.</span>
              <span>
                Nhập text: <strong>&quot;Provided Input&quot;</strong> (toàn bộ câu)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">10.</span>
              <span>Thêm action <strong>&quot;URL&quot;</strong></span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">11.</span>
              <span>
                URL: <code className="rounded bg-gray-100 px-2 py-1">
                  {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}
                  /dashboard/expense/quick?description=[Text từ bước 8]&amount=[Item từ bước 6]
                </code>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">12.</span>
              <span>Thêm action <strong>&quot;Open URLs&quot;</strong></span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">13.</span>
              <span>URLs: chọn <strong>&quot;URL&quot;</strong> (từ bước 10)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">14.</span>
              <span>
                Nhấn tên Shortcut ở trên → Đặt tên: <strong>&quot;Chi tiêu&quot;</strong><br />
                Thêm Siri phrase: <strong>&quot;Tôi chi tiêu&quot;</strong>
              </span>
            </li>
          </ol>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <p className="mb-2 text-sm font-semibold text-green-900">✅ Kết quả:</p>
          <ul className="space-y-1 text-sm text-green-800">
            <li>• Nói: &quot;Hey Siri, tôi chi tiêu&quot;</li>
            <li>• Siri hỏi: &quot;Bạn chi tiêu gì?&quot;</li>
            <li>• Bạn nói: &quot;ăn trưa 50000&quot;</li>
            <li>• App mở và tự động lưu chi tiêu!</li>
            <li>• Thấy màn hình xác nhận với thông tin chi tiêu</li>
          </ul>
        </div>
      </div>

      {/* Additional Tips */}
      <div className="rounded-lg bg-yellow-50 p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          💡 Mẹo sử dụng
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span>•</span>
            <span>
              <strong>Format câu nói:</strong> &quot;[mô tả] [số tiền]&quot; - Ví dụ: &quot;ăn trưa 50000&quot;, &quot;cafe 30000&quot;
            </span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>
              <strong>Số tiền:</strong> Nói số không cần dấu phẩy (50000 thay vì 50.000)
            </span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>
              Bạn có thể đặt tên bất kỳ cho Siri phrase, ví dụ: &quot;Ghi chi
              ngày nay&quot;, &quot;Chi tiêu hôm nay&quot;, v.v.
            </span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>
              Shortcuts có thể được kích hoạt từ Siri, Home Screen, hoặc Widgets
            </span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>
              Để sử dụng được, bạn cần cài app này vào Home Screen (Add to Home
              Screen)
            </span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>
              Nếu bạn đã đăng nhập, shortcuts sẽ mở trực tiếp các chức năng
              tương ứng
            </span>
          </li>
        </ul>
      </div>

      {/* Quick Action Button */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          🚀 Truy cập nhanh
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Link
            href="/dashboard/expense"
            className="flex items-center gap-3 rounded-lg border-2 border-gray-200 p-4 transition-colors hover:border-blue-600 hover:bg-blue-50"
          >
            <span className="text-2xl">💸</span>
            <span className="font-medium">Ghi chi tiêu</span>
          </Link>
          <Link
            href="/dashboard/income"
            className="flex items-center gap-3 rounded-lg border-2 border-gray-200 p-4 transition-colors hover:border-green-600 hover:bg-green-50"
          >
            <span className="text-2xl">💰</span>
            <span className="font-medium">Ghi thu nhập</span>
          </Link>
          <Link
            href="/dashboard/statistics"
            className="flex items-center gap-3 rounded-lg border-2 border-gray-200 p-4 transition-colors hover:border-indigo-600 hover:bg-indigo-50"
          >
            <span className="text-2xl">📊</span>
            <span className="font-medium">Xem thống kê</span>
          </Link>
          <Link
            href="/dashboard/jars"
            className="flex items-center gap-3 rounded-lg border-2 border-gray-200 p-4 transition-colors hover:border-purple-600 hover:bg-purple-50"
          >
            <span className="text-2xl">🏺</span>
            <span className="font-medium">Quản lý 6 hũ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
