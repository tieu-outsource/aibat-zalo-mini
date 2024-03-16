export interface OrderHistoryItem {
  id: number;
  code: string;
  address: string;
  price: number;
  statusOrder: number;
  createdAt: Date;
  title: string;
  image?: string;
}
