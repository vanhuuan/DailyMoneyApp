# 🤝 Contributing to DailyMoneyApp

First off, thank you for considering contributing to DailyMoneyApp! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Issue Guidelines](#issue-guidelines)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [your-email@example.com].

### Our Standards

- ✅ Be respectful and inclusive
- ✅ Welcome newcomers
- ✅ Accept constructive criticism
- ✅ Focus on what is best for the community
- ❌ No harassment or trolling
- ❌ No spam or self-promotion

---

## 🚀 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** and description
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, browser, version)

**Example:**
```markdown
**Title:** Cannot save expense on iOS Safari

**Description:** When trying to save an expense using the form, 
the submit button doesn't respond.

**Steps to Reproduce:**
1. Open app in Safari on iOS
2. Go to "Add Expense"
3. Fill in the form
4. Click "Save"
5. Nothing happens

**Expected:** Expense should be saved
**Actual:** Button doesn't respond

**Environment:**
- iOS: 17.2
- Safari: Latest
- Device: iPhone 14 Pro
```

### 💡 Suggesting Features

Feature requests are welcome! Please include:

- **Clear use case** - Why is this feature needed?
- **Detailed description** - What should it do?
- **Mockups** if applicable
- **Alternatives** you've considered

### 🔧 Contributing Code

We love pull requests! Here's how:

1. **Fork** the repository
2. **Clone** your fork
3. **Create** a branch for your feature
4. **Make** your changes
5. **Test** your changes
6. **Commit** with clear messages
7. **Push** to your fork
8. **Open** a Pull Request

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account
- Google Gemini API key

### Setup Steps

1. **Clone your fork:**
```bash
git clone https://github.com/YOUR_USERNAME/QuanLyChiTieu.git
cd QuanLyChiTieu/dailymoneyapp
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment:**
```bash
cp .env.example .env.local
# Edit .env.local with your Firebase & Gemini credentials
```

4. **Run development server:**
```bash
npm run dev
```

5. **Visit http://localhost:3000**

### Project Structure

```
dailymoneyapp/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities & services
│   └── types/           # TypeScript types
├── public/              # Static assets
└── ...
```

---

## 📝 Pull Request Process

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tested on multiple browsers/devices

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test the changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] Tested thoroughly
```

### Review Process

1. Maintainers will review your PR
2. Feedback may be provided
3. Make requested changes
4. PR will be merged once approved
5. You'll be added to contributors! 🎉

---

## 💻 Coding Guidelines

### TypeScript

- ✅ Use TypeScript for all new code
- ✅ Define proper types and interfaces
- ✅ Avoid `any` type when possible
- ✅ Use strict mode

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  email: string;
  name: string;
}

// ❌ Bad
const user: any = {...};
```

### React Components

- ✅ Use functional components with hooks
- ✅ Keep components small and focused
- ✅ Use meaningful names
- ✅ Add comments for complex logic

```tsx
// ✅ Good
export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  // Component logic
}

// ❌ Bad
function Comp1() {
  // Component logic
}
```

### Styling

- ✅ Use TailwindCSS utility classes
- ✅ Follow existing color scheme
- ✅ Ensure responsive design
- ✅ Test on mobile devices

```tsx
// ✅ Good
<div className="rounded-lg bg-white p-6 shadow-sm">

// ❌ Bad
<div style={{ borderRadius: '8px', background: 'white' }}>
```

### File Naming

- ✅ `PascalCase` for components: `UserProfile.tsx`
- ✅ `camelCase` for utilities: `formatCurrency.ts`
- ✅ `kebab-case` for pages: `add-expense.tsx`

---

## 📋 Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Updating build tasks, package manager configs, etc.

### Examples

```bash
# Good
feat(auth): add Google Sign-in support
fix(expense): resolve form validation error
docs(readme): update installation instructions
style(dashboard): improve button spacing

# Bad
update
fixed bug
changes
```

---

## 🐛 Issue Guidelines

### Issue Template

```markdown
### Description
Clear description of the issue

### Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

### Expected Behavior
What you expected to happen

### Actual Behavior
What actually happened

### Environment
- OS: [e.g., iOS 17]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 2.0.0]

### Screenshots
If applicable, add screenshots

### Additional Context
Any other relevant information
```

---

## 🧪 Testing

### Manual Testing

Test your changes on:
- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Firefox (desktop)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### What to Test

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive on all screen sizes
- [ ] Works with keyboard navigation
- [ ] Accessible (ARIA labels, etc.)

---

## 🎨 Design Guidelines

### Colors

Follow the existing color scheme:
- Primary: Blue-Purple gradient (#667eea → #764ba2)
- Success: Green (#22C55E)
- Error: Red (#EF4444)
- Warning: Amber (#F59E0B)

### Typography

- Headings: Bold, clear hierarchy
- Body: 14-16px, readable line-height
- Code: Monospace font

### Spacing

- Use consistent spacing (4, 8, 16, 24, 32px)
- Follow Tailwind spacing scale
- Maintain visual hierarchy

---

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Firebase Emulator](https://firebase.google.com/docs/emulator-suite)
- [Postman](https://www.postman.com/) for API testing

---

## 💬 Communication

### Discussions

For general questions and discussions, use [GitHub Discussions](https://github.com/yourusername/QuanLyChiTieu/discussions).

### Discord/Slack

Join our community: [Coming soon]

### Email

For sensitive issues: [your-email@example.com]

---

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Added to GitHub contributors
- Mentioned in release notes
- Given credit in documentation

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You!

Every contribution, no matter how small, is valuable. Thank you for helping make DailyMoneyApp better! 💙

---

**Questions?** Don't hesitate to ask! Open an issue or reach out to the maintainers.

**Happy Contributing!** 🎉
