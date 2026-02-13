import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Vietnamese Dong
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Parse Vietnamese currency input
 * Examples: "50k" -> 50000, "2 triệu" -> 2000000
 */
export function parseCurrency(input: string): number {
  const cleaned = input.toLowerCase().trim();

  // Remove currency symbols
  const withoutSymbol = cleaned.replace(/[₫đ,]/g, '');

  // Handle "k" (thousand) and "tr/triệu" (million)
  if (withoutSymbol.includes('k')) {
    const number = parseFloat(withoutSymbol.replace('k', ''));
    return number * 1000;
  }

  if (withoutSymbol.includes('tr') || withoutSymbol.includes('triệu')) {
    const number = parseFloat(
      withoutSymbol.replace(/tr|triệu/g, '').trim()
    );
    return number * 1000000;
  }

  // Handle "nghìn" (thousand)
  if (withoutSymbol.includes('nghìn')) {
    const number = parseFloat(withoutSymbol.replace('nghìn', '').trim());
    return number * 1000;
  }

  // Regular number
  return parseFloat(withoutSymbol) || 0;
}

/**
 * Format date
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Format relative time (e.g., "2 giờ trước")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  return formatDate(d);
}
