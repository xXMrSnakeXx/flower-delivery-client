export type Shop = {
  _id: string;
  name: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  _id: string;
  shopId: string;
  name: string;
  description?: string;
  priceCents: number;
  imageUrl?: string;
  isBouquet?: boolean;
  createdAt?: string;
};

export type OrderItemInput = {
  productId: string;
  qty: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  priceCents: number;
};

export type CustomerShort = {
  email: string;
  phone: string;
};

export type OrderInput = {
  email: string;
  phone: string;
  address: string;
  shopId: string | string[];
  items: OrderItemInput[];
  customerTimezone: string;
};

export type Order = {
  _id: string;
  customer: { email: string; phone: string };
  shopId: string | string[];
  delivery: { address: string };
  items: OrderItem[];
  totalCents: number;
  status: string;
  createdAt: string;
};

export type CreateOrderResponse = {
  orderIds: string[];
};

export type OrderResponse = {
  orderId: string;
  shop: {
    id: string;
    name: string;
    address: string;
  };
  customer: {
    name?: string;
    email: string;
    phone: string;
  };
  delivery: {
    address: string;
  };
  items: {
    productId: string;
    name: string;
    image: string;
    quantity: number;
    priceCents: number;
    lineTotalCents: number;
  }[];
  totalCents: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  customerTimeZone: string;
};

export type OrdersBulkInfoResponse = {
  orders: OrderResponse[];
  grandTotalCents?: number;
};
export type PrefillResponse = {
  name?: string | null;
  email: string;
  phone: string;
  defaultAddress?: string | null;
  lastSeenAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
} | null;

export type GetProductsOptions = {
  sort?: 'price' | 'date';
  order?: 'asc' | 'desc';
  search?: string;
};

export type OrderItemPayload = {
  productId: string;
  qty: number;
};

export type OrderPayload = {
  name?: string;
  email: string;
  phone: string;
  address: string;
  shopId: string | string[];
  items: OrderItemPayload[];
  customerTimezone: string;
};
