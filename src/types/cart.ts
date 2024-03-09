import { Product, Variant } from "./product";

export type SelectedOptions = Record<string, string> // e.g. { color: "red", size: "large" }

export interface CartItem {
  product: Product;
  variant: Variant;
  quantity: number;
  selectedOptions: SelectedOptions;
}

export type CreateOrderPayload = {
  phone: string;
  name: string;
  address: string;
  note: string;
  items: {
    variantId: number;
    quantity: number;
  }[]
}

export type Cart = CartItem[];
