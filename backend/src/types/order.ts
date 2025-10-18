export interface Order {
  id: string;
  customer_name: string;
  item: string;
  quantity: number;
  status: OrderStatus;
  created_at: Date;
  updated_at?: Date;
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

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
