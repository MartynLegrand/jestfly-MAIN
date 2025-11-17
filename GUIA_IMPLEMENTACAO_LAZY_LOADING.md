# 🚀 Guia de Implementação: Lazy Loading

## Por que Lazy Loading?

**Problema Atual:** Bundle de 2MB (575KB gzipped)  
**Meta:** <1MB (<300KB gzipped)  
**Benefício:** Carregamento 50-70% mais rápido

---

## 🎯 Implementação Rápida (30 minutos)

### Passo 1: Adicionar React.lazy no App.tsx

```typescript
import { lazy, Suspense } from 'react';

// ANTES: Import direto
import AdminDashboard from './pages/AdminDashboard';
import NFTStorePage from './pages/NFTStorePage';
import CommunityPage from './pages/CommunityPage';

// DEPOIS: Lazy loading
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NFTStorePage = lazy(() => import('./pages/NFTStorePage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const NewStorePage = lazy(() => import('./pages/NewStorePage'));
const DemoSubmissionPage = lazy(() => import('./pages/DemoSubmissionPage'));
const LiveStreamPage = lazy(() => import('./pages/LiveStreamPage'));
const PressKitPage = lazy(() => import('./pages/PressKitPage'));
const AirdropPage = lazy(() => import('./pages/AirdropPage'));
```

### Passo 2: Adicionar Loading Component

```typescript
// src/components/LoadingSpinner.tsx
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

export default LoadingSpinner;
```

### Passo 3: Envolver Rotas com Suspense

```typescript
import LoadingSpinner from './components/LoadingSpinner';

// Dentro do <Routes>:
<Route path="/admin" element={
  <ProtectedRoute requiredRoles={['admin']}>
    <Suspense fallback={<LoadingSpinner />}>
      <AdminDashboard />
    </Suspense>
  </ProtectedRoute>
} />

<Route path="/nft-store" element={
  <Suspense fallback={<LoadingSpinner />}>
    <NFTStorePage />
  </Suspense>
} />
```

### Passo 4: Lazy Loading do Three.js

```typescript
// src/components/home/FrontCrystal.tsx
import { lazy, Suspense } from 'react';

const CrystalScene = lazy(() => import('./CrystalScene'));

const FrontCrystal = () => (
  <Suspense fallback={<div className="h-full w-full" />}>
    <CrystalScene />
  </Suspense>
);
```

---

## 📊 Impacto Esperado

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Bundle inicial | 2MB | ~600KB | 70% menor |
| Time to Interactive | 4-5s | 1.5-2s | 60% mais rápido |
| First Contentful Paint | 2-3s | 0.8-1.2s | 60% mais rápido |

---

## 🔧 Implementação Completa

### 1. Criar Loading Component Melhorado

```typescript
// src/components/PageLoader.tsx
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
    <div className="relative">
      {/* Spinner exterior */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      
      {/* Spinner interior */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500 animate-reverse"></div>
      </div>
    </div>
    
    <p className="mt-4 text-white/60 animate-pulse">Carregando...</p>
  </div>
);

export default PageLoader;
```

### 2. Atualizar App.tsx Completo

```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageLoader from './components/PageLoader';

// Páginas que carregam sempre (críticas)
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Lazy loading de páginas secundárias
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NFTStorePage = lazy(() => import('./pages/NFTStorePage'));
const NewStorePage = lazy(() => import('./pages/NewStorePage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const DemoSubmissionPage = lazy(() => import('./pages/DemoSubmissionPage'));
const LiveStreamPage = lazy(() => import('./pages/LiveStreamPage'));
const PressKitPage = lazy(() => import('./pages/PressKitPage'));
const AirdropPage = lazy(() => import('./pages/AirdropPage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const LoginForm = lazy(() => import('./components/auth/LoginForm'));
const RegisterForm = lazy(() => import('./components/auth/RegisterForm'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas imediatas (sem lazy) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFound />} />
        
        {/* Rotas com lazy loading */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRoles={['admin']}>
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/nft-store" element={
          <Suspense fallback={<PageLoader />}>
            <NFTStorePage />
          </Suspense>
        } />
        
        {/* ... outras rotas com mesmo padrão */}
      </Routes>
    </Router>
  );
}
```

### 3. Lazy Loading Seletivo em HomePage

