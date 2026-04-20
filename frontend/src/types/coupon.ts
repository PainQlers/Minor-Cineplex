export interface Coupon {
  id: string;
  code: string;
  discount_type: 'fixed_amount' | 'fixed_price' | 'bogo' | 'percentage' | 'points_redemption';
  discount_value?: string;
  expiry_date: string;
  usage_limit: number;
  title: string;
  short_description: string;
  benefits?: string[];
  valid_until?: string;
  sales_period?: { start?: string; end?: string };
  terms?: string[];
  image_hint?: string;
  status: 'active' | 'inactive';
  created_at?: string;
}
