export interface CreateOrderItemDto {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  items: CreateOrderItemDto[];
  customerFullName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  shippingAddress: string;
  shippingDistrict: string;
  shippingCity: string;
  deliveryType: "pickup" | "delivery";
  paymentMethod: "card" | "transfer" | "cash";
  shippingCost: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface Order {
  id: number;
  createdAt: string;
  total: number;
  shippingCost: number;
  status: string;
  customerFullName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  shippingAddress: string;
  shippingDistrict: string;
  shippingCity: string;
  deliveryType: string;
  pickupStoreAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
}
