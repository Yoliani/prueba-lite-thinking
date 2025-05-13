export interface Company {
  nit: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface CompanyCreate {
  nit: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface CompanyUpdate {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}
