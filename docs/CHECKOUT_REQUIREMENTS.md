# Checkout & Payment Integration Requirements
**JestFly Platform - Agent 4 Deliverable**

This document outlines the requirements for implementing the complete checkout flow and payment integration.

---

## Current State

### ✅ Implemented
- Product catalog with categories
- Product detail pages
- Shopping cart functionality
- Add to cart / Remove from cart
- Cart quantity adjustment
- Cart persistence (Supabase)
- Database tables: `store_orders`, `store_order_items`

### ❌ Missing (Critical)
- Checkout page
- Address collection (shipping/billing)
- Shipping options and rates
- Payment processing
- Order creation pipeline
- Order confirmation emails
- Order tracking for customers
- Admin order management dashboard
- Coupon/discount system
- Tax calculation

---

## Checkout Flow Requirements

### User Journey

```
Cart → Checkout → Address → Shipping → Payment → Confirmation
```

#### Step 1: Cart Review
- Display all cart items
- Show individual prices
- Show subtotal
- "Proceed to Checkout" button
- Continue shopping link
- Empty cart handling

#### Step 2: Customer Information
- Email address (for guest checkout)
- Option to login/register
- Save info for future purchases

#### Step 3: Shipping Address
- Full name
- Address line 1
- Address line 2 (optional)
- City
- State/Province
- ZIP/Postal Code
- Country
- Phone number
- Address validation

#### Step 4: Billing Address
- Same as shipping checkbox
- Or separate billing form
- Validation

#### Step 5: Shipping Method
- Standard shipping ($X, 5-7 days)
- Express shipping ($Y, 2-3 days)
- Overnight shipping ($Z, next day)
- Display estimated delivery date
- Calculate based on address

#### Step 6: Payment
- Payment method selection:
  - Credit/Debit Card (Stripe)
  - Jest Coins (if enabled and sufficient balance)
  - Hybrid (partial Jest Coins + Card)
- Stripe Elements integration
- Payment form validation
- PCI compliance

#### Step 7: Order Review
- All order details
- Edit links for each section
- Terms & conditions checkbox
- "Place Order" button
- Order total breakdown:
  - Subtotal
  - Shipping
  - Tax
  - Discount (if any)
  - **Total**

#### Step 8: Confirmation
- Order number
- Order details
- Delivery estimate
- Payment confirmation
- Email sent confirmation
- Track order link
- Continue shopping button

---

## Technical Requirements

### Frontend Components

#### `/src/pages/CheckoutPage.tsx`
Main checkout orchestrator
- Multi-step form
- Progress indicator
- Step navigation
- Data persistence between steps
- Error handling
- Loading states

#### `/src/components/checkout/CartSummary.tsx`
- Display cart items
- Show prices and quantities
- Calculate subtotal
- Update on changes

#### `/src/components/checkout/AddressForm.tsx`
- Shipping address fields
- Billing address fields
- Form validation
- Address autocomplete (optional)
- Country/state dropdowns

#### `/src/components/checkout/ShippingOptions.tsx`
- Radio button selection
- Shipping cost display
- Delivery estimate
- Update total on change

#### `/src/components/checkout/PaymentForm.tsx`
- Stripe Elements integration
- Card input fields
- Jest Coin balance display
- Payment method toggle
- Validation
- Security badges

#### `/src/components/checkout/OrderReview.tsx`
- Complete order summary
- Edit buttons for each section
- Price breakdown
- Terms acceptance
- Place order CTA

#### `/src/components/checkout/OrderConfirmation.tsx`
- Success message
- Order details
- Next steps
- Download invoice option

### Backend Services

#### `/src/services/orderService.ts`

```typescript
interface OrderService {
  // Create order from cart
  createOrder(userId: string, orderData: OrderData): Promise<Order>;
  
  // Get user orders
  getUserOrders(userId: string): Promise<Order[]>;
  
  // Get specific order
  getOrder(orderId: string): Promise<Order>;
  
  // Update order status
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
  
  // Cancel order
  cancelOrder(orderId: string, reason: string): Promise<void>;
  
  // Calculate order total
  calculateOrderTotal(cartItems: CartItem[], shipping: number, tax: number, discount?: number): number;
}
```

