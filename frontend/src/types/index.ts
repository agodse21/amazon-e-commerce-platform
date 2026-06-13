// ─── Categories ──────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  parentId?: number;
  children?: Category[];
  _count?: { products: number };
}

// ─── Products ─────────────────────────────────────────────────────────────────
export interface ProductImage {
  id: number;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductSpecification {
  id: number;
  key: string;
  value: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  price: string;
  originalPrice?: string;
  stock: number;
  ratingAvg: string;
  ratingCount: number;
  category: { id: number; name: string; slug: string };
  images: ProductImage[];
}

export interface Product extends ProductSummary {
  description?: string;
  specifications: ProductSpecification[];
  isActive: boolean;
  createdAt: string;
}

export interface PaginatedProducts {
  items: ProductSummary[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  product: ProductSummary;
}

export interface Cart {
  id: string;
  sessionId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: string;
  product: ProductSummary;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: string;
  tax: string;
  shippingCost: string;
  total: string;
  shippingAddress: ShippingAddress;
  sessionId: string;
  createdAt: string;
  items: OrderItem[];
}

// ─── API Response Wrapper ─────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
