import API_ENDPOINTS from "~/config/api";
import type { AppClient } from "../index";
import { ChatResponse } from "./types";

export default class ChatService {
  private client: AppClient;

  constructor(client: AppClient) {
    this.client = client;
  }
  sendMessage = async (message: string): Promise<ChatResponse> => {
    const response = await this.client.api.post<ChatResponse>(
      API_ENDPOINTS.CHAT.BASE,
      {
        query: message,
      }
    );
    return response.data;
  };

  getRecommendations = async (query: string): Promise<ChatResponse> => {
    const response = await this.client.api.post<ChatResponse>(
      API_ENDPOINTS.CHAT.BASE,
      {
        query: `Recommend products for: ${query}`,
      }
    );
    return response.data;
  };
}