#### `/src/services/paymentService.ts`

```typescript
interface PaymentService {
  // Create Stripe payment intent
  createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent>;
  
  // Process card payment
  processCardPayment(paymentMethodId: string, amount: number): Promise<PaymentResult>;
  
  // Process Jest Coin payment
  processJestCoinPayment(userId: string, amount: number): Promise<PaymentResult>;
  
  // Process hybrid payment
  processHybridPayment(userId: string, jestCoins: number, cardAmount: number): Promise<PaymentResult>;
  
  // Verify payment
  verifyPayment(paymentIntentId: string): Promise<boolean>;
  
  // Refund payment
  refundPayment(paymentId: string, amount?: number): Promise<RefundResult>;
}
```

#### `/src/services/shippingService.ts`

```typescript
interface ShippingService {
  // Calculate shipping rates
  calculateShipping(address: Address, items: CartItem[]): Promise<ShippingOption[]>;
  
  // Validate address
  validateAddress(address: Address): Promise<AddressValidation>;
  
  // Get estimated delivery
  getDeliveryEstimate(shippingMethod: string, address: Address): Promise<DeliveryEstimate>;
}
```

#### `/src/services/emailService.ts`

```typescript
interface EmailService {
  // Send order confirmation
  sendOrderConfirmation(order: Order, userEmail: string): Promise<void>;
  
  // Send shipping notification
  sendShippingNotification(order: Order, tracking: string): Promise<void>;
  
  // Send order status update
  sendOrderStatusUpdate(order: Order, status: string): Promise<void>;
}
```

---

## Database Schema

### Tables Already Exist ✅

#### `store_orders`
```sql
- id: UUID
- user_id: UUID
- order_number: TEXT (unique)
- status: order_status_enum
- payment_status: payment_status_enum
- shipping_address: JSONB
- billing_address: JSONB
- subtotal: DECIMAL
- tax: DECIMAL
- shipping_cost: DECIMAL
- discount: DECIMAL
- total: DECIMAL
- items_count: INTEGER
- customer_notes: TEXT
- admin_notes: TEXT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### `store_order_items`
```sql
- id: UUID
- order_id: UUID (FK)
- product_id: UUID (FK)
- quantity: INTEGER
- price_at_purchase: DECIMAL
- subtotal: DECIMAL
- product_snapshot: JSONB
```

### Additional Tables Needed

#### `discount_codes` (Optional)
```sql
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'percentage' or 'fixed'
  value DECIMAL NOT NULL,
  min_purchase DECIMAL,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `shipping_rates` (Optional - if not using API)
```sql
CREATE TABLE shipping_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  base_rate DECIMAL NOT NULL,
  per_item_rate DECIMAL,
  delivery_days_min INTEGER,
  delivery_days_max INTEGER,
  is_active BOOLEAN DEFAULT true
);
```

---

## Payment Integration

### Stripe Setup

#### 1. Install Stripe SDK
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

#### 2. Environment Variables
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### 3. Stripe Elements Component
```tsx
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}
```

#### 4. Payment Processing
```typescript
const stripe = useStripe();
const elements = useElements();

// Create payment intent
const { clientSecret } = await createPaymentIntent(totalAmount);

// Confirm payment
const { error } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: elements.getElement(CardElement),
    billing_details: { /* ... */ }
  }
});
```

### Jest Coin Payment

#### Check Balance
```typescript
const { data: wallet } = await supabase
  .from('user_wallets')
  .select('balance')
  .eq('user_id', userId)
  .single();

if (wallet.balance < totalJestCoins) {
  throw new Error('Insufficient Jest Coins');
}
```

#### Deduct Balance
```typescript
const { error } = await supabase.rpc('deduct_jest_coins', {
  user_id: userId,
  amount: totalJestCoins
});
```

### Hybrid Payment

1. Calculate Jest Coin portion
2. Calculate remaining amount
3. Process Jest Coin deduction
4. Process card payment for remaining
5. Create transaction records for both

---

## Order Management (Admin)

### Admin Order Dashboard

