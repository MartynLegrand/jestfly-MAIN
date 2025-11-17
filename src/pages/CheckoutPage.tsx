import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  CreditCard,
  Wallet,
  Package,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { cartService, purchaseService, walletService } from '@/services/nft';
import type { ShoppingCart as CartItem, PaymentMethod, PurchaseNFTInput } from '@/types/nftTypes';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    recipient_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
  });
  const [needsShipping, setNeedsShipping] = useState(false);

  useEffect(() => {
    if (user) {
      loadCheckoutData();
    }
  }, [user]);

  const loadCheckoutData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [cartData, balance] = await Promise.all([
        cartService.getCart(user.id),
        walletService.getBalance(user.id),
      ]);

      setCart(cartData);
      setWalletBalance(balance);

      // Check if any item needs shipping
      const hasPhysical = cartData.some(
        item => item.product?.product_type === 'physical' || item.product?.product_type === 'hybrid'
      );
      setNeedsShipping(hasPhysical);
    } catch (error) {
      console.error('Error loading checkout data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load checkout data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    let jestCoin = 0;
    let money = 0;

    cart.forEach(item => {
      if (!item.product) return;
      
      const method = item.selected_payment_method || item.product.payment_methods;
      if (method === 'jestcoin' || method === 'hybrid') {
        const amount = method === 'hybrid' 
          ? (item.product.price_jestcoin * item.quantity) / 2
          : item.product.price_jestcoin * item.quantity;
        jestCoin += amount;
      }
      if (method === 'money' || method === 'hybrid') {
        const amount = method === 'hybrid'
          ? (parseFloat(item.product.price_money.toString()) * item.quantity) / 2
          : parseFloat(item.product.price_money.toString()) * item.quantity;
        money += amount;
      }
    });

    return { jestCoin, money };
  };

  const updatePaymentMethod = async (cartItemId: string, method: PaymentMethod) => {
    try {
      await cartService.updatePaymentMethod(cartItemId, method);
      await loadCheckoutData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update payment method',
        variant: 'destructive',
      });
    }
  };

  const validateShippingAddress = () => {
    if (!needsShipping) return true;
    
    const required = [
      'recipient_name',
      'address_line1',
      'city',
      'state',
      'postal_code',
      'country',
    ];
    
    for (const field of required) {
      if (!shippingAddress[field as keyof typeof shippingAddress]) {
        toast({
          title: 'Missing Information',
          description: `Please fill in ${field.replace('_', ' ')}`,
          variant: 'destructive',
        });
        return false;
      }
    }
    
    return true;
  };

  const processCheckout = async () => {
    if (!user) return;

    if (!validateShippingAddress()) return;

    const totals = calculateTotals();
    if (totals.jestCoin > walletBalance) {
      toast({
        title: 'Insufficient Balance',
        description: `You need ${totals.jestCoin} JC but only have ${walletBalance} JC`,
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);
    try {
      const purchasePromises = cart.map(item => {
        if (!item.product) return Promise.resolve(null);

        const input: PurchaseNFTInput = {
          product_id: item.product_id,
          quantity: item.quantity,
          payment_method: item.selected_payment_method || item.product.payment_methods,
          shipping_address: needsShipping ? shippingAddress : undefined,
        };

        return purchaseService.purchaseNFT(user.id, input);
      });

      await Promise.all(purchasePromises);

      // Clear cart
      await cartService.clearCart(user.id);

      toast({
        title: 'Purchase Successful!',
        description: 'Your NFTs have been added to your inventory',
      });

      // Redirect to inventory
      setTimeout(() => {
        navigate('/inventory');
      }, 2000);
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Purchase Failed',
        description: error.message || 'Something went wrong during checkout',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <Card className="glass-morphism border-white/10 max-w-md">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h2 className="text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-white/70 mb-4">Please login to checkout</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-purple-400" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <Card className="glass-morphism border-white/10 max-w-md">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-white/70 mb-4">
              Add some items to your cart before checking out
            </p>
            <Button onClick={() => navigate('/nft-store')}>
              Browse NFT Store
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">
            <ShoppingCart className="inline-block w-12 h-12 mr-4" />
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <Card className="glass-morphism border-white/10">
              <CardHeader>
                <CardTitle>Order Summary ({cart.length} items)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-lg bg-white/5">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex-shrink-0">
                      {item.product?.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-full h-full p-4 text-white/50" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.product?.name}</h3>
                      <p className="text-sm text-white/50 mb-2">
                        Quantity: {item.quantity}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {item.product?.product_type}
                        </Badge>
                        <Badge className="capitalize">
                          {item.product?.rarity}
                        </Badge>
                      </div>
                      {item.product && (
                        <RadioGroup
                          value={item.selected_payment_method || item.product.payment_methods}
                          onValueChange={(value) => updatePaymentMethod(item.id, value as PaymentMethod)}
                        >
                          {(item.product.payment_methods === 'hybrid' || item.product.payment_methods === 'jestcoin') && (
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="jestcoin" id={`jc-${item.id}`} />
                              <Label htmlFor={`jc-${item.id}`} className="cursor-pointer">
                                <Wallet className="w-4 h-4 inline mr-1" />
                                {item.product.price_jestcoin * item.quantity} JC
                              </Label>
                            </div>
                          )}
                          {(item.product.payment_methods === 'hybrid' || item.product.payment_methods === 'money') && (
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="money" id={`money-${item.id}`} />
                              <Label htmlFor={`money-${item.id}`} className="cursor-pointer">
                                <CreditCard className="w-4 h-4 inline mr-1" />
                                ${(parseFloat(item.product.price_money.toString()) * item.quantity).toFixed(2)}
                              </Label>
                            </div>
                          )}
                          {item.product.payment_methods === 'hybrid' && (
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="hybrid" id={`hybrid-${item.id}`} />
                              <Label htmlFor={`hybrid-${item.id}`} className="cursor-pointer">
                                <span className="flex items-center gap-2">
                                  <Wallet className="w-4 h-4" />
                                  {(item.product.price_jestcoin * item.quantity) / 2} JC +
                                  <CreditCard className="w-4 h-4" />
                                  ${((parseFloat(item.product.price_money.toString()) * item.quantity) / 2).toFixed(2)}
                                </span>
                              </Label>
                            </div>
                          )}
                        </RadioGroup>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {needsShipping && (
              <Card className="glass-morphism border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label>Recipient Name *</Label>
                      <Input
                        value={shippingAddress.recipient_name}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, recipient_name: e.target.value }))}
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Address Line 1 *</Label>
                      <Input
                        value={shippingAddress.address_line1}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, address_line1: e.target.value }))}
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Address Line 2</Label>
                      <Input
                        value={shippingAddress.address_line2}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, address_line2: e.target.value }))}
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div>
                      <Label>City *</Label>
                      <Input
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div>
                      <Label>State/Province *</Label>
                      <Input
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div>
                      <Label>Postal Code *</Label>
                      <Input
                        value={shippingAddress.postal_code}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, postal_code: e.target.value }))}
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div>
                      <Label>Country *</Label>
                      <Input
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Phone</Label>
                      <Input
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Total Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-morphism border-white/10 sticky top-24">
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70">Items</span>
                    <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <Separator className="bg-white/10" />
                </div>

                {totals.jestCoin > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-yellow-400" />
                        Jest Coins
                      </span>
                      <span className="font-bold text-yellow-400">
                        {totals.jestCoin.toLocaleString()} JC
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-white/50">
                      <span>Your Balance</span>
                      <span>{walletBalance.toLocaleString()} JC</span>
                    </div>
                    {totals.jestCoin > walletBalance && (
                      <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Insufficient balance
                      </div>
                    )}
                  </div>
                )}

                {totals.money > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-green-400" />
                      USD
                    </span>
                    <span className="font-bold text-green-400">
                      ${totals.money.toFixed(2)}
                    </span>
                  </div>
                )}

                <Separator className="bg-white/10" />

                <Button
                  onClick={processCheckout}
                  disabled={processing || totals.jestCoin > walletBalance}
                  className="w-full"
                  size="lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete Purchase
                    </>
                  )}
                </Button>

                <p className="text-xs text-white/50 text-center">
                  By completing this purchase, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