```typescript
// src/pages/HomePage.tsx
import { lazy, Suspense } from 'react';

// Componentes críticos (carregam imediatamente)
import HeroSection from '@/components/home/HeroSection';

// Componentes secundários (lazy)
const ArtistShowcase = lazy(() => import('@/components/ArtistShowcase'));
const NFTSection = lazy(() => import('@/components/NFTSection'));
const EventsSection = lazy(() => import('@/components/EventsSection'));
const ShopPreview = lazy(() => import('@/components/ShopPreview'));

const HomePage = () => (
  <>
    {/* Carrega imediatamente */}
    <HeroSection />
    
    {/* Lazy loading - só carrega quando usuário rolar */}
    <Suspense fallback={<div className="h-96 animate-pulse bg-gray-800/20" />}>
      <ArtistShowcase />
    </Suspense>
    
    <Suspense fallback={<div className="h-96 animate-pulse bg-gray-800/20" />}>
      <NFTSection />
    </Suspense>
  </>
);
```

---

## 🎨 Loading States Variados

### Skeleton Loading (Melhor UX)

```typescript
const HomeSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-96 bg-gray-800/20 mb-4"></div>
    <div className="grid grid-cols-3 gap-4">
      <div className="h-48 bg-gray-800/20"></div>
      <div className="h-48 bg-gray-800/20"></div>
      <div className="h-48 bg-gray-800/20"></div>
    </div>
  </div>
);

<Suspense fallback={<HomeSkeleton />}>
  <HomePage />
</Suspense>
```

---

## 📈 Métricas de Sucesso

### Como Medir

```typescript
// Adicionar em App.tsx
useEffect(() => {
  // Log de performance
  if (window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page load time: ${pageLoadTime}ms`);
  }
}, []);
```

### Usar Lighthouse

```bash
# Chrome DevTools > Lighthouse
# Ou:
npm install -g lighthouse
lighthouse https://seu-site.com --view
```

**Metas:**
- Performance Score: >90
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle Size: <1MB

---

## ⚠️ Armadilhas Comuns

### 1. Não Lazy Load Componentes Críticos
❌ **ERRADO:**
```typescript
const HomePage = lazy(() => import('./pages/HomePage'));
```

✅ **CORRETO:**
```typescript
import HomePage from './pages/HomePage';  // Home sempre carrega
```

### 2. Esquecer Suspense Boundary
❌ **ERRADO:**
```typescript
<Route path="/admin" element={<AdminDashboard />} />  // Erro!
```

✅ **CORRETO:**
```typescript
<Route path="/admin" element={
  <Suspense fallback={<Loading />}>
    <AdminDashboard />
  </Suspense>
} />
```

### 3. Lazy Loading Muito Granular
❌ **ERRADO:**
```typescript
const Button = lazy(() => import('./Button'));  // Muito pequeno!
```

✅ **CORRETO:**
Lazy load páginas inteiras ou seções grandes, não componentes pequenos.

---

## 🚀 Próximos Passos Avançados

### 1. Preload de Rotas Críticas

```typescript
// Precarregar admin ao fazer hover no link
<Link 
  to="/admin"
  onMouseEnter={() => import('./pages/AdminDashboard')}
>
  Admin
</Link>
```

### 2. Prefetch com React Router

```typescript
import { prefetchQuery } from '@tanstack/react-query';

// Precarregar dados antes da navegação
router.beforeEach(async (to) => {
  if (to.path === '/nft-store') {
    await prefetchQuery(['nft-products']);
  }
});
```

### 3. Web Workers para Three.js

```typescript
// Processar Three.js em background thread
const worker = new Worker('./threejs-worker.js');
worker.postMessage({ type: 'render', scene: sceneData });
```

---

## 📝 Checklist de Implementação

- [ ] Criar PageLoader component
- [ ] Adicionar lazy() imports no App.tsx
- [ ] Envolver rotas com Suspense
- [ ] Lazy load componentes pesados (Three.js)
- [ ] Testar cada rota
- [ ] Medir bundle size antes/depois
- [ ] Rodar Lighthouse
- [ ] Validar em mobile
- [ ] Commit & deploy

---

## 🎯 Resultado Esperado

**Antes:**
```
Bundle: 2MB
Load time: 4-5s
Lighthouse: ~65
```

**Depois:**
```
Bundle: 600KB (inicial) + chunks
Load time: 1.5-2s
Lighthouse: >90
```

**Ganho:** 60-70% de melhoria na performance! 🚀
