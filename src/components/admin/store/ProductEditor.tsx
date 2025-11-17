import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { StoreProduct, ProductFormData } from '@/types/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X, Save, Upload } from 'lucide-react';

interface ProductEditorProps {
  product: StoreProduct | null;
  onClose: () => void;
}

const ProductEditor = ({ product, onClose }: ProductEditorProps) => {
  const { createProduct, updateProduct, uploadProductImage } = useProducts();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: 0,
    stock_quantity: 0,
    tags: [],
    is_featured: false,
    is_active: true,
    is_digital: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        short_description: product.short_description || '',
        price: product.price,
        compare_at_price: product.compare_at_price,
        stock_quantity: product.stock_quantity,
        sku: product.sku,
        featured_image: product.featured_image,
        tags: product.tags,
        is_featured: product.is_featured,
        is_active: product.is_active,
        is_digital: product.is_digital,
      });
    }
  }, [product]);

  const handleSave = async () => {
    if (product) {
      await updateProduct(product.id, formData);
    } else {
      await createProduct(formData);
    }
    onClose();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadProductImage(file);
    if (url) {
      setFormData({ ...formData, featured_image: url });
    }
    setUploading(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <Card className="glass-morphism border-purple-500">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{product ? 'Edit Product' : 'Create New Product'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Product Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({
                  ...formData,
                  name,
                  slug: formData.slug || generateSlug(name),
                });
              }}
              className="bg-black/20 border-white/10"
              placeholder="Amazing Product"
            />
          </div>

          <div className="col-span-2">
            <Label>Slug (URL)</Label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="bg-black/20 border-white/10"
              placeholder="amazing-product"
            />
          </div>

          <div>
            <Label>Price ($)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="bg-black/20 border-white/10"
            />
          </div>

          <div>
            <Label>Compare At Price ($)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.compare_at_price || ''}
              onChange={(e) => setFormData({ ...formData, compare_at_price: parseFloat(e.target.value) || undefined })}
              className="bg-black/20 border-white/10"
              placeholder="Original price"
            />
          </div>

          <div>
            <Label>Stock Quantity</Label>
            <Input
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
              className="bg-black/20 border-white/10"
            />
          </div>

          <div>
            <Label>SKU</Label>
            <Input
              value={formData.sku || ''}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="bg-black/20 border-white/10"
              placeholder="PROD-001"
            />
          </div>

          <div className="col-span-2">
            <Label>Short Description</Label>
            <Textarea
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              className="bg-black/20 border-white/10"
              rows={2}
              placeholder="Brief description..."
            />
          </div>

          <div className="col-span-2">
            <Label>Full Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-black/20 border-white/10"
              rows={4}
              placeholder="Detailed description..."
            />
          </div>

          <div className="col-span-2">
            <Label>Featured Image</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="bg-black/20 border-white/10"
              />
              {uploading && <span className="text-sm text-white/60">Uploading...</span>}
            </div>
            {formData.featured_image && (
              <img
                src={formData.featured_image}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label>Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label>Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_digital}
                onCheckedChange={(checked) => setFormData({ ...formData, is_digital: checked })}
              />
              <Label>Digital Product</Label>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1 gap-2">
            <Save size={16} />
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductEditor;
