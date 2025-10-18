// Tipos compartidos con el backend
export interface Order {
  id: string;
  customer_name: string;
  item: string;
  quantity: number;
  status: OrderStatus;
  created_at: string; // En frontend es string (ISO date)
  updated_at?: string;
}

export type OrderStatus = "pending" | "completed" | "cancelled";

export interface CreateOrderRequest {
  customer_name: string;
  item: string;
  quantity: number;
  status?: OrderStatus;
}

export interface UpdateOrderRequest {
  customer_name?: string;
  item?: string;
  quantity?: number;
  status?: OrderStatus;
}

export interface PaginationQuery {
  page?: number;
  page_size?: number;
  status?: OrderStatus;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface ApiResponse<T = Record<string, never>> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Estados específicos del frontend
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface OrderFormData {
  customer_name: string;
  item: string;
  quantity: number | string;
  status: OrderStatus;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
