import { useState } from 'react';
import ProductGrid from '@/components/store/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, ShoppingCart, Filter } from 'lucide-react';
import { Link, Routes, Route } from 'react-router-dom';
import ShoppingCart from '@/components/store/ShoppingCart';
import { useCart } from '@/hooks/useCart';
import { Badge } from '@/components/ui/badge';

const StoreHomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartCount } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gradient mb-2">Store</h1>
              <p className="text-white/60 text-lg">Exclusive products and merchandise</p>
            </div>

            <Link to="/store/cart">
              <Button size="lg" className="gap-2 relative">
                <ShoppingCart size={20} />
                Cart
                {getCartCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500">
                    {getCartCount()}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>

          <Card className="glass-morphism p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 bg-black/20 border-white/10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                Filters
              </Button>
            </div>
          </Card>
        </div>

        <ProductGrid />
      </div>
    </div>
  );
};

const StorePage = () => {
  return (
    <Routes>
      <Route index element={<StoreHomePage />} />
      <Route path="cart" element={
        <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
              <Link to="/store">
                <Button variant="ghost" className="mb-4">
                  ← Back to Store
                </Button>
              </Link>
              <h1 className="text-4xl font-bold text-gradient">Shopping Cart</h1>
            </div>
            <ShoppingCart />
          </div>
        </div>
      } />
    </Routes>
  );
};

export default StorePage;
