import axios, { AxiosError, type AxiosResponse } from "axios";
import type {
  ApiError,
  ApiResponse,
  CreateOrderRequest,
  Order,
  PaginatedResponse,
  PaginationQuery,
  UpdateOrderRequest,
} from "../types/order";

const API_BASE_URL = "http://localhost:3000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleApiError = (error: AxiosError): never => {
  const apiError: ApiError = {
    message: "An unexpected error occurred",
    status: error.response?.status,
  };

  if (error.response?.data && typeof error.response.data === "object") {
    const errorData = error.response.data as {
      error?: string;
      message?: string;
    };
    apiError.message = errorData.error || errorData.message || apiError.message;
  } else if (error.message) {
    apiError.message = error.message;
  }

  throw new Error(apiError.message);
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export class OrdersAPI {
  static async getOrders(
    params: PaginationQuery = {},
  ): Promise<PaginatedResponse<Order>> {
    try {
      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<Order>>
      >("/orders", { params });

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || "Failed to fetch orders");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleApiError(error);
      }
      throw error;
    }
  }

  static async getOrderById(id: string): Promise<Order> {
    try {
      const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || "Failed to fetch order");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleApiError(error);
      }
      throw error;
    }
  }

  static async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      const response = await apiClient.post<ApiResponse<Order>>(
        "/orders",
        orderData,
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || "Failed to create order");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleApiError(error);
      }
      throw error;
    }
  }

  static async updateOrder(
    id: string,
    updateData: UpdateOrderRequest,
  ): Promise<Order> {
    try {
      const response = await apiClient.put<ApiResponse<Order>>(
        `/orders/${id}`,
        updateData,
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || "Failed to update order");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleApiError(error);
      }
      throw error;
    }
  }

  static async deleteOrder(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<
        ApiResponse<Record<string, never>>
      >(`/orders/${id}`);

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to delete order");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleApiError(error);
      }
      throw error;
    }
  }
}

export default OrdersAPI;
