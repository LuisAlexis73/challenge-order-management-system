import React, { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import type { Order, OrderStatus } from "../types/order";
import { Pagination } from "./Pagination";
import { Loading } from "./Loading";

interface OrderListProps {
  onOrderSelect?: (order: Order) => void;
  onEditOrder?: (order: Order) => void;
}

export const OrderList: React.FC<OrderListProps> = ({
  onOrderSelect,
  onEditOrder,
}) => {
  const {
    orders,
    pagination,
    loading,
    error,
    fetchOrders,
    deleteOrder,
    clearError,
  } = useOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleStatusFilter = async (status: OrderStatus | "") => {
    setStatusFilter(status);
    setCurrentPage(1);
    await fetchOrders({
      page: 1,
      page_size: 10,
      status: status || undefined,
    });
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchOrders({
      page,
      page_size: 10,
      status: statusFilter || undefined,
    });
  };

  const handleDeleteOrder = async (order: Order) => {
    if (
      window.confirm(
        `Are you sure you want to delete order for ${order.customer_name}?`,
      )
    ) {
      try {
        await deleteOrder(order.id);
      } catch (error) {
        console.error("Failed to delete order:", error);
      }
    }
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md";
      case "completed":
        return "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md";
      case "cancelled":
        return "bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-md";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && orders.length === 0) {
    return <Loading message="Loading orders..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header Mejorado */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Order Dashboard</h2>
            <p className="text-blue-100 text-lg">
              Manage and track all your orders efficiently
            </p>
            <div className="flex items-center gap-6 mt-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm text-blue-100">Total Orders</span>
                <div className="text-2xl font-bold">
                  {pagination?.total_items || 0}
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm text-blue-100">Current Page</span>
                <div className="text-2xl font-bold">
                  {pagination?.current_page || 1}
                </div>
              </div>
            </div>
          </div>

          {/* Filtro Mejorado */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-blue-100 mb-2"
            >
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) =>
                handleStatusFilter(e.target.value as OrderStatus | "")
              }
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-white/50 focus:border-transparent cursor-pointer"
            >
              <option value="" className="text-gray-900">
                All Status
              </option>
              <option value="pending" className="text-gray-900">
                Pending
              </option>
              <option value="completed" className="text-gray-900">
                Completed
              </option>
              <option value="cancelled" className="text-gray-900">
                Cancelled
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message Mejorado */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 rounded-full p-2">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 rounded-full p-1 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay Mejorado */}
      {loading && orders.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <p className="text-blue-800 font-medium">Updating orders...</p>
          </div>
        </div>
      )}

      {/* Orders Table Mejorado */}
      {orders.length === 0 && !loading ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-500 mb-6">
            {statusFilter
              ? `No orders with status "${statusFilter}"`
              : "Create your first order to get started."}
          </p>
          <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-gray-600">
              💡 Tip: Use the "+ New Order" button to create your first order
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="bg-gray-100 rounded-lg px-3 py-1 font-mono text-sm text-gray-700">
                          {order.id.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {order.customer_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.customer_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {order.item}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold inline-block">
                          {order.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeClass(order.status)}`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {onOrderSelect && (
                            <button
                              onClick={() => onOrderSelect(order)}
                              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg transition-colors font-medium cursor-pointer"
                            >
                              View
                            </button>
                          )}
                          {onEditOrder && (
                            <button
                              onClick={() => onEditOrder(order)}
                              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-lg transition-colors font-medium cursor-pointer"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteOrder(order)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg transition-colors font-medium cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Mejorado */}
          {pagination && (
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.total_pages}
                hasNext={pagination.has_next}
                hasPrev={pagination.has_prev}
                totalItems={pagination.total_items}
                pageSize={pagination.page_size}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
