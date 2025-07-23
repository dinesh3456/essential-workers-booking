import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "@/types/auth.types";

// Base API URL - this should come from environment variables
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api/v1";

// API client with basic configuration
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T }> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      // In a real app, you'd want more sophisticated error handling
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<{ data: T }> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<{ data: T }> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<{ data: T }> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<{ data: T }> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Auth service
export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<{ data: AuthResponse }> {
    try {
      return await apiClient.post<AuthResponse>("/auth/login", credentials);
    } catch (error) {
      // For development, return mock data
      if (process.env.NODE_ENV === "development") {
        // Mock successful login for development
        const mockResponse: AuthResponse = {
          user: {
            id: "1",
            firstName: credentials.email.split("@")[0],
            lastName: "User",
            email: credentials.email,
            role: "client",
            isVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: "mock-jwt-token-" + Date.now(),
        };
        return { data: mockResponse };
      }
      throw error;
    }
  },

  // Register user
  async register(userData: RegisterData): Promise<{ data: AuthResponse }> {
    try {
      return await apiClient.post<AuthResponse>("/auth/register", userData);
    } catch (error) {
      // For development, return mock data
      if (process.env.NODE_ENV === "development") {
        const mockResponse: AuthResponse = {
          user: {
            id: "1",
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: userData.role || "client",
            isVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: "mock-jwt-token-" + Date.now(),
        };
        return { data: mockResponse };
      }
      throw error;
    }
  },

  // Get current user
  async getCurrentUser(): Promise<{ data: User }> {
    try {
      return await apiClient.get<User>("/auth/me");
    } catch (error) {
      // For development, return mock data
      if (process.env.NODE_ENV === "development") {
        const mockUser: User = {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          role: "client",
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { data: mockUser };
      }
      throw error;
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      // Even if the API call fails, we should clear local storage
      console.warn("Logout API call failed, but clearing local storage");
    } finally {
      localStorage.removeItem("token");
    }
  },

  // Refresh token
  async refreshToken(): Promise<{ data: { token: string } }> {
    try {
      return await apiClient.post<{ token: string }>("/auth/refresh");
    } catch (error) {
      // If refresh fails, user needs to login again
      localStorage.removeItem("token");
      throw error;
    }
  },
};
