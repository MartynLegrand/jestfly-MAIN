import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, Package, Eye, Edit, RefreshCw } from 'lucide-react';
import { StoreOrder, OrderItem, OrderStatus, PaymentStatus } from '@/types/store';

const OrderManager = () => {
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<OrderStatus>('pending');
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>('pending');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('store_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('store_order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;
      setOrderItems(data || []);
    } catch (error: any) {
      console.error('Error fetching order items:', error);
    }
  };

  const handleViewOrder = async (order: StoreOrder) => {
    setSelectedOrder(order);
    await fetchOrderItems(order.id);
    setIsDetailOpen(true);
  };

  const handleEditOrder = (order: StoreOrder) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditPaymentStatus(order.payment_status);
    setAdminNotes(order.admin_notes || '');
    setIsEditOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      const { error } = await supabase
        .from('store_orders')
        .update({
          status: editStatus,
          payment_status: editPaymentStatus,
          admin_notes: adminNotes,
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      toast.success('Order updated successfully');
      setIsEditOpen(false);
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeColor = (status: OrderStatus) => {
    const colors = {
      pending: 'bg-yellow-600',
      processing: 'bg-blue-600',
      completed: 'bg-green-600',
      cancelled: 'bg-red-600',
      refunded: 'bg-gray-600',
    };
    return colors[status] || 'bg-gray-600';
  };

  const getPaymentStatusBadgeColor = (status: PaymentStatus) => {
    const colors = {
      pending: 'bg-yellow-600',
      paid: 'bg-green-600',
      failed: 'bg-red-600',
      refunded: 'bg-gray-600',
    };
    return colors[status] || 'bg-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          <RefreshCw className="mr-2" size={16} />
          Refresh
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="glass-morphism">
          <CardContent className="p-12 text-center">
            <Package size={48} className="mx-auto mb-4 text-white/40" />
            <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-white/60">Orders will appear here once customers make purchases.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="glass-morphism hover:border-purple-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <p className="text-sm text-white/60">Order Number</p>
                    <p className="font-semibold text-white">{order.order_number}</p>
                    <p className="text-xs text-white/40 mt-1">{formatDate(order.created_at)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-white/60">Customer</p>
                    <p className="text-white">{order.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-white/60">Total</p>
                    <p className="font-bold text-purple-400">{formatPrice(order.total)}</p>
                  </div>

                  <div className="space-y-2">
                    <Badge className={getStatusBadgeColor(order.status)}>
                      {order.status}
                    </Badge>
                    <Badge className={getPaymentStatusBadgeColor(order.payment_status)}>
                      {order.payment_status}
                    </Badge>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditOrder(order)}
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl glass-morphism">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Order Number</Label>
                  <p className="font-semibold">{selectedOrder.order_number}</p>
                </div>
                <div>
                  <Label className="text-white/60">Order Date</Label>
                  <p>{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div>
                  <Label className="text-white/60">Status</Label>
                  <Badge className={getStatusBadgeColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-white/60">Payment Status</Label>
                  <Badge className={getPaymentStatusBadgeColor(selectedOrder.payment_status)}>
                    {selectedOrder.payment_status}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-white/60">Customer Information</Label>
                <p className="mt-2">{selectedOrder.email}</p>
              </div>

              <div>
                <Label className="text-white/60">Shipping Address</Label>
                {selectedOrder.shipping_address && (
                  <div className="mt-2 text-white/80">
                    <p>{(selectedOrder.shipping_address as any).name}</p>
                    <p>{(selectedOrder.shipping_address as any).line1}</p>
                    {(selectedOrder.shipping_address as any).line2 && (
                      <p>{(selectedOrder.shipping_address as any).line2}</p>
                    )}
                    <p>
                      {(selectedOrder.shipping_address as any).city},{' '}
                      {(selectedOrder.shipping_address as any).state}{' '}
                      {(selectedOrder.shipping_address as any).postal_code}
                    </p>
                    {(selectedOrder.shipping_address as any).phone && (
                      <p>{(selectedOrder.shipping_address as any).phone}</p>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <Label className="text-white/60">Order Items</Label>
                <div className="mt-2 space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 border-b border-white/10">
                      <div>
                        <p className="font-semibold">{item.product_name}</p>
                        {item.product_sku && (
                          <p className="text-sm text-white/60">SKU: {item.product_sku}</p>
                        )}
                        <p className="text-sm text-white/60">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                        <p className="text-sm text-white/60">{formatPrice(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Shipping</span>
                  <span>{formatPrice(selectedOrder.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Tax</span>
                  <span>{formatPrice(selectedOrder.tax)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-purple-400">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {selectedOrder.customer_notes && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-white/60">Customer Notes</Label>
                    <p className="mt-2 text-white/80">{selectedOrder.customer_notes}</p>
                  </div>
                </>
              )}

              {selectedOrder.admin_notes && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-white/60">Admin Notes</Label>
                    <p className="mt-2 text-white/80">{selectedOrder.admin_notes}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="glass-morphism">
          <DialogHeader>
            <DialogTitle>Update Order</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <Label>Order Number</Label>
                <p className="text-white/80">{selectedOrder.order_number}</p>
              </div>

              <div>
                <Label htmlFor="order-status">Order Status</Label>
                <Select value={editStatus} onValueChange={(val: OrderStatus) => setEditStatus(val)}>
                  <SelectTrigger id="order-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment-status">Payment Status</Label>
                <Select value={editPaymentStatus} onValueChange={(val: PaymentStatus) => setEditPaymentStatus(val)}>
                  <SelectTrigger id="payment-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="admin-notes">Admin Notes</Label>
                <Input
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal notes about this order"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => setIsEditOpen(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleUpdateOrder} className="flex-1">
                  Update Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManager;
