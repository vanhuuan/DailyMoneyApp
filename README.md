# 💰 DailyMoneyApp - Quản lý tài chính thông minh

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.7-orange)

**Ứng dụng quản lý tài chính cá nhân với AI, Siri Shortcuts và phương pháp 6 Hũ**

[Demo](#) • [Tài liệu](#-tài-liệu) • [Báo lỗi](https://github.com/yourusername/QuanLyChiTieu/issues) • [Đóng góp](#-đóng-góp)

</div>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Demo](#-demo)
- [Công nghệ](#-công-nghệ)
- [Cài đặt](#-cài-đặt)
- [Sử dụng](#-sử-dụng)
- [Tài liệu](#-tài-liệu)
- [Roadmap](#-roadmap)
- [Đóng góp](#-đóng-góp)
- [License](#-license)

---

## 🎯 Giới thiệu

**DailyMoneyApp** là ứng dụng quản lý tài chính cá nhân hiện đại, giúp bạn theo dõi thu chi một cách thông minh và dễ dàng. Ứng dụng sử dụng **phương pháp 6 Hũ** (6 Jars Method) của T. Harv Eker kết hợp với công nghệ AI và voice control để mang đến trải nghiệm quản lý tài chính tốt nhất.

### Tại sao chọn DailyMoneyApp?

- 🎙️ **Ghi chi tiêu bằng giọng nói** - Nhanh hơn 5-6 lần so với cách truyền thống
- 🤖 **AI thông minh** - Tự động phân loại chi tiêu bằng Google Gemini
- 🏺 **Phương pháp 6 Hũ** - Framework tài chính đã được chứng minh
- 📊 **Thống kê linh hoạt** - Xem chi tiêu theo tháng/năm/cả đời
- 📱 **PWA** - Cài đặt như app native, hoạt động offline
- 🔐 **Bảo mật** - Firebase Authentication với persistent sessions

---

## ✨ Tính năng

### 🏺 Phương pháp 6 Hũ

Tự động phân bổ thu nhập vào 6 hũ theo tỷ lệ khoa học:

- **NEC (55%)** - Chi tiêu thiết yếu (Necessities)
- **FFA (10%)** - Tự do tài chính (Financial Freedom Account)
- **LTSS (10%)** - Tiết kiệm dài hạn (Long Term Savings)
- **EDU (10%)** - Giáo dục & Phát triển bản thân
- **PLAY (10%)** - Vui chơi & Giải trí
- **GIVE (5%)** - Từ thiện & Cho đi

### 🎙️ Smart Siri Shortcuts (⭐ Tính năng nổi bật)

Ghi chi tiêu chỉ với giọng nói, không cần mở app:

```
Bạn: "Hey Siri, tôi ăn trưa 50000"
→ App tự động lưu chi tiêu
→ Hiển thị xác nhận trong 5-8 giây!
```

**Nhanh hơn 5-6 lần** so với cách truyền thống!

### 🤖 AI Chat Assistant

- Chat tự nhiên để ghi chi tiêu: "Tôi mua cafe 30k"
- AI tự động phân loại category và jar
- Hỗ trợ nhập bằng giọng nói (Speech Recognition)
- Lịch sử chat được lưu trữ

### 📊 Thống kê nâng cao

- **Bộ lọc linh hoạt**: Xem chi tiêu của bất kỳ tháng/năm nào
- **3 chế độ xem**: Theo tháng, theo năm, cả đời
- **Visualizations**: Charts, progress bars, breakdowns
- **So sánh**: Dễ dàng compare giữa các thời kỳ
- **Insights**: Thu nhập, chi tiêu, tích góp

### 📱 Progressive Web App (PWA)

- Cài đặt vào Home Screen
- Hoạt động offline với Service Worker
- Giao diện native app
- Fast loading & caching
- Push notifications (coming soon)

### 🔐 Authentication & Security

- Email/Password authentication
- Google Sign-in
- Persistent sessions (localStorage)
- Auto sign-in sau khi đóng app
- Secure Firebase backend

---

## 🎬 Demo

### Ghi chi tiêu bằng Siri

```
┌─────────────────────────────────────┐
│  "Hey Siri, tôi chi tiêu"           │
│  → Siri: "Bạn chi tiêu gì?"         │
│  → Bạn: "ăn trưa 50000"             │
│  → ✅ Đã lưu trong 5 giây!          │
└─────────────────────────────────────┘
```

### AI Chat

```
Bạn: "Tôi mua cafe 30k với bạn"
AI: "Đã phân loại:
     💰 Số tiền: 30.000₫
     📁 Category: Giải trí
     🏺 Jar: PLAY
     Xác nhận lưu?"
```

### Dashboard

- Tổng quan tài chính real-time
- 6 hũ với progress bars
- Giao dịch gần đây
- Quick actions

---

## 🛠️ Công nghệ

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Radix UI
- **State Management**: React Hooks + Context
- **Icons**: Lucide React

### Backend & Services
- **Auth**: Firebase Authentication
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **AI**: Google Gemini AI
- **Speech**: Web Speech API

### PWA & Voice
- **Service Worker**: Workbox
- **Manifest**: Web App Manifest
- **Voice Control**: Siri Shortcuts Integration
- **Speech Recognition**: Browser API

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Version Control**: Git

---

## 📦 Cài đặt

### Prerequisites

- Node.js 18+ và npm
- Firebase project
- Google Gemini API key

### Clone repository

```bash
git clone https://github.com/yourusername/QuanLyChiTieu.git
cd QuanLyChiTieu/dailymoneyapp
```

### Install dependencies

```bash
npm install
```

### Environment variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

### Run development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

### Build for production

```bash
npm run build
npm run start
```

---

## 🚀 Sử dụng

### 1. Đăng ký tài khoản

- Sử dụng Email/Password hoặc Google Sign-in
- Tự động tạo 6 hũ khi đăng ký

### 2. Thêm thu nhập

```
Dashboard → "Thêm thu nhập" → Nhập số tiền
→ Tự động phân bổ vào 6 hũ theo tỷ lệ
```

### 3. Ghi chi tiêu (3 cách)

#### Cách 1: Thủ công (truyền thống)
```
Dashboard → "Thêm chi tiêu" → Fill form → Save
Thời gian: ~30-45 giây
```

#### Cách 2: AI Chat
```
Dashboard → "AI Chat" → Nói/Gõ "tôi ăn trưa 50k"
→ AI phân loại → Confirm → Save
Thời gian: ~15-20 giây
```

#### Cách 3: Siri Shortcuts (⭐ Nhanh nhất)
```
"Hey Siri, tôi chi tiêu"
→ Siri: "Bạn chi tiêu gì?"
→ Bạn: "ăn trưa 50000"
→ Auto-save!
Thời gian: ~5-8 giây (Nhanh hơn 5-6 lần!)
```

### 4. Xem thống kê

```
Dashboard → "Thống Kê"
→ Chọn chế độ: Theo tháng / Theo năm / Cả đời
→ Chọn tháng/năm cụ thể
→ Xem chi tiết thu nhập, chi tiêu, tích góp
```

### 5. Cài đặt PWA

#### iOS (Safari):
1. Mở app trong Safari
2. Nhấn Share button
3. "Add to Home Screen"
4. Done!

#### Android (Chrome):
1. Mở app trong Chrome
2. Menu (3 chấm)
3. "Install app" hoặc "Add to Home screen"
4. Install!

---

## 📚 Tài liệu

### User Guides
- [📱 Siri Shortcuts Guide](./SIRI_SHORTCUTS_README.md) - Setup Siri Shortcuts cơ bản
- [🎙️ Smart Siri Shortcuts](./SMART_SIRI_SHORTCUTS.md) - Ghi chi tiêu bằng giọng nói
- [⚡ Quick Guide](./SIRI_SHORTCUT_QUICK_GUIDE.md) - Hướng dẫn nhanh (print-friendly)
- [📊 Statistics Guide](./FILTERABLE_STATISTICS.md) - Sử dụng bộ lọc thống kê

### Technical Docs
- [🔐 Auth Persistence](./AUTH_PERSISTENCE_FIX.md) - Fix authentication issues
- [📋 Project Summary](./PROJECT_SUMMARY.md) - Tổng quan project

### In-App Documentation
- Dashboard → Siri Shortcuts - Hướng dẫn chi tiết từng bước
- Dashboard → Install - Hướng dẫn cài đặt PWA

---

## 🗺️ Roadmap

### ✅ Version 2.0 (Current)
- [x] Core features (6 Jars, transactions, statistics)
- [x] AI Chat với Gemini
- [x] Smart Siri Shortcuts với voice parsing
- [x] Filterable statistics (month/year/lifetime)
- [x] PWA với offline support
- [x] Auth persistence

### 🚧 Version 2.1 (In Progress)
- [ ] Push notifications
- [ ] Budget tracking & alerts
- [ ] Receipt OCR
- [ ] Export to CSV/PDF
- [ ] Custom categories

### 📅 Version 3.0 (Planned)
- [ ] Multi-user & family accounts
- [ ] Split expenses
- [ ] Bank account sync
- [ ] Investment tracking
- [ ] AI insights & predictions

### 🔮 Future
- [ ] Apple Watch app
- [ ] Widgets (iOS/Android)
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Premium features

---

## 🤝 Đóng góp

Contributions are welcome! 🎉

### How to contribute:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Guidelines:

- Follow existing code style
- Write clear commit messages
- Add tests if applicable
- Update documentation
- Be respectful and constructive

### Reporting Bugs

Found a bug? [Open an issue](https://github.com/yourusername/QuanLyChiTieu/issues) with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- **T. Harv Eker** - 6 Jars Method inspiration
- **Google Gemini** - AI capabilities
- **Firebase** - Backend infrastructure
- **Next.js Team** - Amazing framework
- **Vercel** - Hosting platform
- **Community** - For feedback and support

---

## 📊 Statistics

- **Performance**: 5-6x faster expense tracking với Siri
- **Code Quality**: TypeScript với strict mode
- **Test Coverage**: Coming soon
- **Bundle Size**: Optimized với Next.js

---

## 🌟 Star History

If you like this project, please give it a ⭐!

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/QuanLyChiTieu&type=Date)](https://star-history.com/#yourusername/QuanLyChiTieu&Date)

---

## 📞 Support

Need help?
- 📖 Read the [documentation](#-tài-liệu)
- 💬 Open an [issue](https://github.com/yourusername/QuanLyChiTieu/issues)
- 📧 Email: support@example.com

---

<div align="center">

**Made with ❤️ and ☕ by [Your Name]**

⭐ Star this repo if you find it helpful!

[⬆ Back to top](#-dailymoneyapp---quản-lý-tài-chính-thông-minh)

</div>
