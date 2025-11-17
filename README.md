# JestFly - Music & NFT Platform

A comprehensive music and NFT marketplace platform featuring e-commerce, community features, and immersive 3D experiences.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Version](https://img.shields.io/badge/version-0.0.0-orange)]()

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/MartynLegrand/jestfly-MAIN.git
cd jestfly-MAIN

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
# Open http://localhost:5173
```

**Full setup guide:** [docs/ENVIRONMENT_SETUP.md](./docs/ENVIRONMENT_SETUP.md)

---

## ✨ Features

### 🎨 Marketing & Landing
- Dynamic 3D crystal hero with Three.js
- Customizable card system
- Glassmorphism design theme
- Mobile-responsive layout

### 🛍️ E-commerce Store
- Product catalog with filtering
- Shopping cart with persistence
- Product management (admin)
- Category system
- **Coming soon:** Checkout & payments

### 💎 NFT Marketplace
- Digital, physical, and hybrid NFTs
- Rarity system (common → legendary)
- Jest Coin virtual currency
- Wallet management
- Rewards missions system
- Admin NFT generator interface

### 👥 Community
- Social feed with infinite scroll
- Post creation (text + media)
- Nested comments and replies
- Like and follow system
- Real-time notifications
- Content moderation framework

### ⚙️ Admin Dashboard
- 19 configuration tabs
- NFT Generator
- Product management
- Site-wide settings
- Role-based access control
- Keyboard shortcuts (Ctrl/Cmd + K)

### 🎮 3D Performance Layer
- Adaptive Level of Detail (LOD)
- Device capability detection
- FPS monitoring and optimization
- Mobile performance tuning
- WebGL fallbacks

### 📄 Content Pages
- Bookings system
- Resources library
- Press kit
- Live streaming
- Demo submissions
- Airdrop campaigns

---

## 📊 Project Status

**Overall Completion:** 70%  
**Build Status:** ✅ SUCCESS (8.86s, 2.08 MB bundle)  
**Database:** ✅ 24+ tables, 7 migrations applied

| Module | Status | Progress |
|--------|--------|----------|
| Marketing & Landing | ✅ Complete | 95% |
| Admin Dashboard | ✅ Complete | 85% |
| 3D Performance | ✅ Complete | 95% |
| Community | ✅ Functional | 90% |
| NFT Marketplace | ⚠️ Partial | 75% |
| E-commerce | ⚠️ Partial | 70% |

**See full status:** [docs/PROJECT_STATUS.md](./docs/PROJECT_STATUS.md)

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI)
- **3D Graphics:** Three.js
- **Routing:** React Router
- **State:** React Query
- **Forms:** React Hook Form + Zod
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Analytics:** PostHog, Google Analytics (planned)

---

## 📚 Documentation

### Getting Started
- [Environment Setup](./docs/ENVIRONMENT_SETUP.md) - Complete setup guide
- [Migration Runbook](./docs/MIGRATION_RUNBOOK.md) - Database migrations
- [Seed Data Guide](./docs/SEED_DATA_GUIDE.md) - Sample data

### User Guides
- [Admin Guide](./docs/ADMIN_GUIDE.md) - Admin dashboard usage
- [Quick Start Guide](./QUICK_START_GUIDE.md) - Performance features
- [NFT System Guide](./NFT_SYSTEM_GUIDE.md) - NFT marketplace

### Developer Docs
- [Finalization Plan](./docs/FINALIZATION_PLAN.md) - Project roadmap
- [Checkout Requirements](./docs/CHECKOUT_REQUIREMENTS.md) - E-commerce implementation
- [Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md) - Production deployment

### Session Summaries
- [Session 1 Complete](./SESSION_1_COMPLETE.md) - Marketing & landing
- [Session 2 Complete](./SESSION_2_COMPLETE.md) - Store implementation
- [Session 3 Complete](./SESSION_3_COMPLETE.md) - Community system

---

## 🗄️ Database Schema

**Tables:** 24+ including:
- User profiles and authentication
- Product catalog (store + NFT)
- Shopping cart and orders
- Community posts and interactions
- Wallet and transactions
- Notifications and moderation

**Storage Buckets:**
- product-images
- community-media
- nft-assets
- user-avatars
- models (3D files)

**Full migration guide:** [docs/MIGRATION_RUNBOOK.md](./docs/MIGRATION_RUNBOOK.md)

---

## 🚀 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Environment Variables

Required in `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See [.env.example](./.env.example) for all available variables.

---

## 🏗️ Project Structure

```
jestfly-MAIN/
├── docs/              # Comprehensive documentation
├── public/            # Static assets
├── src/
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript types
│   ├── lib/           # Utilities
│   └── integrations/  # Supabase client
├── supabase/
│   └── migrations/    # Database migrations
└── ...
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Roadmap

### Immediate (Week 1)
- [ ] Checkout flow implementation
- [ ] Payment integration (Stripe)
- [ ] Order management dashboard
- [ ] NFT checkout integration

### Short-term (Weeks 2-4)
- [ ] E2E testing suite
- [ ] CI/CD pipeline
- [ ] Real-time community features
- [ ] Email notifications

### Long-term (Months 2-6)
- [ ] Web3 wallet integration
- [ ] Actual NFT minting
- [ ] Live streaming platform
- [ ] Mobile app (React Native)

**Full roadmap:** [docs/FINALIZATION_PLAN.md](./docs/FINALIZATION_PLAN.md)

---

## 🐛 Known Issues

- Checkout flow not yet implemented (critical)
- Order management needs admin UI
- NFT purchases not integrated with checkout
- Real-time features need Supabase subscription setup
- Limited E2E test coverage

See [GitHub Issues](https://github.com/MartynLegrand/jestfly-MAIN/issues) for full list.

---

## 📄 License

This project is private and proprietary.

---

## 🔗 Links

- **Repository:** [GitHub](https://github.com/MartynLegrand/jestfly-MAIN)
- **Lovable Project:** [Lovable](https://lovable.dev/projects/1a1ce7c3-2429-4cb8-959d-83cf44ac0ad9)
- **Documentation:** [/docs](./docs/)

---

## 📧 Support

- **Issues:** [GitHub Issues](https://github.com/MartynLegrand/jestfly-MAIN/issues)
- **Discussions:** [GitHub Discussions](https://github.com/MartynLegrand/jestfly-MAIN/discussions)
- **Documentation:** Check `/docs` folder first

---

**Built with ❤️ using React, TypeScript, Supabase, and Three.js**
