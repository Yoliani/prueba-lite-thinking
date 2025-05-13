import type { AppClient } from "../index";
import type {
  InventoryItem,
  InventoryItemDetail,
  InventoryItemCreate,
  InventoryItemUpdate,
} from "./types";

export default class InventoryService {
  private client: AppClient;

  constructor(client: AppClient) {
    this.client = client;
  }

  getInventoryItems = async (): Promise<InventoryItem[]> => {
    const response = await this.client.api.get<InventoryItem[]>("/inventory");
    return response.data;
  };

  getInventoryItem = async (id: number): Promise<InventoryItemDetail> => {
    const response = await this.client.api.get<InventoryItemDetail>(
      `/inventory/${id}`
    );
    return response.data;
  };

  getInventoryItemsByProduct = async (
    productId: number
  ): Promise<InventoryItem[]> => {
    const response = await this.client.api.get<InventoryItem[]>(
      `/inventory/product/${productId}`
    );
    return response.data;
  };

  createInventoryItem = async (
    data: InventoryItemCreate
  ): Promise<InventoryItem> => {
    const response = await this.client.api.post<InventoryItem>(
      "/inventory",
      data
    );
    return response.data;
  };

  updateInventoryItem = async (
    id: number,
    data: InventoryItemUpdate
  ): Promise<InventoryItem> => {
    const response = await this.client.api.put<InventoryItem>(
      `/inventory/${id}`,
      data
    );
    return response.data;
  };

  deleteInventoryItem = async (id: number): Promise<void> => {
    await this.client.api.delete(`/inventory/${id}`);
  };

  downloadInventoryReport = async (companyNit?: string): Promise<Blob> => {
    const url = companyNit
      ? `/inventory/report/download?company_nit=${companyNit}`
      : "/inventory/report/download";

    const response = await this.client.api.get(url, {
      responseType: "blob",
    });

    return response.data;
  };

  emailInventoryReport = async (
    email: string,
    companyNit?: string
  ): Promise<{ message: string }> => {
    const url = "/inventory/report/email";

    const response = await this.client.api.post<{ message: string }>(url, {
      email,
      company_nit: companyNit,
    });
    return response.data;
  };
}
