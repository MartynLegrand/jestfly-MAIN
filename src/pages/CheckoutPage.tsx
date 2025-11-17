import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, CreditCard, Wallet, ShoppingBag } from 'lucide-react';
import { Address, CheckoutData } from '@/types/store';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart, loading: cartLoading } = useCart();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userEmail, setUserEmail] = useState('');

  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'USA',
    phone: '',
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'USA',
    phone: '',
  });

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'jestcoin'>('stripe');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>('standard');
  const [couponCode, setCouponCode] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  const shippingCosts = {
    standard: 5.99,
    express: 14.99,
    overnight: 24.99,
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = shippingCosts[shippingMethod];
  const discount = 0; // TODO: Implement coupon logic
  const total = subtotal + tax + shipping - discount;

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 && !cartLoading) {
      navigate('/store');
      toast.error('Your cart is empty');
    }
  }, [cartItems, cartLoading, navigate]);

  useEffect(() => {
    if (useSameAddress) {
      setBillingAddress(shippingAddress);
    }
  }, [useSameAddress, shippingAddress]);

  const handleShippingAddressChange = (field: keyof Address, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleBillingAddressChange = (field: keyof Address, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!userEmail || !shippingAddress.name || !shippingAddress.line1 || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.postal_code) {
      toast.error('Please fill in all required shipping information');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!useSameAddress) {
      if (!billingAddress.name || !billingAddress.line1 || 
          !billingAddress.city || !billingAddress.state || !billingAddress.postal_code) {
        toast.error('Please fill in all required billing information');
        return false;
      }
    }
    return true;
  };

  const generateOrderNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${dateStr}-${random}`;
  };

  const createOrder = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      const orderNumber = generateOrderNumber();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('store_orders')
        .insert({
          order_number: orderNumber,
          user_id: user?.id,
          email: userEmail,
          status: 'pending',
          payment_status: 'pending',
          payment_method: paymentMethod,
          subtotal,
          tax,
          shipping,
          discount,
          total,
          currency: 'USD',
          shipping_address: shippingAddress,
          billing_address: useSameAddress ? shippingAddress : billingAddress,
          customer_notes: customerNotes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product?.name || 'Unknown Product',
        product_sku: item.product?.sku,
        quantity: item.quantity,
        price: item.price_snapshot,
        subtotal: item.price_snapshot * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('store_order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update product stock
      for (const item of cartItems) {
        if (item.product?.track_inventory) {
          const { error: stockError } = await supabase.rpc('decrement_product_stock', {
            product_id: item.product_id,
            quantity: item.quantity,
          });
          if (stockError) console.error('Stock update error:', stockError);
        }
      }

      // Clear cart
      await clearCart();

      toast.success('Order placed successfully!');
      navigate(`/store/order-confirmation/${order.id}`);
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'stripe') {
      // TODO: Integrate with Stripe
      toast.info('Stripe integration coming soon. Creating order as pending payment...');
      await createOrder();
    } else if (paymentMethod === 'jestcoin') {
      // TODO: Implement Jest Coin payment
      toast.info('Jest Coin payment coming soon. Creating order as pending payment...');
      await createOrder();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (cartLoading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <Loader2 className="animate-spin mx-auto mb-4" size={48} />
        <p className="text-white/60">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-white">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map(step => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  currentStep >= step
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-20 h-1 mx-2 transition-colors ${
                    currentStep > step ? 'bg-purple-600' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="ship-name">Full Name *</Label>
                    <Input
                      id="ship-name"
                      value={shippingAddress.name}
                      onChange={(e) => handleShippingAddressChange('name', e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="ship-line1">Address Line 1 *</Label>
                    <Input
                      id="ship-line1"
                      value={shippingAddress.line1}
                      onChange={(e) => handleShippingAddressChange('line1', e.target.value)}
                      placeholder="123 Main St"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="ship-line2">Address Line 2</Label>
                    <Input
                      id="ship-line2"
                      value={shippingAddress.line2}
                      onChange={(e) => handleShippingAddressChange('line2', e.target.value)}
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ship-city">City *</Label>
                      <Input
                        id="ship-city"
                        value={shippingAddress.city}
                        onChange={(e) => handleShippingAddressChange('city', e.target.value)}
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ship-state">State *</Label>
                      <Input
                        id="ship-state"
                        value={shippingAddress.state}
                        onChange={(e) => handleShippingAddressChange('state', e.target.value)}
                        placeholder="NY"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ship-postal">Postal Code *</Label>
                      <Input
                        id="ship-postal"
                        value={shippingAddress.postal_code}
                        onChange={(e) => handleShippingAddressChange('postal_code', e.target.value)}
                        placeholder="10001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ship-phone">Phone</Label>
                      <Input
                        id="ship-phone"
                        value={shippingAddress.phone}
                        onChange={(e) => handleShippingAddressChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Label className="text-lg mb-4 block">Shipping Method</Label>
                    <RadioGroup value={shippingMethod} onValueChange={(val: any) => setShippingMethod(val)}>
                      <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg mb-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="font-normal cursor-pointer">
                            Standard Shipping (5-7 business days)
                          </Label>
                        </div>
                        <span className="text-white">{formatPrice(shippingCosts.standard)}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg mb-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="font-normal cursor-pointer">
                            Express Shipping (2-3 business days)
                          </Label>
                        </div>
                        <span className="text-white">{formatPrice(shippingCosts.express)}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="overnight" id="overnight" />
                          <Label htmlFor="overnight" className="font-normal cursor-pointer">
                            Overnight Shipping (1 business day)
                          </Label>
                        </div>
                        <span className="text-white">{formatPrice(shippingCosts.overnight)}</span>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    onClick={() => {
                      if (validateStep1()) setCurrentStep(2);
                    }}
                    className="w-full"
                    size="lg"
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="same-address"
                      checked={useSameAddress}
                      onChange={(e) => setUseSameAddress(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="same-address" className="font-normal cursor-pointer">
                      Billing address same as shipping
                    </Label>
                  </div>

                  {!useSameAddress && (
                    <div className="space-y-4 p-4 border border-white/10 rounded-lg">
                      <h3 className="font-semibold">Billing Address</h3>
                      <div>
                        <Label htmlFor="bill-name">Full Name *</Label>
                        <Input
                          id="bill-name"
                          value={billingAddress.name}
                          onChange={(e) => handleBillingAddressChange('name', e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="bill-line1">Address Line 1 *</Label>
                        <Input
                          id="bill-line1"
                          value={billingAddress.line1}
                          onChange={(e) => handleBillingAddressChange('line1', e.target.value)}
                          placeholder="123 Main St"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bill-city">City *</Label>
                          <Input
                            id="bill-city"
                            value={billingAddress.city}
                            onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                            placeholder="New York"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="bill-state">State *</Label>
                          <Input
                            id="bill-state"
                            value={billingAddress.state}
                            onChange={(e) => handleBillingAddressChange('state', e.target.value)}
                            placeholder="NY"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bill-postal">Postal Code *</Label>
                        <Input
                          id="bill-postal"
                          value={billingAddress.postal_code}
                          onChange={(e) => handleBillingAddressChange('postal_code', e.target.value)}
                          placeholder="10001"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Label className="text-lg mb-4 block">Payment Method</Label>
                    <RadioGroup value={paymentMethod} onValueChange={(val: any) => setPaymentMethod(val)}>
                      <div className="flex items-center space-x-2 p-4 border border-white/10 rounded-lg mb-2">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe" className="font-normal cursor-pointer flex items-center">
                          <CreditCard className="mr-2" size={18} />
                          Credit/Debit Card (via Stripe)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border border-white/10 rounded-lg">
                        <RadioGroupItem value="jestcoin" id="jestcoin" />
                        <Label htmlFor="jestcoin" className="font-normal cursor-pointer flex items-center">
                          <Wallet className="mr-2" size={18} />
                          Jest Coin
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Input
                      id="notes"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="Any special instructions for your order"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="flex-1"
                      size="lg"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => {
                        if (validateStep2()) setCurrentStep(3);
                      }}
                      className="flex-1"
                      size="lg"
                    >
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review & Place Order */}
            {currentStep === 3 && (
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Review Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-white/70">
                      {shippingAddress.name}<br />
                      {shippingAddress.line1}<br />
                      {shippingAddress.line2 && <>{shippingAddress.line2}<br /></>}
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}<br />
                      {shippingAddress.phone}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <p className="text-white/70">
                      {paymentMethod === 'stripe' ? 'Credit/Debit Card' : 'Jest Coin'}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Items</h3>
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between py-2 text-white/70">
                        <span>{item.product?.name} × {item.quantity}</span>
                        <span>{formatPrice(item.price_snapshot * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      variant="outline"
                      className="flex-1"
                      size="lg"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-1"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={18} />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="mr-2" size={18} />
                          Place Order
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-morphism sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-white/70">
                        {item.product?.name} × {item.quantity}
                      </span>
                      <span className="text-white">
                        {formatPrice(item.price_snapshot * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Subtotal</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Shipping</span>
                    <span className="text-white">{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Tax</span>
                    <span className="text-white">{formatPrice(tax)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-purple-400">{formatPrice(total)}</span>
                </div>

                <div className="pt-4">
                  <Label htmlFor="coupon">Coupon Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                    />
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
