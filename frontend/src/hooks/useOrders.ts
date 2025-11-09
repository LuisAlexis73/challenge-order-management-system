import { useState, useEffect, useCallback } from "react";
import OrdersAPI from "../services/api";
import type {
  Order,
  PaginatedResponse,
  PaginationQuery,
  CreateOrderRequest,
  UpdateOrderRequest,
} from "../types/order";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [pagination, setPagination] = useState<
    PaginatedResponse<Order>["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<PaginationQuery>({});

  const fetchOrders = useCallback(async (params: PaginationQuery = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await OrdersAPI.getOrders(params);
      setOrders(result.data);
      setPagination(result.pagination);
      setLastQuery(params);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para refrescar usando los últimos parámetros
  const refreshOrders = useCallback(async () => {
    await fetchOrders(lastQuery);
  }, [fetchOrders, lastQuery]);

  const fetchOrderById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const order = await OrdersAPI.getOrderById(id);
      setCurrentOrder(order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(
    async (orderData: CreateOrderRequest): Promise<Order> => {
      setLoading(true);
      setError(null);

      try {
        const newOrder = await OrdersAPI.createOrder(orderData);

        await refreshOrders();

        console.log("Order created successfully:", newOrder.customer_name);

        return newOrder;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create order");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshOrders],
  );

  const updateOrder = useCallback(
    async (id: string, updateData: UpdateOrderRequest): Promise<Order> => {
      setLoading(true);
      setError(null);

      try {
        const updatedOrder = await OrdersAPI.updateOrder(id, updateData);

        await refreshOrders();

        if (currentOrder?.id === id) {
          setCurrentOrder(updatedOrder);
        }

        console.log("Order updated successfully:", updatedOrder.customer_name);

        return updatedOrder;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update order");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshOrders, currentOrder],
  );

  const deleteOrder = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await OrdersAPI.deleteOrder(id);

        await refreshOrders();

        if (currentOrder?.id === id) {
          setCurrentOrder(null);
        }

        console.log("✅ Order deleted successfully");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete order");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshOrders, currentOrder],
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    currentOrder,
    pagination,
    loading,
    error,
    fetchOrders,
    refreshOrders,
    fetchOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    clearError: () => setError(null),
    clearCurrentOrder: () => setCurrentOrder(null),
  };
};
