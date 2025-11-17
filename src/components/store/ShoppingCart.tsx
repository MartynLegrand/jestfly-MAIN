import { useCart } from '@/hooks/useCart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShoppingCart = () => {
  const { cartItems, loading, updateCartQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <Card className="glass-morphism">
        <CardContent className="p-8 text-center">
          <p className="text-white/60">Loading cart...</p>
        </CardContent>
      </Card>
    );
  }

  if (!cartItems.length) {
    return (
      <Card className="glass-morphism">
        <CardContent className="p-12 text-center space-y-4">
          <ShoppingBag size={48} className="mx-auto text-white/40" />
          <h3 className="text-xl font-semibold text-white">Your cart is empty</h3>
          <p className="text-white/60">Add some products to get started!</p>
          <Link to="/store">
            <Button>Browse Products</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-morphism">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Shopping Cart</CardTitle>
            <Badge>{getCartCount()} items</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              {item.product?.featured_image && (
                <img
                  src={item.product.featured_image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}

              <div className="flex-1 min-w-0">
                <Link to={'/store/' + item.product?.slug} className="hover:text-purple-400">
                  <h4 className="font-semibold text-white truncate">
                    {item.product?.name}
                  </h4>
                </Link>
                <p className="text-sm text-white/60">
                  {formatPrice(item.price_snapshot)} each
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                >
                  <Minus size={14} />
                </Button>
                <span className="w-8 text-center font-semibold text-white">
                  {item.quantity}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={14} />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-white min-w-[80px] text-right">
                  {formatPrice(item.price_snapshot * item.quantity)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between text-lg">
            <span className="text-white/80">Subtotal:</span>
            <span className="font-bold text-white">{formatPrice(getCartTotal())}</span>
          </div>
          <div className="flex items-center justify-between text-lg">
            <span className="text-white/80">Shipping:</span>
            <span className="text-white/60">Calculated at checkout</span>
          </div>
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-2xl">
            <span className="font-bold text-white">Total:</span>
            <span className="font-bold text-purple-400">{formatPrice(getCartTotal())}</span>
          </div>

          <Link to="/store/checkout" className="block">
            <Button size="lg" className="w-full">
              Proceed to Checkout
            </Button>
          </Link>

          <Link to="/store" className="block">
            <Button variant="outline" size="lg" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShoppingCart;
