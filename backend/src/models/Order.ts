import { OrderStatus } from "../types/order";

export class Order {
  public id: string;
  public customer_name: string;
  public item: string;
  public quantity: number;
  public status: OrderStatus;
  public created_at: Date;
  public updated_at?: Date;

  constructor(data: {
    id: string;
    customer_name: string;
    item: string;
    quantity: number;
    status: OrderStatus;
    created_at: Date;
    updated_at?: Date;
  }) {
    this.id = data.id;
    this.customer_name = data.customer_name;
    this.item = data.item;
    this.quantity = data.quantity;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Métodos de negocio de la entidad
  public isCompleted(): boolean {
    return this.status === "completed";
  }

  public isPending(): boolean {
    return this.status === "pending";
  }

  public isCancelled(): boolean {
    return this.status === "cancelled";
  }

  public canBeModified(): boolean {
    return this.status !== "completed";
  }

  public markAsCompleted(): void {
    if (this.status === "cancelled") {
      throw new Error("Cannot complete a cancelled order");
    }
    this.status = "completed";
    this.updated_at = new Date();
  }

  public cancel(): void {
    if (this.status === "completed") {
      throw new Error("Cannot cancel a completed order");
    }
    this.status = "cancelled";
    this.updated_at = new Date();
  }

  // Validaciones de la entidad
  public validate(): void {
    if (!this.customer_name || this.customer_name.trim().length === 0) {
      throw new Error("Customer name is required");
    }

    if (!this.item || this.item.trim().length === 0) {
      throw new Error("Item is required");
    }

    if (this.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    if (!["pending", "completed", "cancelled"].includes(this.status)) {
      throw new Error("Invalid order status");
    }
  }

  // Convertir a objeto plano para API responses
  public toJSON(): object {
    return {
      id: this.id,
      customer_name: this.customer_name,
      item: this.item,
      quantity: this.quantity,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Factory method para crear desde datos de BD
  static fromDatabase(row: any): Order {
    return new Order({
      id: row.id,
      customer_name: row.customer_name,
      item: row.item,
      quantity: row.quantity,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  }

  // Factory method para crear nueva orden
  static create(data: {
    customer_name: string;
    item: string;
    quantity: number;
    status?: OrderStatus;
  }): Order {
    const order = new Order({
      id: "", // Se asignará en el repository
      customer_name: data.customer_name.trim(),
      item: data.item.trim(),
      quantity: data.quantity,
      status: data.status || "pending",
      created_at: new Date(),
    });

    order.validate();
    return order;
  }
}
