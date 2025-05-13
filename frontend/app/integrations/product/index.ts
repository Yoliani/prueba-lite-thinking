import { AppClient } from "..";
import { Product, ProductCreate, ProductUpdate } from "./types";

class ProductService {
  private client: AppClient;

  constructor(client: AppClient) {
    this.client = client;
  }

  getProducts = async (): Promise<Product[]> => {
    const response = await this.client.api.get<Product[]>("/products");
    return response.data;
  };

  getProduct = async (id: number): Promise<Product> => {
    const response = await this.client.api.get<Product>(`/products/${id}`);
    return response.data;
  };

  getProductsByCompany = async (companyNit: string): Promise<Product[]> => {
    const response = await this.client.api.get<Product[]>(
      `/products/company/${companyNit}`
    );
    return response.data;
  };

  createProduct = async (data: ProductCreate): Promise<Product> => {
    const response = await this.client.api.post<Product>("/products", data);
    return response.data;
  };

  updateProduct = async (id: number, data: ProductUpdate): Promise<Product> => {
    const response = await this.client.api.put<Product>(
      `/products/${id}`,
      data
    );
    return response.data;
  };

  deleteProduct = async (id: number): Promise<void> => {
    await this.client.api.delete(`/products/${id}`);
  };
}

export default ProductService;
