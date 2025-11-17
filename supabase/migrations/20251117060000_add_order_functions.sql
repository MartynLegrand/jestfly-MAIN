/*
  # Add Order Management Functions
  
  1. Functions
    - decrement_product_stock: Safely decrement product stock
    - generate_order_number: Generate unique order numbers
  
  2. Security
    - Functions are security definer to allow stock updates
    - Only authenticated users can create orders
*/

-- Function to decrement product stock
CREATE OR REPLACE FUNCTION decrement_product_stock(product_id UUID, quantity INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE store_products
  SET stock_quantity = GREATEST(0, stock_quantity - quantity)
  WHERE id = product_id;
END;
$$;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  date_str TEXT;
  random_num TEXT;
  order_num TEXT;
BEGIN
  date_str := TO_CHAR(NOW(), 'YYYYMMDD');
  random_num := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  order_num := 'ORD-' || date_str || '-' || random_num;
  RETURN order_num;
END;
$$;

-- Add trigger to auto-generate order numbers if not provided
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_order_number_trigger ON store_orders;
CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON store_orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();