#### Features Required
- List all orders
- Filter by status (pending, processing, completed, cancelled)
- Search by order number, customer name/email
- View order details
- Update order status
- Add tracking information
- Print invoice/packing slip
- Refund order
- Export orders (CSV)

#### Component Structure
```
/src/components/admin/orders/
  ├── OrderList.tsx
  ├── OrderFilters.tsx
  ├── OrderDetails.tsx
  ├── OrderStatusSelect.tsx
  ├── AddTrackingDialog.tsx
  ├── RefundDialog.tsx
  └── OrderInvoice.tsx
```

---

## Email Templates

### Order Confirmation
```
Subject: Order Confirmation #ORD-20251117-0001

Thank you for your order!

Order Details:
- Order Number: ORD-20251117-0001
- Date: November 17, 2025
- Total: $XX.XX

Items:
- Product 1 x 2 = $XX.XX
- Product 2 x 1 = $XX.XX

Shipping Address:
[Full address]

Tracking:
Your order will ship within 1-2 business days.
You'll receive tracking info via email.

[Track Your Order Button]
```

### Shipping Notification
```
Subject: Your Order Has Shipped!

Your order #ORD-20251117-0001 is on its way!

Tracking Number: XXXXXXXXXXXX
Carrier: USPS/UPS/FedEx

[Track Package Button]

Expected Delivery: Nov 20-22, 2025
```

---

## Testing Requirements

### Unit Tests
- Address validation
- Price calculations
- Shipping calculations
- Tax calculations
- Discount code validation
- Order creation logic

### Integration Tests
- Complete checkout flow
- Payment processing (test mode)
- Order creation in database
- Email sending
- Cart clearing after order

### E2E Tests
```typescript
// Example Playwright test
test('complete checkout', async ({ page }) => {
  await page.goto('/store');
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="cart-icon"]');
  await page.click('[data-testid="checkout-button"]');
  
  // Fill address
  await page.fill('[name="fullName"]', 'John Doe');
  await page.fill('[name="address"]', '123 Main St');
  // ... more fields
  
  // Select shipping
  await page.click('[data-testid="standard-shipping"]');
  
  // Enter payment (use Stripe test cards)
  await page.fill('[name="cardNumber"]', '4242424242424242');
  await page.fill('[name="expiry"]', '12/25');
  await page.fill('[name="cvc"]', '123');
  
  // Place order
  await page.click('[data-testid="place-order"]');
  
  // Verify confirmation
  await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
});
```

---

## Implementation Plan

### Phase 1: Core Checkout (3 days)
- [ ] Create CheckoutPage component
- [ ] Implement address forms
- [ ] Add shipping options
- [ ] Build order review
- [ ] Create order confirmation page

### Phase 2: Payment Integration (2 days)
- [ ] Set up Stripe
- [ ] Implement card payment
- [ ] Add Jest Coin payment
- [ ] Build hybrid payment
- [ ] Handle payment errors

### Phase 3: Order Processing (2 days)
- [ ] Order creation service
- [ ] Email notifications
- [ ] Admin order dashboard
- [ ] Order status updates
- [ ] Refund functionality

### Phase 4: Testing (2 days)
- [ ] Write unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Manual QA
- [ ] Fix bugs

**Total Estimated Time:** 9 days

---

## Success Criteria

- [ ] User can complete full checkout flow
- [ ] Payments process successfully (test mode)
- [ ] Orders created in database
- [ ] Confirmation emails sent
- [ ] Admin can view and manage orders
- [ ] All tests pass
- [ ] Mobile responsive
- [ ] Accessibility compliant
- [ ] Error handling robust
- [ ] Performance acceptable (< 3s page load)

---

## Dependencies

**Required Before Implementation:**
- Stripe account (test mode)
- Email service configured (SendGrid/similar)
- Environment variables set
- Database migrations applied

**Blocked By This:**
- NFT checkout integration (Agent 5)
- Revenue analytics (Agent 8)
- Order fulfillment workflow

---

**Status:** Requirements Defined  
**Ready for Development:** Yes (after environment setup)  
**Priority:** 🔴 CRITICAL  
**Last Updated:** November 17, 2025  
**Agent:** 4 (Commerce & Checkout Finisher)
