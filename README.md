# 🎵 JestFly Platform

Welcome to JestFly - A comprehensive platform featuring marketing, e-commerce, NFT marketplace, and community features.

## 🚀 Project Overview

**Project URL**: https://lovable.dev/projects/1a1ce7c3-2429-4cb8-959d-83cf44ac0ad9

JestFly is a full-stack web application built with modern technologies, offering:
- 🏠 Dynamic marketing and landing pages
- 🛒 E-commerce storefront with shopping cart
- 🎨 NFT marketplace with wallet integration
- 👥 Community system with social features
- ⚙️ Comprehensive admin dashboard
- 🎮 Optimized 3D graphics with Three.js

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Technologies](#technologies)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Documentation](#documentation)
- [Support](#support)

## 🏁 Quick Start

### Prerequisites

- Node.js 18.x or higher ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or yarn package manager
- Supabase account and project

### Installation

```sh
# Clone the repository
git clone https://github.com/MartynLegrand/jestfly-MAIN.git

# Navigate to project directory
cd jestfly-MAIN

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials
# (Get these from https://app.supabase.com/project/_/settings/api)
```

### Development Server

```sh
# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## 🛠️ Technologies

This project is built with:

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + shadcn-ui components
- **3D Graphics**: Three.js
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Animation**: Framer Motion

## 💻 Development

### Available Scripts

```sh
npm run dev         # Start development server
npm run build       # Build for production
npm run build:dev   # Build for development/staging
npm run lint        # Run ESLint
npm run preview     # Preview production build
```

### Project Structure

```
jestfly-MAIN/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # Business logic & API calls
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # Third-party integrations
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── public/             # Static assets
├── supabase/           # Database migrations
└── .github/            # CI/CD workflows
```

### Environment Variables

See `.env.example` for all available environment variables. Required variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_ENVIRONMENT`: Environment (development/staging/production)
- `VITE_ENABLE_ANALYTICS`: Enable analytics tracking (true/false)

## 🚀 Production Deployment

### Automated Deployment (Recommended)

The project includes GitHub Actions workflows for automated deployment:

1. **Staging Deployment**: Automatically deploys when pushing to `develop` branch
2. **Production Deployment**: Automatically deploys when pushing to `main` branch

### Manual Deployment

```sh
# Build for production
npm run build

# Deploy the dist/ folder to your hosting provider
# (Netlify, Vercel, etc.)
```

### Pre-Deployment Checklist

Before deploying to production, ensure:

- ✅ All environment variables are configured
- ✅ Supabase migrations are applied
- ✅ Tests are passing (`npm test`)
- ✅ Build is successful (`npm run build`)
- ✅ No security vulnerabilities (`npm audit`)

**📋 See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for the complete checklist**

### Deployment Guides

- **Netlify**: `npm run build` → Deploy `dist/` folder
- **Vercel**: Connect GitHub repo → Auto-deploy on push
- **Lovable**: Click Share → Publish in [Lovable Project](https://lovable.dev/projects/1a1ce7c3-2429-4cb8-959d-83cf44ac0ad9)

### Custom Domain

For custom domains with Lovable deployments, see [Lovable Custom Domain Guide](https://docs.lovable.dev/tips-tricks/custom-domain/)

## 📚 Documentation

Comprehensive documentation is available:

- **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - Features overview and keyboard shortcuts
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Production deployment guide
- **[RELEASE_NOTES.md](./RELEASE_NOTES.md)** - Version history and changes
- **[MONITORING_OBSERVABILITY_GUIDE.md](./MONITORING_OBSERVABILITY_GUIDE.md)** - Analytics and monitoring
- **[NFT_SYSTEM_GUIDE.md](./NFT_SYSTEM_GUIDE.md)** - NFT marketplace documentation
- **[COMO_USAR_NFT_GENERATOR.md](./COMO_USAR_NFT_GENERATOR.md)** - NFT generator guide (PT-BR)

### Session Documentation

- [SESSION_1_COMPLETE.md](./SESSION_1_COMPLETE.md) - Marketing & Landing
- [SESSION_2_COMPLETE.md](./SESSION_2_COMPLETE.md) - E-commerce Storefront
- [SESSION_3_COMPLETE.md](./SESSION_3_COMPLETE.md) - Community System

### Technical Guides

- [NAVIGATION_AUDIT.md](./NAVIGATION_AUDIT.md) - Navigation improvements
- [FIXES_SUMMARY.md](./FIXES_SUMMARY.md) - Bug fixes and improvements
- [OPTIMIZATION_IMPLEMENTATION_SUMMARY.md](./OPTIMIZATION_IMPLEMENTATION_SUMMARY.md) - Performance optimizations
- [THREE_JS_VS_BABYLON_ANALYSIS.md](./THREE_JS_VS_BABYLON_ANALYSIS.md) - 3D library analysis

## 🔧 Configuration

### Supabase Setup

1. Create a Supabase project at https://app.supabase.com
2. Run migrations: `supabase db push` (or via Supabase Dashboard)
3. Configure storage buckets for uploads
4. Set up Row Level Security (RLS) policies
5. Copy connection details to `.env`

### Analytics Setup

Enable analytics in production:

```env
VITE_ENABLE_ANALYTICS=true
VITE_ENVIRONMENT=production
```

Optionally configure third-party analytics:
- Google Analytics 4
- Sentry (error tracking)
- PostHog (product analytics)

See [MONITORING_OBSERVABILITY_GUIDE.md](./MONITORING_OBSERVABILITY_GUIDE.md) for details.

## 🧪 Testing

```sh
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run linter
npm run lint
```

## 📊 Monitoring & Observability

The platform includes built-in monitoring:

- **Analytics**: User behavior and conversion tracking
- **Error Monitoring**: Automatic error capture and reporting
- **Health Checks**: System health endpoints
- **Performance Tracking**: FPS and load time monitoring

See [MONITORING_OBSERVABILITY_GUIDE.md](./MONITORING_OBSERVABILITY_GUIDE.md) for setup and usage.

## 🤝 Contributing

### Code Editing Options

**Via Lovable (Recommended for quick changes)**
- Visit the [Lovable Project](https://lovable.dev/projects/1a1ce7c3-2429-4cb8-959d-83cf44ac0ad9)
- Use natural language prompts to make changes
- Changes are automatically committed

**Via Local IDE**
- Clone the repository
- Make changes locally
- Push changes (reflected in Lovable)

**Via GitHub**
- Edit files directly on GitHub
- Commit changes via web interface

**Via GitHub Codespaces**
- Open repository in GitHub
- Click "Code" → "Codespaces" → "New codespace"
- Edit in cloud-based VS Code

## 📞 Support

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/MartynLegrand/jestfly-MAIN/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MartynLegrand/jestfly-MAIN/discussions)
- **Documentation**: See `/docs` and markdown files in root

### Status & Health

- **Build Status**: See GitHub Actions
- **Production**: [Status Page] (configure your own)
- **Monitoring**: [Analytics Dashboard] (configure your own)

## 📄 License

[Add your license here]

## 🎯 Roadmap

See [RELEASE_NOTES.md](./RELEASE_NOTES.md) for planned features and upcoming releases.

---

**Built with ❤️ using [Lovable](https://lovable.dev)**
