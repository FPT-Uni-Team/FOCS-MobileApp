import { MenuItem } from "../menu/menu";

export interface CartItem {
  menu_item_id: string;
  variants: VariantSelection[];
  quantity: number;
  note: string;
}

export interface VariantSelection {
  variant_id: string;
  quantity: number;
}

export interface TableCart {
  tableId: string;
  actorId: string;
}

export type SubmitPayload = {
  menu_item_id: string;
  variant_ids: string[];
  quantity: number;
  note: string;
};

export type CartItemType = MenuItem & {
  quantity: number;
  note: string;
  selectedVariants?: VariantSelection[];
};

export interface VariantCheckout {
  variant_id: string;
  quantity: number;
}

export interface CheckoutItem {
  menuItemId: string;
  variants: VariantCheckout[];
  quantity: number;
  note: string;
}

export interface CheckoutRequest {
  store_id: string;
  table_id: string;
  items: CheckoutItem[];
  note?: string;
  coupon_code?: string;
  point?: number;
  is_use_point?: boolean;
  DiscountResult?: any;
  customerInfo?: CustomerInfo;
}

export interface CheckoutResponse {
  total_discount: number;
  total_price: number;
  applied_coupon_code?: string;
  applied_promotions: string[];
  item_discount_details: ItemDiscountDetail[];
  messages: string[];
  is_discount_applied: boolean;
  order_code: string | null;
}

export interface ItemDiscountDetail {
  item_code: string;
  item_name: string;
  quantity: number;
  discount_amount: number;
  source: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface OrderRequest {
  store_id: string;
  table_id: string;
  items: CheckoutItem[];
  note: string;
  coupon_code: string;
  customer_info: CustomerInfo;
  is_use_point: boolean;
  point: number;
  discount: CheckoutResponse;
  payment_type: number;
  order_type: number;
  actorId?: string;
}

export type OrderRequestPayment = {
  order_code: number;
  amount: number;
  description?: string;
  items?: string;
};

export interface LocalStorageCart {
  items: CartItem[];
  lastUpdated: string;
  tableId: string;
}
