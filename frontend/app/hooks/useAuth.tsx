import * as React from "react";
import { UserResponse } from "../integrations/auth/types";
import { appClient } from "~/integrations";

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<UserResponse>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      // Check if user is already stored
      const storedUser = appClient.authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      } else if (appClient.authService.isAuthenticated()) {
        // If token exists but no user, fetch user data
        try {
          const userData = await appClient.authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          appClient.authService.logout();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await appClient.authService.login({ username: email, password });
      const userData = await appClient.authService.getCurrentUser();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    appClient.authService.logout();
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    const user = await appClient.authService.register({ email, password });
    return user;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
