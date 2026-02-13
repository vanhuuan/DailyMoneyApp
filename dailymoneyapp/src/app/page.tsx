import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
            Quản lý tài chính thông minh với{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Ghi chi tiêu trong 5 giây bằng giọng nói. AI tự động phân loại theo
            phương pháp 6 Hũ.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-8 text-sm font-medium text-white transition-colors hover:opacity-90 sm:w-auto"
            >
              Đăng nhập
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 sm:w-auto"
            >
              Đăng ký miễn phí
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-20 grid max-w-6xl gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-4 text-4xl">🤖</div>
            <h3 className="mb-2 text-xl font-semibold">AI Voice Chat</h3>
            <p className="text-gray-600">
              Chỉ cần nói &quot;Ăn trưa 65k&quot;, AI tự động phân loại và lưu chi tiêu
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-4 text-4xl">🏺</div>
            <h3 className="mb-2 text-xl font-semibold">6 Jars Method</h3>
            <p className="text-gray-600">
              Tự động phân bổ thu nhập theo phương pháp 6 Hũ đã được chứng
              minh
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-4 text-4xl">📊</div>
            <h3 className="mb-2 text-xl font-semibold">Thống kê chi tiết</h3>
            <p className="text-gray-600">
              Theo dõi chi tiêu theo từng hũ, xem báo cáo và insights
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-20 max-w-3xl rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white shadow-2xl">
          <h2 className="mb-4 text-3xl font-bold">
            Bắt đầu quản lý tài chính ngay hôm nay
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Miễn phí vĩnh viễn. Không cần thẻ tín dụng.
          </p>
          <Link
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-blue-600 transition-colors hover:bg-gray-100"
          >
            Đăng ký miễn phí →
          </Link>
        </div>
      </div>
    </div>
  );
}
