import { Product, Variant } from "./product";

export type SelectedOptions = Record<string, string> // e.g. { color: "red", size: "large" }

export interface CartItem {
  product: Product;
  variant: Variant;
  quantity: number;
  selectedOptions: SelectedOptions;
}

export type Cart = CartItem[];
