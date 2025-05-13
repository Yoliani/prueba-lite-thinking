// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REGISTER_ADMIN: `${API_BASE_URL}/auth/register-admin`,
    ME: `${API_BASE_URL}/auth/me`,
  },

  // Companies endpoints
  COMPANIES: {
    BASE: `${API_BASE_URL}/companies`,
    DETAIL: (nit: string) => `${API_BASE_URL}/companies/${nit}`,
  },

  // Products endpoints
  PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
    DETAIL: (id: number) => `${API_BASE_URL}/products/${id}`,
    BY_COMPANY: (companyNit: string) =>
      `${API_BASE_URL}/products/company/${companyNit}`,
  },

  // Inventory endpoints
  INVENTORY: {
    BASE: `${API_BASE_URL}/inventory`,
    DETAIL: (id: number) => `${API_BASE_URL}/inventory/${id}`,
    BY_PRODUCT: (productId: number) =>
      `${API_BASE_URL}/inventory/product/${productId}`,
    DOWNLOAD_REPORT: `${API_BASE_URL}/inventory/report/download`,
    EMAIL_REPORT: `${API_BASE_URL}/inventory/report/email`,
  },

  // Chat endpoints (for AI feature)
  CHAT: {
    BASE: `${API_BASE_URL}/chat`,
    SEND: `${API_BASE_URL}/chat/send`,
  },

  // Health check
  HEALTH: `${API_BASE_URL}/health`,
};

export default API_ENDPOINTS;
