import { pool } from "../config/database";
import {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  PaginationQuery,
  PaginatedResponse,
} from "../types/order";
import { PoolClient } from "pg";

export class OrderRepository {
  // Crear nueva orden
  async create(orderData: CreateOrderRequest): Promise<Order> {
    const client: PoolClient = await pool.connect();
    try {
      const query = `
        INSERT INTO orders (customer_name, item, quantity, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const values = [
        orderData.customer_name,
        orderData.item,
        orderData.quantity,
        orderData.status || "pending",
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Obtener orden por ID
  async findById(id: string): Promise<Order | null> {
    const client: PoolClient = await pool.connect();
    try {
      const query = "SELECT * FROM orders WHERE id = $1";
      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Obtener órdenes paginadas con filtros
  async findAll(params: PaginationQuery): Promise<PaginatedResponse<Order>> {
    const client: PoolClient = await pool.connect();
    try {
      const page = params.page || 1;
      const pageSize = params.page_size || 10;
      const offset = (page - 1) * pageSize;

      // Construir query base
      let baseQuery = "FROM orders";
      let countQuery = "SELECT COUNT(*) ";
      let dataQuery = "SELECT * ";

      const queryParams: any[] = [];
      let whereClause = "";

      // Filtro por status si se proporciona
      if (params.status) {
        whereClause = " WHERE status = $1";
        queryParams.push(params.status);
      }

      // Query para contar total de registros
      const totalResult = await client.query(
        countQuery + baseQuery + whereClause,
        queryParams,
      );
      const totalItems = parseInt(totalResult.rows[0].count);

      // Query para obtener datos paginados
      const dataResult = await client.query(
        dataQuery +
          baseQuery +
          whereClause +
          ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`,
        [...queryParams, pageSize, offset],
      );

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        data: dataResult.rows,
        pagination: {
          current_page: page,
          page_size: pageSize,
          total_items: totalItems,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1,
        },
      };
    } finally {
      client.release();
    }
  }

  // Actualizar orden
  async update(
    id: string,
    updateData: UpdateOrderRequest,
  ): Promise<Order | null> {
    const client: PoolClient = await pool.connect();
    try {
      // Construir query dinámicamente solo con campos proporcionados
      const fields = [];
      const values = [];
      let paramIndex = 1;

      if (updateData.customer_name !== undefined) {
        fields.push(`customer_name = $${paramIndex++}`);
        values.push(updateData.customer_name);
      }
      if (updateData.item !== undefined) {
        fields.push(`item = $${paramIndex++}`);
        values.push(updateData.item);
      }
      if (updateData.quantity !== undefined) {
        fields.push(`quantity = $${paramIndex++}`);
        values.push(updateData.quantity);
      }
      if (updateData.status !== undefined) {
        fields.push(`status = $${paramIndex++}`);
        values.push(updateData.status);
      }

      if (fields.length === 0) {
        throw new Error("No fields to update");
      }

      // Agregar updated_at y el ID
      fields.push(`updated_at = $${paramIndex++}`);
      values.push(new Date());
      values.push(id);

      const query = `
        UPDATE orders
        SET ${fields.join(", ")}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await client.query(query, values);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Eliminar orden
  async delete(id: string): Promise<boolean> {
    const client: PoolClient = await pool.connect();
    try {
      const query = "DELETE FROM orders WHERE id = $1 RETURNING id";
      const result = await client.query(query, [id]);
      return (result.rowCount ?? 0) > 0;
    } finally {
      client.release();
    }
  }

  // Verificar si existe una orden
  async exists(id: string): Promise<boolean> {
    const client: PoolClient = await pool.connect();
    try {
      const query = "SELECT 1 FROM orders WHERE id = $1 LIMIT 1";
      const result = await client.query(query, [id]);
      return (result.rowCount ?? 0) > 0;
    } finally {
      client.release();
    }
  }
}
