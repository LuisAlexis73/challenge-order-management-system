import React, { useState, useEffect } from "react";
import type {
  Order,
  OrderStatus,
  CreateOrderRequest,
  UpdateOrderRequest,
} from "../types/order";

interface OrderFormProps {
  order?: Order | null;
  onSubmit: (data: CreateOrderRequest | UpdateOrderRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  order,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    item: "",
    quantity: "",
    status: "pending" as OrderStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Llenar formulario si estamos editando
  useEffect(() => {
    if (order) {
      setFormData({
        customer_name: order.customer_name,
        item: order.item,
        quantity: order.quantity.toString(),
        status: order.status,
      });
    }
  }, [order]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Customer name is required";
    } else if (formData.customer_name.trim().length < 2) {
      newErrors.customer_name = "Customer name must be at least 2 characters";
    }

    if (!formData.item.trim()) {
      newErrors.item = "Item is required";
    } else if (formData.item.trim().length < 2) {
      newErrors.item = "Item name must be at least 2 characters";
    }

    const quantity = parseInt(formData.quantity);
    if (!formData.quantity || isNaN(quantity) || quantity <= 0) {
      newErrors.quantity = "Quantity must be a positive number";
    } else if (quantity > 10000) {
      newErrors.quantity = "Quantity cannot exceed 10,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      customer_name: formData.customer_name.trim(),
      item: formData.item.trim(),
      quantity: parseInt(formData.quantity),
      status: formData.status,
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-yellow-400 to-orange-500";
      case "completed":
        return "bg-gradient-to-r from-green-400 to-emerald-500";
      case "cancelled":
        return "bg-gradient-to-r from-red-400 to-pink-500";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {order ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            )}
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {order ? "Edit Order" : "Create New Order"}
        </h3>
        <p className="text-gray-600">
          {order
            ? "Update the order details below."
            : "Fill in the details to create a new order."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Name */}
        <div>
          <label
            htmlFor="customer_name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Customer Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="customer_name"
              value={formData.customer_name}
              onChange={(e) =>
                handleInputChange("customer_name", e.target.value)
              }
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                errors.customer_name
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              } focus:outline-none focus:ring-2`}
              placeholder="Enter customer name"
              disabled={loading}
            />
          </div>
          {errors.customer_name && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.customer_name}
            </p>
          )}
        </div>

        {/* Item */}
        <div>
          <label
            htmlFor="item"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Item <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <input
              type="text"
              id="item"
              value={formData.item}
              onChange={(e) => handleInputChange("item", e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                errors.item
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              } focus:outline-none focus:ring-2`}
              placeholder="Enter item name"
              disabled={loading}
            />
          </div>
          {errors.item && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.item}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Quantity <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                />
              </svg>
            </div>
            <input
              type="number"
              id="quantity"
              min="1"
              max="10000"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                errors.quantity
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              } focus:outline-none focus:ring-2`}
              placeholder="Enter quantity"
              disabled={loading}
            />
          </div>
          {errors.quantity && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.quantity}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Status
          </label>
          <div className="relative">
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer"
              disabled={loading}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-500">Preview:</span>
              <span
                className={`inline-flex px-3 py-1 text-xs font-bold rounded-full text-white ${getStatusBadgeClass(formData.status)}`}
              >
                {formData.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 cursor-pointer ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Saving...
              </div>
            ) : order ? (
              "Update Order"
            ) : (
              "Create Order"
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
