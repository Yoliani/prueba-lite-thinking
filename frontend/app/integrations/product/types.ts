export interface Product {
  id: number;
  code: string;
  name: string;
  characteristics: string;
  prices: Record<string, number>; // JSON object with currency as key and price as value
  company_nit: string;
}

export interface ProductCreate {
  code: string;
  name: string;
  characteristics: string;
  prices: Record<string, number>;
  company_nit: string;
}

export interface ProductUpdate {
  name?: string;
  characteristics?: string;
  prices?: Record<string, number>;
  company_nit?: string;
}
