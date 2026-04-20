import { Coupon } from "@/types/coupon";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_BASE_URL = 'http://localhost:3000';

export async function getCoupons(): Promise<Coupon[]> {
  try {
    if (!API_BASE_URL) {
      throw new Error("API base URL is undefined");
    }

    const response = await fetch(`${API_BASE_URL}/coupons`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("coupons:", data);
    return data;
  } catch (err) {
    console.error("loadCoupons error:", err);
    throw err;
  }
}

export async function getCouponById(id: string): Promise<Coupon> {
  try {
    if (!API_BASE_URL) {
      throw new Error("API base URL is undefined");
    }

    const response = await fetch(`${API_BASE_URL}/coupons/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("coupon:", data);
    return data;
  } catch (err) {
    console.error("loadCoupon error:", err);
    throw err;
  }
}

export async function getCouponsByStatus(status: 'active' | 'inactive'): Promise<Coupon[]> {
  try {
    if (!API_BASE_URL) {
      throw new Error("API base URL is undefined");
    }

    const response = await fetch(`${API_BASE_URL}/coupons/status/${status}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("coupons by status:", data);
    return data;
  } catch (err) {
    console.error("loadCouponsByStatus error:", err);
    throw err;
  }
}

export async function searchCoupons(query: string): Promise<Coupon[]> {
  try {
    if (!API_BASE_URL) {
      throw new Error("API base URL is undefined");
    }

    const keyword = query.trim();
    const path = keyword
      ? `/coupons/search?q=${encodeURIComponent(keyword)}`
      : "/coupons";

    const response = await fetch(`${API_BASE_URL}${path}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("search coupons:", data);
    return data;
  } catch (err) {
    console.error("searchCoupons error:", err);
    throw err;
  }
}
