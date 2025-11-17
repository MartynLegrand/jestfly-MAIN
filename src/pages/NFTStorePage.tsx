import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Search,
  Filter,
  ShoppingCart,
  Heart,
  Sparkles,
  TrendingUp,
  Clock,
  Package,
  Wallet,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { nftProductsService, cartService } from '@/services/nft';
import { useAuth } from '@/contexts/auth';
import type { NFTProduct, NFTProductFilters, ProductType, ProductRarity, PaymentMethod } from '@/types/nftTypes';

const NFTStorePage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<NFTProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<NFTProductFilters>({
    sort_by: 'newest',
    in_stock: true,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [priceRangeJC, setPriceRangeJC] = useState<[number, number]>([0, 10000]);
  const [selectedTypes, setSelectedTypes] = useState<ProductType[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<ProductRarity[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await nftProductsService.getProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchQuery }));
  };

  const applyFilters = () => {
    setFilters(prev => ({
      ...prev,
      product_type: selectedTypes.length === 1 ? selectedTypes[0] : undefined,
      rarity: selectedRarities.length === 1 ? selectedRarities[0] : undefined,
      payment_method: selectedPaymentMethods.length === 1 ? selectedPaymentMethods[0] : undefined,
      min_price_jestcoin: priceRangeJC[0],
      max_price_jestcoin: priceRangeJC[1],
    }));
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedRarities([]);
    setSelectedPaymentMethods([]);
    setPriceRangeJC([0, 10000]);
    setFilters({ sort_by: 'newest', in_stock: true });
  };

  const toggleFilter = <T,>(
    value: T,
    selected: T[],
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setter(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const addToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to cart',
        variant: 'destructive',
      });
      return;
    }

    try {
      await cartService.addToCart(user.id, productId);
      toast({
        title: 'Added to Cart',
        description: 'Product added to your cart successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add to cart',
        variant: 'destructive',
      });
    }
  };

  const getRarityColor = (rarity: ProductRarity) => {
    const colors = {
      common: 'bg-gray-500',
      uncommon: 'bg-green-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-yellow-500',
    };
    return colors[rarity];
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Product Type</h3>
        <div className="space-y-2">
          {(['digital', 'physical', 'hybrid'] as ProductType[]).map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
              />
              <Label htmlFor={`type-${type}`} className="capitalize cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Rarity</h3>
        <div className="space-y-2">
          {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as ProductRarity[]).map(rarity => (
            <div key={rarity} className="flex items-center space-x-2">
              <Checkbox
                id={`rarity-${rarity}`}
                checked={selectedRarities.includes(rarity)}
                onCheckedChange={() => toggleFilter(rarity, selectedRarities, setSelectedRarities)}
              />
              <Label htmlFor={`rarity-${rarity}`} className="capitalize cursor-pointer flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getRarityColor(rarity)}`} />
                {rarity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Payment Method</h3>
        <div className="space-y-2">
          {(['jestcoin', 'money', 'hybrid'] as PaymentMethod[]).map(method => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                id={`payment-${method}`}
                checked={selectedPaymentMethods.includes(method)}
                onCheckedChange={() => toggleFilter(method, selectedPaymentMethods, setSelectedPaymentMethods)}
              />
              <Label htmlFor={`payment-${method}`} className="capitalize cursor-pointer">
                {method === 'jestcoin' ? 'Jest Coin' : method}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range (Jest Coins)</h3>
        <Slider
          value={priceRangeJC}
          onValueChange={(value) => setPriceRangeJC(value as [number, number])}
          max={10000}
          step={100}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-white/70">
          <span>{priceRangeJC[0]} JC</span>
          <span>{priceRangeJC[1]} JC</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">
          Apply
        </Button>
        <Button onClick={clearFilters} variant="outline">
          Clear
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">NFT Store</h1>
            <p className="text-white/70 max-w-2xl">
              Discover exclusive digital and physical NFTs. Own unique collectibles, earn rewards, and join the community.
            </p>
          </div>
          <Link to="/checkout">
            <Button size="lg" className="gap-2">
              <ShoppingCart className="w-5 h-5" />
              Checkout
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <Card className="glass-morphism border-white/10 sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h2>
                <FilterSidebar />
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="bg-black/40 border-white/20"
                />
                <Button onClick={handleSearch} size="icon">
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="bg-black border-white/10">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select
                  value={filters.sort_by}
                  onValueChange={(value: any) => setFilters(prev => ({ ...prev, sort_by: value }))}
                >
                  <SelectTrigger className="w-[180px] bg-black/40 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Products ({products.length})</TabsTrigger>
                <TabsTrigger value="featured">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Featured
                </TabsTrigger>
                <TabsTrigger value="new">
                  <Clock className="w-4 h-4 mr-1" />
                  New
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="glass-morphism border-white/10 animate-pulse">
                        <div className="aspect-square bg-white/5" />
                        <CardContent className="p-4">
                          <div className="h-6 bg-white/5 rounded mb-2" />
                          <div className="h-4 bg-white/5 rounded w-2/3" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 text-white/30" />
                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                    <p className="text-white/70">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <Card
                        key={product.id}
                        className="glass-morphism border-white/10 group hover:border-purple-500/50 transition-all overflow-hidden"
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={product.image_url || '/placeholder.svg'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-2 right-2 flex gap-1">
                            {product.is_limited_edition && (
                              <Badge className="bg-red-600">Limited</Badge>
                            )}
                            <Badge className={getRarityColor(product.rarity)}>
                              {product.rarity}
                            </Badge>
                          </div>
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary">{product.product_type}</Badge>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg mb-2 truncate">{product.name}</h3>
                          {product.description && (
                            <p className="text-sm text-white/70 mb-3 line-clamp-2">{product.description}</p>
                          )}

                          <div className="flex items-center justify-between mb-3">
                            <div>
                              {product.price_jestcoin > 0 && (
                                <div className="flex items-center gap-1">
                                  <Sparkles className="w-4 h-4 text-yellow-400" />
                                  <span className="font-bold">{product.price_jestcoin} JC</span>
                                </div>
                              )}
                              {product.price_money > 0 && (
                                <div className="flex items-center gap-1">
                                  <Wallet className="w-4 h-4 text-green-400" />
                                  <span className="font-bold">${product.price_money}</span>
                                </div>
                              )}
                            </div>

                            {!product.unlimited_stock && (
                              <div className="text-xs text-white/70">
                                Stock: {product.stock_quantity}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => addToCart(product.id)}
                              className="flex-1"
                              disabled={!product.unlimited_stock && product.stock_quantity === 0}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Button variant="outline" size="icon">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="featured">
                <p className="text-center text-white/70 py-12">Featured products coming soon...</p>
              </TabsContent>

              <TabsContent value="new">
                <p className="text-center text-white/70 py-12">New releases coming soon...</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

    </div>
  );
};

export default NFTStorePage;