import { useState } from "react";
import { OrderList } from "./components/OrderList";
import { OrderForm } from "./components/OrderForm";
import { OrderDetails } from "./components/OrderDetails";
import { Modal } from "./components/Modal";
import { Notification } from "./components/Notification";
import { useOrders } from "./hooks/useOrders";
import { useNotification } from "./hooks/useNotification";
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
} from "./types/order";
import "./index.css";

type ViewMode = "list" | "create" | "edit" | "details";

function App() {
  const {
    createOrder,
    updateOrder,
    deleteOrder,
    loading,
    fetchOrders,
    orders,
  } = useOrders();
  const { notification, hideNotification, showSuccess, showError } =
    useNotification();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handlers para cambiar vistas
  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setViewMode("create");
    setIsModalOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewMode("edit");
    setIsModalOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewMode("details");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setViewMode("list");
  };

  // Handler para crear orden
  const handleSubmitCreate = async (data: CreateOrderRequest) => {
    try {
      const newOrder = await createOrder(data);
      showSuccess(
        `Order created successfully for ${newOrder.customer_name}! 🎉`,
      );
      await fetchOrders();
      handleCloseModal();
    } catch (error) {
      showError("Failed to create order. Please try again.");
      console.error("Failed to create order:", error);
    }
  };

  // Handler para actualizar orden
  const handleSubmitUpdate = async (data: UpdateOrderRequest) => {
    if (!selectedOrder) return;

    try {
      const updatedOrder = await updateOrder(selectedOrder.id, data);
      showSuccess(
        `Order updated successfully for ${updatedOrder.customer_name}! ✅`,
      );
      await fetchOrders();
      handleCloseModal();
    } catch (error) {
      showError("Failed to update order. Please try again.");
      console.error("Failed to update order:", error);
    }
  };

  // Handler para eliminar orden
  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      showSuccess("Order deleted successfully! 🗑️");
      await fetchOrders();
      handleCloseModal();
    } catch (error) {
      showError("Failed to delete order. Please try again.");
      console.error("Failed to delete order:", error);
    }
  };

  // Renderizar contenido del modal
  const renderModalContent = () => {
    switch (viewMode) {
      case "create":
        return (
          <OrderForm
            onSubmit={handleSubmitCreate}
            onCancel={handleCloseModal}
            loading={loading}
          />
        );

      case "edit":
        return (
          <OrderForm
            order={selectedOrder}
            onSubmit={handleSubmitUpdate}
            onCancel={handleCloseModal}
            loading={loading}
          />
        );

      case "details":
        return selectedOrder ? (
          <OrderDetails
            order={selectedOrder}
            onEdit={() => setViewMode("edit")}
            onDelete={() => handleDeleteOrder(selectedOrder.id)}
            onClose={handleCloseModal}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-xl border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-3 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
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

              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Order Management System
              </h1>
            </div>

            {/* Create Order Button */}
            <button
              onClick={handleCreateOrder}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 cursor-pointer"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              New Order
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderList
          orders={orders}
          onOrderSelect={handleViewOrder}
          onEditOrder={handleEditOrder}
        />
      </main>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size={viewMode === "details" ? "lg" : "md"}
      >
        {renderModalContent()}
      </Modal>

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-semibold">Order Management System</span>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>
                By | <strong>Luis Alexis Galarza</strong>{" "}
              </p>
              <div className="flex items-center justify-center gap-4 mt-2">
                <a
                  href="https://www.linkedin.com/in/luis-alexis-galarza"
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs transform hover:scale-105 transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="icon icon-tabler icons-tabler-filled icon-tabler-brand-linkedin"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M17 2a5 5 0 0 1 5 5v10a5 5 0 0 1 -5 5h-10a5 5 0 0 1 -5 -5v-10a5 5 0 0 1 5 -5zm-9 8a1 1 0 0 0 -1 1v5a1 1 0 0 0 2 0v-5a1 1 0 0 0 -1 -1m6 0a3 3 0 0 0 -1.168 .236l-.125 .057a1 1 0 0 0 -1.707 .707v5a1 1 0 0 0 2 0v-3a1 1 0 0 1 2 0v3a1 1 0 0 0 2 0v-3a3 3 0 0 0 -3 -3m-6 -3a1 1 0 0 0 -.993 .883l-.007 .127a1 1 0 0 0 1.993 .117l.007 -.127a1 1 0 0 0 -1 -1" />
                  </svg>
                </a>
                <a
                  href="https://ag-porfolio.vercel.app/"
                  className="bg-gray-800 text-white px-2 py-1 rounded text-xs transform hover:scale-105 transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="icon icon-tabler icons-tabler-filled icon-tabler-briefcase"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M22 13.478v4.522a3 3 0 0 1 -3 3h-14a3 3 0 0 1 -3 -3v-4.522l.553 .277a20.999 20.999 0 0 0 18.897 -.002l.55 -.275zm-8 -11.478a3 3 0 0 1 3 3v1h2a3 3 0 0 1 3 3v2.242l-1.447 .724a19.002 19.002 0 0 1 -16.726 .186l-.647 -.32l-1.18 -.59v-2.242a3 3 0 0 1 3 -3h2v-1a3 3 0 0 1 3 -3h4zm-2 8a1 1 0 0 0 -1 1a1 1 0 1 0 2 .01c0 -.562 -.448 -1.01 -1 -1.01zm2 -6h-4a1 1 0 0 0 -1 1v1h6v-1a1 1 0 0 0 -1 -1z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/LuisAlexis73"
                  className="bg-blue-800 text-white px-2 py-1 rounded text-xs transform hover:scale-105 transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="icon icon-tabler icons-tabler-filled icon-tabler-brand-github"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5.315 2.1c.791 -.113 1.9 .145 3.333 .966l.272 .161l.16 .1l.397 -.083a13.3 13.3 0 0 1 4.59 -.08l.456 .08l.396 .083l.161 -.1c1.385 -.84 2.487 -1.17 3.322 -1.148l.164 .008l.147 .017l.076 .014l.05 .011l.144 .047a1 1 0 0 1 .53 .514a5.2 5.2 0 0 1 .397 2.91l-.047 .267l-.046 .196l.123 .163c.574 .795 .93 1.728 1.03 2.707l.023 .295l.007 .272c0 3.855 -1.659 5.883 -4.644 6.68l-.245 .061l-.132 .029l.014 .161l.008 .157l.004 .365l-.002 .213l-.003 3.834a1 1 0 0 1 -.883 .993l-.117 .007h-6a1 1 0 0 1 -.993 -.883l-.007 -.117v-.734c-1.818 .26 -3.03 -.424 -4.11 -1.878l-.535 -.766c-.28 -.396 -.455 -.579 -.589 -.644l-.048 -.019a1 1 0 0 1 .564 -1.918c.642 .188 1.074 .568 1.57 1.239l.538 .769c.76 1.079 1.36 1.459 2.609 1.191l.001 -.678l-.018 -.168a5.03 5.03 0 0 1 -.021 -.824l.017 -.185l.019 -.12l-.108 -.024c-2.976 -.71 -4.703 -2.573 -4.875 -6.139l-.01 -.31l-.004 -.292a5.6 5.6 0 0 1 .908 -3.051l.152 -.222l.122 -.163l-.045 -.196a5.2 5.2 0 0 1 .145 -2.642l.1 -.282l.106 -.253a1 1 0 0 1 .529 -.514l.144 -.047l.154 -.03z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
