'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isInstalled) {
      setShowPrompt(false);
      return;
    }

    // Check if user dismissed the prompt before
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed) {
      setShowPrompt(false);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS or browsers that don't support beforeinstallprompt
    // Show prompt after a delay
    const timer = setTimeout(() => {
      if (!window.matchMedia('(display-mode: standalone)').matches && !dismissed) {
        setShowPrompt(true);
      }
    }, 5000); // Show after 5 seconds

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // For iOS or browsers without install prompt API
      window.location.href = '/dashboard/install';
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up md:left-auto md:right-4 md:w-96">
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white shadow-2xl">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-2xl">
              📱
            </div>
            <div>
              <h3 className="font-semibold">Cài đặt DailyMoney</h3>
              <p className="text-sm text-blue-100">
                Truy cập nhanh hơn từ Home Screen
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white hover:text-blue-100"
            aria-label="Đóng"
          >
            <svg
              className="h-5 w-5"
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
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            Cài đặt
          </button>
          <Link
            href="/dashboard/install"
            className="flex-1 rounded-md border border-white px-4 py-2 text-center text-sm font-semibold text-white hover:bg-white hover:bg-opacity-10"
            onClick={handleDismiss}
          >
            Xem hướng dẫn
          </Link>
        </div>
      </div>
    </div>
  );
}
