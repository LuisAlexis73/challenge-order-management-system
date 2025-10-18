import React from "react";
import type { Order, OrderStatus } from "../types/order";

interface OrderDetailsProps {
  order: Order;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  onEdit,
  onDelete,
}) => {
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

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "completed":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "cancelled":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete this order for ${order.customer_name}?`,
      )
    ) {
      onDelete?.();
    }
  };

  return (
    <div className="p-6 mt-60">
      {/* Header with Order Status */}
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Details</h3>
        <div className="bg-gray-50 rounded-xl p-3 inline-block">
          <p className="text-sm text-gray-500 font-medium">Order ID</p>
          <p className="font-mono text-gray-900 text-lg">{order.id}</p>
        </div>
      </div>

      {/* Order Information Cards */}
      <div className="space-y-6">
        {/* Customer Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-500 rounded-full p-2">
              <svg
                className="w-5 h-5 text-white"
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
            <h4 className="text-lg font-semibold text-gray-900">
              Customer Information
            </h4>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {order.customer_name}
          </p>
        </div>

        {/* Product Information */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-500 rounded-full p-2">
              <svg
                className="w-5 h-5 text-white"
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
            <h4 className="text-lg font-semibold text-gray-900">
              Product Details
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Item Name
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {order.item}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Quantity
              </label>
              <div className="bg-purple-100 text-purple-800 rounded-full px-4 py-2 text-lg font-bold inline-block">
                {order.quantity}
              </div>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`rounded-full p-2 text-white ${getStatusBadgeClass(order.status)}`}
            >
              {getStatusIcon(order.status)}
            </div>
            <h4 className="text-lg font-semibold text-gray-900">
              Order Status
            </h4>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full text-white shadow-lg ${getStatusBadgeClass(order.status)}`}
            >
              {getStatusIcon(order.status)}
              {order.status.toUpperCase()}
            </span>
            <div className="text-sm text-gray-600">
              {order.status === "pending" && "Order is being processed"}
              {order.status === "completed" && "Order has been fulfilled"}
              {order.status === "cancelled" && "Order has been cancelled"}
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500 rounded-full p-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Created At</h4>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {formatDate(order.created_at)}
            </p>
          </div>

          {order.updated_at && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-orange-500 rounded-full p-2">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">Last Updated</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {formatDate(order.updated_at)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className="flex gap-4 pt-8 border-t border-gray-200 mt-8">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Order
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Order
            </button>
          )}
        </div>
      )}
    </div>
  );
};
