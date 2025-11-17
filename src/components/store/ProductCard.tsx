import { StoreProduct } from '@/types/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: StoreProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1, product.price);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const isOnSale = product.compare_at_price && product.compare_at_price > product.price;
  const discount = isOnSale
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <Link to={'/store/' + product.slug}>
      <Card className="glass-morphism group hover:border-purple-500 transition-all duration-300 overflow-hidden h-full">
        <div className="relative overflow-hidden">
          {product.featured_image && (
            <img
              src={product.featured_image}
              alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
            />
          )}
          
          {product.is_featured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-yellow-500/90 text-black">
                <Star size={12} className="mr-1" fill="currentColor" />
                Featured
              </Badge>
            </div>
          )}

          {isOnSale && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-red-500/90">
                -{discount}%
              </Badge>
            </div>
          )}

          {product.stock_quantity <= 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge className="bg-gray-500">Out of Stock</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-lg text-white line-clamp-2 group-hover:text-purple-400 transition-colors">
            {product.name}
          </h3>

          {product.short_description && (
            <p className="text-sm text-white/60 line-clamp-2">
              {product.short_description}
            </p>
          )}

          <div className="flex items-center gap-2">
            {isOnSale && (
              <span className="text-sm text-white/40 line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
            <span className={'font-bold text-xl ' + (isOnSale ? 'text-red-400' : 'text-white')}>
              {formatPrice(product.price)}
            </span>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0}
            className="w-full gap-2"
          >
            <ShoppingCart size={16} />
            {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
