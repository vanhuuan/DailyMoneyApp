'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if installed via appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Cài đặt App</h1>
        <p className="mt-2 text-gray-600">
          Cài đặt DailyMoney vào thiết bị để truy cập nhanh hơn
        </p>
      </div>

      {/* Install Status */}
      {isInstalled ? (
        <div className="rounded-lg bg-green-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
              ✓
            </div>
            <div>
              <h2 className="text-lg font-semibold text-green-900">
                App đã được cài đặt!
              </h2>
              <p className="text-sm text-green-700">
                Bạn có thể mở app từ Home Screen
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-blue-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-2xl">
              📱
            </div>
            <div>
              <h2 className="text-lg font-semibold text-blue-900">
                Chưa cài đặt
              </h2>
              <p className="text-sm text-blue-700">
                Cài đặt app để trải nghiệm tốt hơn
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Install Button - Show if installable */}
      {isInstallable && !isInstalled && (
        <button
          onClick={handleInstallClick}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-lg font-semibold text-white shadow-lg hover:opacity-90"
        >
          📥 Cài đặt DailyMoney
        </button>
      )}

      {/* Instructions for iOS */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          📱 Hướng dẫn cài đặt trên iOS (iPhone/iPad)
        </h2>
        <ol className="space-y-3 text-gray-700">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              1
            </span>
            <span>
              Mở website này bằng <strong>Safari</strong>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              2
            </span>
            <span>
              Nhấn vào nút <strong>Share</strong> (biểu tượng chia sẻ) ở thanh
              công cụ
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              3
            </span>
            <span>
              Cuộn xuống và chọn <strong>&quot;Add to Home Screen&quot;</strong> (Thêm vào
              Màn hình chính)
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              4
            </span>
            <span>
              Nhấn <strong>&quot;Add&quot;</strong> để hoàn tất
            </span>
          </li>
        </ol>
      </div>

      {/* Instructions for Android */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          📱 Hướng dẫn cài đặt trên Android
        </h2>
        <ol className="space-y-3 text-gray-700">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
              1
            </span>
            <span>
              Mở website này bằng <strong>Chrome</strong>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
              2
            </span>
            <span>
              Nhấn vào <strong>Menu</strong> (3 chấm) ở góc trên bên phải
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
              3
            </span>
            <span>
              Chọn <strong>&quot;Add to Home screen&quot;</strong> hoặc <strong>&quot;Install
              app&quot;</strong>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
              4
            </span>
            <span>
              Xác nhận để cài đặt app
            </span>
          </li>
        </ol>
      </div>

      {/* Benefits */}
      <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          ✨ Lợi ích khi cài đặt
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex gap-2">
            <span className="text-green-600">✓</span>
            <span>Truy cập nhanh từ Home Screen như app native</span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600">✓</span>
            <span>Hoạt động offline (đọc dữ liệu đã lưu)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600">✓</span>
            <span>Sử dụng Siri Shortcuts để mở nhanh các chức năng</span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600">✓</span>
            <span>Giao diện toàn màn hình, không có thanh địa chỉ</span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600">✓</span>
            <span>Nhận thông báo (tính năng sắp ra mắt)</span>
          </li>
        </ul>
      </div>

      {/* Next Steps */}
      {isInstalled && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">🚀 Bước tiếp theo</h2>
          <p className="mb-4 text-gray-700">
            Bây giờ bạn có thể thiết lập Siri Shortcuts để sử dụng app nhanh
            hơn bằng giọng nói!
          </p>
          <Link
            href="/dashboard/shortcuts"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white hover:opacity-90"
          >
            Thiết lập Siri Shortcuts →
          </Link>
        </div>
      )}
    </div>
  );
}
