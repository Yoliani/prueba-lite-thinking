export interface InventoryItem {
  id: number;
  quantity: number;
  product_id: number;
}

export interface InventoryItemDetail extends InventoryItem {
  product: {
    id: number;
    code: string;
    name: string;
    characteristics: string;
    prices: Record<string, number>;
    company_nit: string;
  };
}

export interface InventoryItemCreate {
  quantity: number;
  product_id: number;
}

export interface InventoryItemUpdate {
  quantity?: number;
}
