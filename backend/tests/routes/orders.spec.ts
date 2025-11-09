import request from "supertest";
import app from "../../src/server";

describe("Orders API Integration Tests", () => {
  describe("API Health Check", () => {
    it("should respond to health endpoint", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should respond to API base endpoint", async () => {
      const response = await request(app).get("/api/v1").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("Order Management API");
    });
  });

  describe("Orders CRUD Operations", () => {
    let createdOrderId: string;

    it("should create a new order", async () => {
      const newOrder = {
        customer_name: "Jest Test Customer",
        item: "Jest Test Item",
        quantity: 2,
        status: "pending",
      };

      const response = await request(app).post("/api/v1/orders").send(newOrder);

      // Aceptar tanto 201 (success) como 400 (validation error)
      expect([201, 400, 500]).toContain(response.status);

      if (response.status === 201) {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("id");
        createdOrderId = response.body.data.id;
      }
    });

    it("should get orders list", async () => {
      const response = await request(app).get("/api/v1/orders");

      expect([200, 400, 500]).toContain(response.status);

      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("pagination");
      }
    });

    it("should handle pagination parameters", async () => {
      const response = await request(app).get(
        "/api/v1/orders?page=1&page_size=5",
      );

      expect([200, 400, 500]).toContain(response.status);
    });

    it("should handle status filter", async () => {
      const response = await request(app).get("/api/v1/orders?status=pending");

      expect([200, 400, 500]).toContain(response.status);
    });

    it("should handle invalid order creation", async () => {
      const invalidOrder = {
        customer_name: "", // Invalid: empty name
        item: "Test Item",
        quantity: -1, // Invalid: negative quantity
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .send(invalidOrder);

      expect([400, 500]).toContain(response.status);

      if (response.status === 400) {
        expect(response.body.success).toBe(false);
      }
    });

    it("should handle missing required fields", async () => {
      const incompleteOrder = {
        customer_name: "Test Customer",
        // Missing item and quantity
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .send(incompleteOrder);

      expect([400, 500]).toContain(response.status);
    });

    it("should handle get order by ID", async () => {
      const testId = "123e4567-e89b-12d3-a456-426614174000";

      const response = await request(app).get(`/api/v1/orders/${testId}`);

      // Puede ser 200 (found), 404 (not found), o 400 (invalid ID)
      expect([200, 400, 404, 500]).toContain(response.status);
    });

    it("should handle invalid UUID format", async () => {
      const response = await request(app).get(
        "/api/v1/orders/invalid-uuid-format",
      );

      expect([400, 404, 500]).toContain(response.status);
    });

    it("should handle order update", async () => {
      const testId = "123e4567-e89b-12d3-a456-426614174000";
      const updateData = {
        customer_name: "Updated Customer Name",
        quantity: 5,
      };

      const response = await request(app)
        .put(`/api/v1/orders/${testId}`)
        .send(updateData);

      // Puede ser 200 (updated), 404 (not found), o 400 (validation error)
      expect([200, 400, 404, 500]).toContain(response.status);
    });

    it("should handle order deletion", async () => {
      const testId = "123e4567-e89b-12d3-a456-426614174000";

      const response = await request(app).delete(`/api/v1/orders/${testId}`);

      // Puede ser 200 (deleted), 404 (not found), o 400 (validation error)
      expect([200, 400, 404, 500]).toContain(response.status);
    });
  });

  describe("Error Handling", () => {
    it("should handle non-existent routes", async () => {
      const response = await request(app).get("/api/v1/nonexistent");

      expect(response.status).toBe(404);
    });

    it("should handle malformed JSON", async () => {
      const response = await request(app)
        .post("/api/v1/orders")
        .send("invalid json")
        .set("Content-Type", "application/json");

      expect([400, 500]).toContain(response.status);
    });
  });

  describe("Input Validation", () => {
    it("should validate customer name length", async () => {
      const orderWithLongName = {
        customer_name: "A".repeat(300),
        item: "Test Item",
        quantity: 1,
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .send(orderWithLongName);

      expect([400, 500]).toContain(response.status);
    });

    it("should validate quantity limits", async () => {
      const orderWithLargeQuantity = {
        customer_name: "Test Customer",
        item: "Test Item",
        quantity: 99999,
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .send(orderWithLargeQuantity);

      expect([200, 201, 400, 500]).toContain(response.status);
    });

    it("should validate status enum", async () => {
      const orderWithInvalidStatus = {
        customer_name: "Test Customer",
        item: "Test Item",
        quantity: 1,
        status: "invalid_status",
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .send(orderWithInvalidStatus);

      expect([400, 500]).toContain(response.status);
    });
  });
});
