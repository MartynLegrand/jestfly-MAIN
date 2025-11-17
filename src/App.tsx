import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlassHeader from './components/GlassHeader';
import { defaultModelParams } from './types/model';
import { Toaster } from 'sonner';
import NotesPage from './pages/NotesPage';
import HomePage from './pages/HomePage';
import NewStorePage from './pages/NewStorePage';
import NFTStorePage from './pages/NFTStorePage';
import CommunityPage from './pages/CommunityPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import DemoSubmissionPage from './pages/DemoSubmissionPage';
import LiveStreamPage from './pages/LiveStreamPage';
import PressKitPage from './pages/PressKitPage';
import AirdropPage from './pages/AirdropPage';
import EcommercePage from './pages/EcommercePage';
import AdminPanel from './pages/AdminPanel';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { AuthProvider } from './contexts/auth';
import { LoginForm } from './components/auth';
import { RegisterForm } from './components/auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import Footer from './components/Footer';
import LanguageProvider from './contexts/LanguageContext';

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
            <main className="flex-grow">
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
                    <AdminPanel />
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
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
