import apiClient from "~/services/api-client";
import type { AxiosInstance } from "axios";
import ProductService from "./product";
import CompanyService from "./company";
import InventoryService from "./inventory";
import AuthService from "./auth";
import ChatService from "./chat";

class AppClient {
  private static instance: AppClient;
  api: AxiosInstance;
  productService: ProductService;
  companyService: CompanyService;
  inventoryService: InventoryService;
  authService: AuthService;
  chatService: ChatService;

  constructor() {
    this.api = apiClient;
    this.productService = new ProductService(this);
    this.companyService = new CompanyService(this);
    this.inventoryService = new InventoryService(this);
    this.authService = new AuthService(this);
    this.chatService = new ChatService(this);
  }

  static getInstance(): AppClient {
    if (!AppClient.instance) {
      AppClient.instance = new AppClient();
    }
    return AppClient.instance;
  }

  logger = (
    message: string,
    type: "info" | "error" | "warning" | "success"
  ) => {
    console.log(`[${type.toUpperCase()}]: ${message}`);
  };
}

const appClient = AppClient.getInstance();

export { appClient, AppClient };
