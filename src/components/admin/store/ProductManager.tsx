import { useProducts } from '@/hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import ProductEditor from './ProductEditor';
import { StoreProduct } from '@/types/store';

const ProductManager = () => {
  const { products, loading, deleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Products</h3>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={16} />
          Add Product
        </Button>
      </div>

      {(isCreating || editingProduct) && (
        <ProductEditor
          product={editingProduct}
          onClose={() => {
            setIsCreating(false);
            setEditingProduct(null);
          }}
        />
      )}

      {loading ? (
        <p className="text-center text-white/60">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="glass-morphism">
              <CardContent className="p-4">
                {product.featured_image && (
                  <img
                    src={product.featured_image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-white line-clamp-2">{product.name}</h4>
                    <div className="flex gap-1">
                      {product.is_featured && (
                        <Badge className="bg-yellow-500/30 text-yellow-300">Featured</Badge>
                      )}
                      {product.is_active ? (
                        <Badge className="bg-green-500/30 text-green-300">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-500/30 text-gray-300">Inactive</Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-white/60 line-clamp-2">{product.short_description}</p>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-400">{formatPrice(product.price)}</span>
                    <span className="text-sm text-white/60">Stock: {product.stock_quantity}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProduct(product)}
                      className="flex-1 gap-1"
                    >
                      <Edit size={14} />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                      className="gap-1"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <Card className="glass-morphism">
          <CardContent className="p-12 text-center">
            <p className="text-white/60 mb-4">No products yet. Create your first product!</p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus size={16} className="mr-2" />
              Create First Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductManager;
