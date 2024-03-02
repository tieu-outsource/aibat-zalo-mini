import { Product, Variant } from "./product";

export type SelectedOptions = Record<string, string | string[]>;

export interface CartItem {
  product: Product;
  variant: Variant;
  quantity: number;
}

export type Cart = CartItem[];
