import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, Upload, Eye, Save, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { nftProductsService } from '@/services/nft';
import type { CreateNFTProductInput, NFTProduct, ProductType, ProductRarity, PaymentMethod } from '@/types/nftTypes';

const NFTGeneratorTab = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<NFTProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<NFTProduct | null>(null);

  const [formData, setFormData] = useState<CreateNFTProductInput>({
    name: '',
    slug: '',
    description: '',
    product_type: 'digital',
    price_jestcoin: 0,
    price_money: 0,
    payment_methods: 'hybrid',
    rarity: 'common',
    stock_quantity: 0,
    unlimited_stock: false,
    max_per_user: 0,
    is_limited_edition: false,
    tags: [],
  });

  const [currentTag, setCurrentTag] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await nftProductsService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData: CreateNFTProductInput = {
        ...formData,
        images,
      };

      if (selectedProduct) {
        await nftProductsService.updateProduct(selectedProduct.id, productData);
        toast({
          title: 'Product Updated',
          description: 'NFT product has been updated successfully.',
        });
      } else {
        await nftProductsService.createProduct(productData);
        toast({
          title: 'Product Created',
          description: 'NFT product has been created successfully.',
        });
      }

      resetForm();
      loadProducts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      product_type: 'digital',
      price_jestcoin: 0,
      price_money: 0,
      payment_methods: 'hybrid',
      rarity: 'common',
      stock_quantity: 0,
      unlimited_stock: false,
      max_per_user: 0,
      is_limited_edition: false,
      tags: [],
    });
    setImages([]);
    setCurrentImage('');
    setCurrentTag('');
    setSelectedProduct(null);
  };

  const handleInputChange = (field: keyof CreateNFTProductInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const addTag = () => {
    if (currentTag && !formData.tags?.includes(currentTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag),
    }));
  };

  const addImage = () => {
    if (currentImage && !images.includes(currentImage)) {
      setImages(prev => [...prev, currentImage]);
      setCurrentImage('');
    }
  };

  const removeImage = (img: string) => {
    setImages(prev => prev.filter(i => i !== img));
  };

  const editProduct = (product: NFTProduct) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      product_type: product.product_type,
      price_jestcoin: product.price_jestcoin,
      price_money: product.price_money,
      payment_methods: product.payment_methods,
      rarity: product.rarity,
      stock_quantity: product.stock_quantity,
      unlimited_stock: product.unlimited_stock,
      max_per_user: product.max_per_user,
      is_limited_edition: product.is_limited_edition,
      edition_size: product.edition_size,
      tags: product.tags,
      image_url: product.image_url,
      video_url: product.video_url,
      model_3d_url: product.model_3d_url,
    });
    setImages(product.images || []);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">NFT Generator</h2>
          <p className="text-white/70">Create and manage NFT products for your store</p>
        </div>
        {selectedProduct && (
          <Button onClick={resetForm} variant="outline">
            Create New
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-morphism border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                {selectedProduct ? 'Edit Product' : 'New NFT Product'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="slug">Slug (URL)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product_type">Product Type</Label>
                        <Select
                          value={formData.product_type}
                          onValueChange={(value: ProductType) => handleInputChange('product_type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="digital">Digital</SelectItem>
                            <SelectItem value="physical">Physical</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="rarity">Rarity</Label>
                        <Select
                          value={formData.rarity}
                          onValueChange={(value: ProductRarity) => handleInputChange('rarity', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="common">Common</SelectItem>
                            <SelectItem value="uncommon">Uncommon</SelectItem>
                            <SelectItem value="rare">Rare</SelectItem>
                            <SelectItem value="epic">Epic</SelectItem>
                            <SelectItem value="legendary">Legendary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Tags</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          placeholder="Add tag"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" onClick={addTag} size="icon">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags?.map(tag => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            {tag}
                            <X
                              className="w-3 h-3 cursor-pointer"
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price_jestcoin">Price (Jest Coins)</Label>
                        <Input
                          id="price_jestcoin"
                          type="number"
                          value={formData.price_jestcoin}
                          onChange={(e) => handleInputChange('price_jestcoin', parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor="price_money">Price (Money)</Label>
                        <Input
                          id="price_money"
                          type="number"
                          step="0.01"
                          value={formData.price_money}
                          onChange={(e) => handleInputChange('price_money', parseFloat(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="payment_methods">Payment Methods</Label>
                      <Select
                        value={formData.payment_methods}
                        onValueChange={(value: PaymentMethod) => handleInputChange('payment_methods', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jestcoin">Jest Coin Only</SelectItem>
                          <SelectItem value="money">Money Only</SelectItem>
                          <SelectItem value="hybrid">Both (Hybrid)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="unlimited_stock">Unlimited Stock</Label>
                        <Switch
                          id="unlimited_stock"
                          checked={formData.unlimited_stock}
                          onCheckedChange={(checked) => handleInputChange('unlimited_stock', checked)}
                        />
                      </div>

                      {!formData.unlimited_stock && (
                        <div>
                          <Label htmlFor="stock_quantity">Stock Quantity</Label>
                          <Input
                            id="stock_quantity"
                            type="number"
                            value={formData.stock_quantity}
                            onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value) || 0)}
                            min="0"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Label htmlFor="is_limited_edition">Limited Edition</Label>
                        <Switch
                          id="is_limited_edition"
                          checked={formData.is_limited_edition}
                          onCheckedChange={(checked) => handleInputChange('is_limited_edition', checked)}
                        />
                      </div>

                      {formData.is_limited_edition && (
                        <div>
                          <Label htmlFor="edition_size">Edition Size</Label>
                          <Input
                            id="edition_size"
                            type="number"
                            value={formData.edition_size || ''}
                            onChange={(e) => handleInputChange('edition_size', parseInt(e.target.value) || undefined)}
                            min="1"
                          />
                        </div>
                      )}

                      <div>
                        <Label htmlFor="max_per_user">Max Per User (0 = unlimited)</Label>
                        <Input
                          id="max_per_user"
                          type="number"
                          value={formData.max_per_user}
                          onChange={(e) => handleInputChange('max_per_user', parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="image_url">Main Image URL</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url || ''}
                        onChange={(e) => handleInputChange('image_url', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div>
                      <Label>Additional Images</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={currentImage}
                          onChange={(e) => setCurrentImage(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                        />
                        <Button type="button" onClick={addImage} size="icon">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(img)}
                              className="absolute top-1 right-1 bg-red-500 p-1 rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="video_url">Video URL</Label>
                      <Input
                        id="video_url"
                        value={formData.video_url || ''}
                        onChange={(e) => handleInputChange('video_url', e.target.value)}
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>

                    <div>
                      <Label htmlFor="model_3d_url">3D Model URL (.glb)</Label>
                      <Input
                        id="model_3d_url"
                        value={formData.model_3d_url || ''}
                        onChange={(e) => handleInputChange('model_3d_url', e.target.value)}
                        placeholder="https://example.com/model.glb"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <p className="text-sm text-white/70">
                        Advanced settings for metadata and custom attributes will be available here.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {selectedProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                  {selectedProduct && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="glass-morphism border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Products ({products.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {products.map(product => (
                  <div
                    key={product.id}
                    className="p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => editProduct(product)}
                  >
                    <div className="flex gap-3">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{product.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {product.product_type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {product.rarity}
                          </Badge>
                          {product.price_jestcoin > 0 && (
                            <Badge className="text-xs bg-yellow-600">
                              {product.price_jestcoin} JC
                            </Badge>
                          )}
                          {product.price_money > 0 && (
                            <Badge className="text-xs bg-green-600">
                              ${product.price_money}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NFTGeneratorTab;