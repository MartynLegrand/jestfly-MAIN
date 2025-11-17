import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Settings,
  Sparkles,
  FileAxis3d,
  Palette,
  LayoutDashboard,
  ChevronUp,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Command,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

const AdminQuickAccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isOnAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!isAdmin) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        toast.success('Admin Quick Access toggled', {
          description: 'Use Ctrl+K (or Cmd+K) anytime',
          duration: 2000,
        });
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        navigate('/admin');
        toast.success('Navigated to Admin Panel');
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        navigate('/');
        toast.success('Navigated to Homepage');
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        navigate('/nft-store');
        toast.success('Navigated to NFT Store');
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        navigate('/store');
        toast.success('Navigated to Store');
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        navigate('/community');
        toast.success('Navigated to Community');
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'B') {
        e.preventDefault();
        navigate('/bookings');
        toast.success('Navigated to Bookings');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const quickActions = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
      description: 'View admin overview',
    },
    {
      label: 'NFT Generator',
      icon: Sparkles,
      href: '/admin',
      tab: 'nft-generator',
      description: 'Create new NFTs',
    },
    {
      label: '3D Models',
      icon: FileAxis3d,
      href: '/admin',
      tab: 'models',
      description: 'Manage 3D models',
    },
    {
      label: 'Design System',
      icon: Palette,
      href: '/admin',
      tab: 'colors',
      description: 'Customize colors',
    },
  ];

  const siteLinks = [
    { label: 'NFT Store', icon: ShoppingCart, href: '/nft-store' },
    { label: 'Community', icon: Users, href: '/community' },
    { label: 'Store', icon: Package, href: '/store' },
    { label: 'Homepage', icon: TrendingUp, href: '/' },
  ];

  return (
    <>
      {/* Desktop Version - Fixed Bottom Right */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
              aria-label="Admin Quick Access"
            >
              {isOpen ? (
                <ChevronUp className="h-6 w-6 transition-transform group-hover:scale-110" />
              ) : (
                <Settings className="h-6 w-6 transition-transform group-hover:rotate-90 duration-500" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-72 bg-black/95 backdrop-blur-xl border-white/20"
            sideOffset={10}
          >
            <DropdownMenuLabel className="text-lg font-bold text-gradient">
              Admin Quick Access
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />

            {/* Admin Actions */}
            <div className="py-2">
              <div className="px-2 text-xs text-white/50 mb-2 uppercase tracking-wider">
                Admin Actions
              </div>
              {quickActions.map((action) => (
                <Link
                  key={action.href + (action.tab || '')}
                  to={action.tab ? `${action.href}?tab=${action.tab}` : action.href}
                  onClick={() => setIsOpen(false)}
                >
                  <DropdownMenuItem className="cursor-pointer group py-3 hover:bg-purple-600/20">
                    <div className="flex items-start gap-3 w-full">
                      <action.icon className="h-5 w-5 mt-0.5 text-purple-400 group-hover:text-purple-300" />
                      <div className="flex-1">
                        <div className="font-medium text-white group-hover:text-purple-300">
                          {action.label}
                        </div>
                        <div className="text-xs text-white/60">{action.description}</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </Link>
              ))}
            </div>

            <DropdownMenuSeparator className="bg-white/10" />

            {/* Site Navigation */}
            <div className="py-2">
              <div className="px-2 text-xs text-white/50 mb-2 uppercase tracking-wider">
                Quick Nav
              </div>
              {siteLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setIsOpen(false)}>
                  <DropdownMenuItem className="cursor-pointer group py-2.5 hover:bg-white/10">
                    <link.icon className="h-4 w-4 mr-3 text-white/70 group-hover:text-white" />
                    <span className="text-white/90 group-hover:text-white">{link.label}</span>
                  </DropdownMenuItem>
                </Link>
              ))}
            </div>

            <DropdownMenuSeparator className="bg-white/10" />

            <div className="p-3 space-y-2">
              <div className="text-xs text-white/40 text-center mb-2">
                {isOnAdminPage ? '📊 Admin Mode Active' : '✨ Click to open admin panel'}
              </div>
              <div className="text-[10px] text-white/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Toggle Menu</span>
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50 font-mono">
                    {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+K
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Admin Panel</span>
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50 font-mono">
                    {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Shift+A
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Homepage</span>
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50 font-mono">
                    {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Shift+H
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Store</span>
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50 font-mono">
                    {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Shift+S
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Community</span>
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50 font-mono">
                    {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Shift+C
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bookings</span>
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50 font-mono">
                    {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Shift+B
                  </kbd>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Version - Fixed Bottom Center */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="h-12 px-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Settings className="h-5 w-5 mr-2" />
              Admin
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="center"
            className="w-64 bg-black/95 backdrop-blur-xl border-white/20 mb-2"
          >
            <DropdownMenuLabel className="text-center text-gradient">
              Quick Access
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />

            {quickActions.slice(0, 3).map((action) => (
              <Link
                key={action.href + (action.tab || '')}
                to={action.tab ? `${action.href}?tab=${action.tab}` : action.href}
              >
                <DropdownMenuItem className="cursor-pointer py-3">
                  <action.icon className="h-5 w-5 mr-3 text-purple-400" />
                  <span className="text-white">{action.label}</span>
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default AdminQuickAccess;
