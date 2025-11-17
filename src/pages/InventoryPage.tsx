import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Package,
  Star,
  Download,
  ExternalLink,
  Trophy,
  Sparkles,
  Filter,
  Grid3x3,
  List,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { inventoryService } from '@/services/nft';
import type { UserNFTInventory, ProductRarity, ProductType } from '@/types/nftTypes';

const InventoryPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [inventory, setInventory] = useState<UserNFTInventory[]>([]);
  const [showcasedNFTs, setShowcasedNFTs] = useState<UserNFTInventory[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadInventory();
    }
  }, [user]);

  const loadInventory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [inventoryData, showcaseData, statsData] = await Promise.all([
        inventoryService.getUserInventory(user.id),
        inventoryService.getShowcasedNFTs(user.id),
        inventoryService.getInventoryStats(user.id),
      ]);

      setInventory(inventoryData);
      setShowcasedNFTs(showcaseData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to load inventory',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleShowcase = async (inventoryId: string, currentShowcaseStatus: boolean) => {
    try {
      await inventoryService.updateShowcase(inventoryId, !currentShowcaseStatus);
      toast({
        title: currentShowcaseStatus ? 'Removed from Showcase' : 'Added to Showcase',
        description: currentShowcaseStatus 
          ? 'NFT removed from your showcase' 
          : 'NFT added to your showcase',
      });
      await loadInventory();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update showcase',
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

  const getTypeIcon = (type: ProductType) => {
    switch (type) {
      case 'digital':
        return '💎';
      case 'physical':
        return '📦';
      case 'hybrid':
        return '🎁';
      default:
        return '❓';
    }
  };

  const filteredInventory = inventory.filter(item => {
    if (filterRarity !== 'all' && item.product?.rarity !== filterRarity) return false;
    if (filterType !== 'all' && item.product?.product_type !== filterType) return false;
    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <Card className="glass-morphism border-white/10 max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h2 className="text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-white/70 mb-4">
              Please login to view your NFT inventory
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 animate-pulse mx-auto mb-4 text-purple-400" />
          <p className="text-white/70">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">
            <Package className="inline-block w-12 h-12 mr-4" />
            My NFT Collection
          </h1>
          <p className="text-white/70 max-w-2xl">
            View and manage your NFT collection. Showcase your favorite pieces and track your collection stats.
          </p>
        </div>

        {/* Collection Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="glass-morphism border-white/10">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-3xl font-bold">{stats.total_nfts}</div>
                <div className="text-sm text-white/50">Total NFTs</div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-white/10">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-3xl font-bold">{stats.by_rarity.legendary}</div>
                <div className="text-sm text-white/50">Legendary</div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-white/10">
              <CardContent className="p-6 text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-3xl font-bold">{stats.by_type.digital}</div>
                <div className="text-sm text-white/50">Digital</div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-white/10">
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-3xl font-bold">{showcasedNFTs.length}</div>
                <div className="text-sm text-white/50">Showcased</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Showcased NFTs Section */}
        {showcasedNFTs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Featured Showcase
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {showcasedNFTs.map((item) => (
                <Card key={item.id} className="glass-morphism border-white/10 overflow-hidden">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    {item.product?.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        {getTypeIcon(item.product?.product_type || 'digital')}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 truncate">{item.product?.name}</h3>
                    <Badge className={getRarityColor(item.product?.rarity || 'common')}>
                      {item.product?.rarity}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Main Inventory Section */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">All NFTs ({filteredInventory.length})</TabsTrigger>
              <TabsTrigger value="digital">Digital</TabsTrigger>
              <TabsTrigger value="physical">Physical</TabsTrigger>
              <TabsTrigger value="hybrid">Hybrid</TabsTrigger>
            </TabsList>

            <div className="flex gap-2 w-full md:w-auto">
              <Select value={filterRarity} onValueChange={setFilterRarity}>
                <SelectTrigger className="w-[140px] bg-black/40 border-white/20">
                  <SelectValue placeholder="Rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="uncommon">Uncommon</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <TabsContent value="all">
            {filteredInventory.length === 0 ? (
              <Card className="glass-morphism border-white/10">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl font-semibold mb-2">No NFTs Yet</h3>
                  <p className="text-white/50 mb-4">
                    Visit the NFT Store to start your collection!
                  </p>
                  <Button onClick={() => window.location.href = '/nft-store'}>
                    Browse NFT Store
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {filteredInventory.map((item) => (
                  <Card key={item.id} className="glass-morphism border-white/10 overflow-hidden">
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-square overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative">
                          {item.product?.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl">
                              {getTypeIcon(item.product?.product_type || 'digital')}
                            </div>
                          )}
                          {item.is_showcased && (
                            <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-2">
                              <Star className="w-4 h-4 text-black fill-black" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 truncate">{item.product?.name}</h3>
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={getRarityColor(item.product?.rarity || 'common')}>
                              {item.product?.rarity}
                            </Badge>
                            <Badge variant="outline">
                              {getTypeIcon(item.product?.product_type || 'digital')} {item.product?.product_type}
                            </Badge>
                          </div>
                          <div className="text-xs text-white/50 mb-3">
                            <p>Token ID: {item.token_id?.slice(0, 12)}...</p>
                            <p>Acquired: {new Date(item.acquired_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={item.is_showcased ? 'default' : 'outline'}
                              onClick={() => toggleShowcase(item.id, item.is_showcased)}
                              className="flex-1"
                            >
                              <Star className="w-3 h-3 mr-1" />
                              {item.is_showcased ? 'Showcased' : 'Showcase'}
                            </Button>
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex-shrink-0">
                          {item.product?.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              {getTypeIcon(item.product?.product_type || 'digital')}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1 truncate">{item.product?.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${getRarityColor(item.product?.rarity || 'common')} text-xs`}>
                              {item.product?.rarity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.product?.product_type}
                            </Badge>
                          </div>
                          <p className="text-xs text-white/50 truncate">
                            Token: {item.token_id}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant={item.is_showcased ? 'default' : 'outline'}
                          onClick={() => toggleShowcase(item.id, item.is_showcased)}
                        >
                          <Star className="w-3 h-3" />
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Other tabs with filtered content */}
          {['digital', 'physical', 'hybrid'].map(type => (
            <TabsContent key={type} value={type}>
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {filteredInventory
                  .filter(item => item.product?.product_type === type)
                  .map(item => (
                    <Card key={item.id} className="glass-morphism border-white/10">
                      {/* Reuse the same card content as above */}
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{item.product?.name}</h3>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default InventoryPage;
