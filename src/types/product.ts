export interface PercentSale {
  type: "percent";
  percent: number;
}

export interface FixedSale {
  amount: number;
  type: "fixed";
}

export type Sale = PercentSale | FixedSale;

export interface Option {
  id: string;
  label?: string;
  priceChange?: Sale;
}

export interface BaseVariant {
  id: string;
  label?: string;
  options: Option[];
}

export interface SingleOptionVariant extends BaseVariant {
  type: "single";
  default?: string;
}

export interface MultipleOptionVariant extends BaseVariant {
  type: "multiple";
  default?: string[];
}

export interface Attribute {
  id: string;
  label: string;
  options: {
    id: string;
    label: string;
  }[];
}

export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  categoryId?: string[];
  description?: string;
  sale?: Sale;
}

export interface Variant {
  id: number;
  name: string;
  price: number;
  inStock: number;
  sku: string;
  available: number;
  attributes: {
    name: string;
    value: string;
  }[];
}
