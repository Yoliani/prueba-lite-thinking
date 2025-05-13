import API_ENDPOINTS from "~/config/api";
import type { AppClient } from "../index";
import {
  AuthResponse,
  UserResponse,
  LoginRequest,
  RegisterRequest,
} from "./types";
import Cookies from "js-cookie";

const TOKEN_COOKIE_NAME = "token";
const USER_COOKIE_NAME = "user";

export default class AuthService {
  private client: AppClient;

  constructor(client: AppClient) {
    this.client = client;
  }
  login = async (data: LoginRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    const response = await this.client.api.post<AuthResponse>(
      "/auth/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Save token in cookie
    Cookies.set(TOKEN_COOKIE_NAME, response.data.access_token, { expires: 1 }); // 1 day

    // Get user info
    await this.getCurrentUser();

    return response.data;
  };

  register = async (data: RegisterRequest) => {
    const response = await this.client.api.post<UserResponse>(
      "/auth/register",
      {
        email: data.email,
        password: data.password,
      }
    );
    return response.data;
  };

  registerAdmin = async (data: RegisterRequest) => {
    const response = await this.client.api.post<UserResponse>(
      "/auth/register-admin",
      {
        email: data.email,
        password: data.password,
      }
    );
    return response.data;
  };

  getCurrentUser = async (): Promise<UserResponse | null> => {
    try {
      const response = await this.client.api.get<UserResponse>("/auth/me");
      const user = response.data;

      // Save user in cookie
      Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), { expires: 1 });

      return user;
    } catch (error) {
      return null;
    }
  };

  getStoredUser = (): UserResponse | null => {
    const userStr = Cookies.get(USER_COOKIE_NAME);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  isAuthenticated = (): boolean => {
    return !!Cookies.get(TOKEN_COOKIE_NAME);
  };

  isAdmin = (): boolean => {
    const user = this.getStoredUser();
    return user?.role === "admin";
  };

  logout = () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
    Cookies.remove(USER_COOKIE_NAME);
    window.location.href = "/login";
  };
}
