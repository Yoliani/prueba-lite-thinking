import type { AppClient } from "../index";
import type { Company, CompanyCreate, CompanyUpdate } from "./types";

export default class CompanyService {
  private client: AppClient;

  constructor(client: AppClient) {
    this.client = client;
  }

  getCompanies = async (): Promise<Company[]> => {
    const response = await this.client.api.get<Company[]>("/companies");
    return response.data;
  };

  getCompany = async (nit: string): Promise<Company> => {
    const response = await this.client.api.get<Company>(`/companies/${nit}`);
    return response.data;
  };

  createCompany = async (data: CompanyCreate): Promise<Company> => {
    const response = await this.client.api.post<Company>("/companies", data);
    return response.data;
  };

  updateCompany = async (
    nit: string,
    data: CompanyUpdate
  ): Promise<Company> => {
    const response = await this.client.api.put<Company>(
      `/companies/${nit}`,
      data
    );
    return response.data;
  };

  deleteCompany = async (nit: string): Promise<void> => {
    await this.client.api.delete(`/companies/${nit}`);
  };
}
