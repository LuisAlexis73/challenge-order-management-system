import { Router } from "express";
import { OrderController } from "../controllers/oreder.controller";

const router = Router();
const orderController = new OrderController();

/**
 * @route   GET /api/v1/orders
 * @desc    Get paginated list of orders
 * @access  Public
 * @query   ?page=1&page_size=10&status=pending
 */
router.get("/", orderController.getOrders);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get order by ID
 * @access  Public
 */
router.get("/:id", orderController.getOrderById);

/**
 * @route   POST /api/v1/orders
 * @desc    Create new order
 * @access  Public
 * @body    { customer_name, item, quantity, status? }
 */
router.post("/", orderController.createOrder);

/**
 * @route   PUT /api/v1/orders/:id
 * @desc    Update order by ID
 * @access  Public
 * @body    { customer_name?, item?, quantity?, status? }
 */
router.put("/:id", orderController.updateOrder);

/**
 * @route   DELETE /api/v1/orders/:id
 * @desc    Delete order by ID
 * @access  Public
 */
router.delete("/:id", orderController.deleteOrder);

export default router;
