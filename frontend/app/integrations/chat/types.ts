export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  message: string;
  recommendations?: {
    products?: {
      id: number;
      name: string;
      code: string;
      characteristics: string;
      score: number;
    }[];
    companies?: {
      nit: string;
      name: string;
      score: number;
    }[];
  };
}
