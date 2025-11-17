import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlassHeader from './components/GlassHeader';
import AdminQuickAccess from './components/AdminQuickAccess';
import { defaultModelParams } from './types/model';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/auth';
import { LoginForm } from './components/auth';
import { RegisterForm } from './components/auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import Footer from './components/Footer';
import LanguageProvider from './contexts/LanguageContext';

// Lazy load pages for better code splitting and performance
const HomePage = lazy(() => import('./pages/HomePage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const NewStorePage = lazy(() => import('./pages/NewStorePage'));
const NFTStorePage = lazy(() => import('./pages/NFTStorePage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const DemoSubmissionPage = lazy(() => import('./pages/DemoSubmissionPage'));
const LiveStreamPage = lazy(() => import('./pages/LiveStreamPage'));
const PressKitPage = lazy(() => import('./pages/PressKitPage'));
const AirdropPage = lazy(() => import('./pages/AirdropPage'));
const EcommercePage = lazy(() => import('./pages/EcommercePage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
  </div>
);

function App() {
  const crystalParams = {
    ...defaultModelParams,
    color: "#ffffff",
    metalness: 0.2,
    roughness: 0.01,
    transmission: 0.98,
    thickness: 0.8,
    envMapIntensity: 5.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    ior: 2.5,
    iridescence: 1.0,
    iridescenceIOR: 2.0,
    transparent: true,
    opacity: 0.8,
    reflectivity: 1.0,
    emissiveIntensity: 0.08,
    emissiveColor: "#8B5CF6",
    lightIntensity: 5.0
  };
  
  const galleryImages = [
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'default' as const },
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'bottom-left' as const },
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'center' as const }
  ];
  
  const menuItems = [
    { label: 'Início', href: '/' },
    { label: 'Store', href: '/store' },
    { label: 'NFT Store', href: '/nft-store' },
    { label: 'Community', href: '/community' },
    { label: 'Bookings', href: '/bookings' },
    { label: 'Resources', href: '/resources' },
    { label: 'Notes', href: '/notes' },
    { label: 'Profile', href: '/profile' },
    { label: 'Demo Submission', href: '/demo-submission' },
    { label: 'Live Stream', href: '/live-stream' },
    { label: 'Press Kit', href: '/press-kit' },
    { label: 'Airdrop', href: '/airdrop' },
  ];
  
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-black">
            <GlassHeader
              menuItems={menuItems}
              logoType="video"
              videoSrc="/assets/videos/oculos2.mp4"
              modelSrc="/models/logo-3d.glb"
            />
            <Toaster position="top-right" />
            <AdminQuickAccess />
            <main className="flex-grow">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage crystalParams={crystalParams} galleryImages={galleryImages} />} />
                  <Route path="/store/*" element={<NewStorePage />} />
                  <Route path="/nft-store" element={<NFTStorePage />} />
                  <Route path="/community/*" element={<CommunityPage />} />
                  <Route path="/bookings" element={<BookingsPage />} />
                  <Route path="/resources" element={<EcommercePage />} />
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                <Route path="/profile/:userId" element={
                  <ProfilePage />
                } />
                <Route path="/demo-submission" element={
                  <ProtectedRoute>
                    <DemoSubmissionPage />
                  </ProtectedRoute>
                } />
                <Route path="/live-stream" element={<LiveStreamPage />} />
                <Route path="/press-kit" element={<PressKitPage />} />
                <Route path="/airdrop" element={<AirdropPage />} />
                <Route path="/admin" element={
                  <ProtectedRoute requiredRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/login" element={
                  <ProtectedRoute requireAuth={false}>
                    <div className="container mx-auto py-20">
                      <LoginForm />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/register" element={
                  <ProtectedRoute requireAuth={false}>
                    <div className="container mx-auto py-20">
                      <RegisterForm />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/forgot-password" element={
                  <ProtectedRoute requireAuth={false}>
                    <ForgotPasswordPage />
                  </ProtectedRoute>
                } />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
