import { OrderRepository } from "../repositories/order.repository";
import {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  PaginationQuery,
  PaginatedResponse,
} from "../types/order";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  // Crear nueva orden
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    // Validaciones de negocio
    this.validateOrderData(orderData);

    try {
      const order = await this.orderRepository.create(orderData);
      console.log(`Order created: ${order.id}`);
      return order;
    } catch (error) {
      console.error("❌ Error creating order:", error);
      throw new Error("Failed to create order");
    }
  }

  // Obtener orden por ID
  async getOrderById(id: string): Promise<Order> {
    this.validateUUID(id);

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }

    return order;
  }

  // Obtener órdenes paginadas
  async getOrders(params: PaginationQuery): Promise<PaginatedResponse<Order>> {
    // Validar parámetros de paginación
    this.validatePaginationParams(params);

    try {
      return await this.orderRepository.findAll(params);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      throw new Error("Failed to fetch orders");
    }
  }

  // Actualizar orden
  async updateOrder(
    id: string,
    updateData: UpdateOrderRequest,
  ): Promise<Order> {
    this.validateUUID(id);
    this.validateUpdateData(updateData);

    // Verificar que la orden existe
    const exists = await this.orderRepository.exists(id);
    if (!exists) {
      throw new Error(`Order with ID ${id} not found`);
    }

    try {
      const updatedOrder = await this.orderRepository.update(id, updateData);
      if (!updatedOrder) {
        throw new Error("Failed to update order");
      }
      console.log(`Order updated: ${id}`);
      return updatedOrder;
    } catch (error) {
      console.error("❌ Error updating order:", error);
      throw new Error("Failed to update order");
    }
  }

  // Eliminar orden
  async deleteOrder(id: string): Promise<void> {
    this.validateUUID(id);

    // Verificar que la orden existe
    const exists = await this.orderRepository.exists(id);
    if (!exists) {
      throw new Error(`Order with ID ${id} not found`);
    }

    try {
      const deleted = await this.orderRepository.delete(id);
      if (!deleted) {
        throw new Error("Failed to delete order");
      }
      console.log(`Order deleted: ${id}`);
    } catch (error) {
      console.error("❌ Error deleting order:", error);
      throw new Error("Failed to delete order");
    }
  }

  // Validaciones privadas
  private validateOrderData(data: CreateOrderRequest): void {
    if (!data.customer_name || data.customer_name.trim().length === 0) {
      throw new Error("Customer name is required");
    }

    if (data.customer_name.length > 255) {
      throw new Error("Customer name must be less than 255 characters");
    }

    if (!data.item || data.item.trim().length === 0) {
      throw new Error("Item is required");
    }

    if (data.item.length > 255) {
      throw new Error("Item name must be less than 255 characters");
    }

    if (!data.quantity || data.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    if (data.quantity > 10000) {
      throw new Error("Quantity cannot exceed 10,000");
    }

    if (
      data.status &&
      !["pending", "completed", "cancelled"].includes(data.status)
    ) {
      throw new Error(
        "Invalid status. Must be: pending, completed, or cancelled",
      );
    }
  }

  private validateUpdateData(data: UpdateOrderRequest): void {
    if (Object.keys(data).length === 0) {
      throw new Error("At least one field must be provided for update");
    }

    if (data.customer_name !== undefined) {
      if (!data.customer_name || data.customer_name.trim().length === 0) {
        throw new Error("Customer name cannot be empty");
      }
      if (data.customer_name.length > 255) {
        throw new Error("Customer name must be less than 255 characters");
      }
    }

    if (data.item !== undefined) {
      if (!data.item || data.item.trim().length === 0) {
        throw new Error("Item name cannot be empty");
      }
      if (data.item.length > 255) {
        throw new Error("Item name must be less than 255 characters");
      }
    }

    if (
      data.quantity !== undefined &&
      (data.quantity <= 0 || data.quantity > 10000)
    ) {
      throw new Error("Quantity must be between 1 and 10,000");
    }

    if (
      data.status &&
      !["pending", "completed", "cancelled"].includes(data.status)
    ) {
      throw new Error(
        "Invalid status. Must be: pending, completed, or cancelled",
      );
    }
  }

  private validateUUID(id: string): void {
    if (!id) {
      throw new Error("ID is required");
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error("Invalid UUID format");
    }
  }

  private validatePaginationParams(params: PaginationQuery): void {
    if (params.page !== undefined && params.page < 1) {
      throw new Error("Page must be greater than 0");
    }

    if (params.page_size !== undefined) {
      if (params.page_size < 1 || params.page_size > 100) {
        throw new Error("Page size must be between 1 and 100");
      }
    }

    if (
      params.status &&
      !["pending", "completed", "cancelled"].includes(params.status)
    ) {
      throw new Error(
        "Invalid status filter. Must be: pending, completed, or cancelled",
      );
    }
  }
}
