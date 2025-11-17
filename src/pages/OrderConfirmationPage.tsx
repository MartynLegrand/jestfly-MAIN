import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Loader2, Package, Mail } from 'lucide-react';
import { StoreOrder, OrderItem } from '@/types/store';

const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const { data: orderData, error: orderError } = await supabase
          .from('store_orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;

        const { data: itemsData, error: itemsError } = await supabase
          .from('store_order_items')
          .select('*')
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        setOrder(orderData);
        setOrderItems(itemsData || []);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-400" size={48} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="glass-morphism max-w-md">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Order Not Found</h2>
            <p className="text-white/60 mb-6">
              We couldn't find the order you're looking for.
            </p>
            <Link to="/store">
              <Button>Back to Store</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-600/20 mb-6">
            <CheckCircle className="text-green-400" size={48} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-white/70 mb-2">
            Thank you for your purchase
          </p>
          <p className="text-white/60">
            Order #{order.order_number}
          </p>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Confirmation Message */}
          <Card className="glass-morphism">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Mail className="text-purple-400 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    Confirmation Email Sent
                  </h3>
                  <p className="text-white/70">
                    We've sent a confirmation email to <strong>{order.email}</strong> with
                    your order details and tracking information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Information */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package size={24} />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-white/70 mb-2">Order Number</h4>
                  <p className="text-white">{order.order_number}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/70 mb-2">Order Date</h4>
                  <p className="text-white">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/70 mb-2">Order Status</h4>
                  <p className="text-white capitalize">{order.status}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/70 mb-2">Payment Status</h4>
                  <p className="text-white capitalize">{order.payment_status}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold text-white/70 mb-2">Shipping Address</h4>
                {order.shipping_address && (
                  <p className="text-white">
                    {(order.shipping_address as any).name}<br />
                    {(order.shipping_address as any).line1}<br />
                    {(order.shipping_address as any).line2 && (
                      <>{(order.shipping_address as any).line2}<br /></>
                    )}
                    {(order.shipping_address as any).city}, {(order.shipping_address as any).state}{' '}
                    {(order.shipping_address as any).postal_code}<br />
                    {(order.shipping_address as any).country}
                  </p>
                )}
              </div>

              {order.customer_notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold text-white/70 mb-2">Order Notes</h4>
                    <p className="text-white">{order.customer_notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b border-white/10 last:border-0"
                  >
                    <div>
                      <h4 className="font-semibold text-white">{item.product_name}</h4>
                      {item.product_sku && (
                        <p className="text-sm text-white/60">SKU: {item.product_sku}</p>
                      )}
                      <p className="text-sm text-white/60">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{formatPrice(item.subtotal)}</p>
                      <p className="text-sm text-white/60">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-purple-400">{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link to="/store" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Link to="/profile" className="flex-1">
              <Button size="lg" className="w-full">
                View Order History
              </Button>
            </Link>
          </div>

          {/* Help Section */}
          <Card className="glass-morphism">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-white mb-2">Need Help?</h3>
              <p className="text-white/70 mb-4">
                If you have any questions about your order, please contact our support team.
              </p>
              <Button variant="outline">Contact Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
