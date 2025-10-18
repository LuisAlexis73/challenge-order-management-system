import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import {
  CreateOrderRequest,
  UpdateOrderRequest,
  PaginationQuery,
  ApiResponse,
} from "../types/order";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  // GET /orders - Obtener órdenes paginadas
  getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const query: PaginationQuery = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        page_size: req.query.page_size
          ? parseInt(req.query.page_size as string)
          : undefined,
        status: req.query.status as any,
      };

      const result = await this.orderService.getOrders(query);

      const response: ApiResponse = {
        success: true,
        message: "Orders retrieved successfully",
        data: result,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to retrieve orders",
        error: error.message,
      };
      res.status(400).json(response);
    }
  };

  // GET /orders/:id - Obtener orden por ID
  getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(id);

      const response: ApiResponse = {
        success: true,
        message: "Order retrieved successfully",
        data: order,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const status = error.message.includes("not found") ? 404 : 400;
      const response: ApiResponse = {
        success: false,
        message: "Failed to retrieve order",
        error: error.message,
      };
      res.status(status).json(response);
    }
  };

  // POST /orders - Crear nueva orden
  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const orderData: CreateOrderRequest = req.body;
      const order = await this.orderService.createOrder(orderData);

      const response: ApiResponse = {
        success: true,
        message: "Order created successfully",
        data: order,
      };

      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to create order",
        error: error.message,
      };
      res.status(400).json(response);
    }
  };

  // PUT /orders/:id - Actualizar orden
  updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData: UpdateOrderRequest = req.body;

      const order = await this.orderService.updateOrder(id, updateData);

      const response: ApiResponse = {
        success: true,
        message: "Order updated successfully",
        data: order,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const status = error.message.includes("not found") ? 404 : 400;
      const response: ApiResponse = {
        success: false,
        message: "Failed to update order",
        error: error.message,
      };
      res.status(status).json(response);
    }
  };

  // DELETE /orders/:id - Eliminar orden
  deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.orderService.deleteOrder(id);

      const response: ApiResponse = {
        success: true,
        message: "Order deleted successfully",
      };

      res.status(200).json(response);
    } catch (error: any) {
      const status = error.message.includes("not found") ? 404 : 400;
      const response: ApiResponse = {
        success: false,
        message: "Failed to delete order",
        error: error.message,
      };
      res.status(status).json(response);
    }
  };
}
