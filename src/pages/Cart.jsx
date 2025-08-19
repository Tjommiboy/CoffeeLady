import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function CustomerCart() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current"); // current, history

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        window.location.href = "/login"; // Redirect to customer login
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to user's orders in real-time
  useEffect(() => {
    if (!user) return;

    const ordersQuery = query(
      collection(db, "orders"),
      where("customerEmail", "==", user.email),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Customer orders:", ordersData);
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Cancel order (only if pending)
  const cancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
        alert("Order cancelled successfully!");
      } catch (error) {
        console.error("Error cancelling order:", error);
        alert("Error cancelling order. Please try again.");
      }
    }
  };

  // Mark order as picked up (when ready)
  const markAsPickedUp = async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "completed",
        completedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown time";
    const date = timestamp.toDate
      ? timestamp.toDate()
      : timestamp.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status info
  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: "⏳",
          message: "Order received - waiting to be prepared",
        };
      case "preparing":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: "👨‍🍳",
          message: "Your order is being prepared",
        };
      case "ready":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: "✅",
          message: "Ready for pickup!",
        };
      case "completed":
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "📦",
          message: "Order completed",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "❓",
          message: "Unknown status",
        };
    }
  };

  // Filter orders based on active tab
  const currentOrders = orders.filter(
    (order) =>
      order.status === "pending" ||
      order.status === "preparing" ||
      order.status === "ready"
  );
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );

  const displayOrders =
    activeTab === "current" ? currentOrders : completedOrders;

  if (!user) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">☕ My Orders</h2>
            <p className="text-gray-700">
              Welcome, <span className="font-medium">{user.email}</span>
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            New Order
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("current")}
            className={`flex-1 px-6 py-3 font-medium ${
              activeTab === "current"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Current Orders ({currentOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-6 py-3 font-medium ${
              activeTab === "history"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Order History ({completedOrders.length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-500">
            {activeTab === "current" ? "No current orders" : "No order history"}
          </p>
          {activeTab === "current" && (
            <button
              onClick={() => (window.location.href = "/Order")}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Place Your First Order
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Order #{order.id.slice(-6)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ordered: {formatTime(order.createdAt)}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg border ${statusInfo.color} flex items-center gap-2`}
                  >
                    <span>{statusInfo.icon}</span>
                    <span className="font-medium">
                      {order.status || "pending"}
                    </span>
                  </div>
                </div>

                {/* Status Message */}
                <div
                  className={`p-3 rounded-lg mb-4 ${statusInfo.color} border`}
                >
                  <p className="text-sm font-medium">{statusInfo.message}</p>
                  {order.status === "ready" && (
                    <p className="text-xs mt-1">
                      Please come to the counter to collect your order
                    </p>
                  )}
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded"
                        >
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <div className="text-sm text-gray-600">
                              Size: {item.size} • Sweetness: {item.sweetness}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">
                              x{item.quantity}
                            </span>
                            <div className="text-sm text-gray-600">
                              ฿{item.totalPrice}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : order.summary ? (
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm whitespace-pre-wrap">
                          {order.summary}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 bg-gray-50 p-3 rounded">
                        No order details available
                      </p>
                    )}
                  </div>
                </div>

                {/* Total */}
                {order.totalPrice && (
                  <div className="flex justify-between items-center mb-4 pt-2 border-t">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">
                      ฿{order.totalPrice}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {order.status === "pending" && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Cancel Order
                    </button>
                  )}

                  {order.status === "ready" && (
                    <button
                      onClick={() => markAsPickedUp(order.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Mark as Picked Up
                    </button>
                  )}

                  {(order.status === "preparing" ||
                    order.status === "ready") && (
                    <div className="flex-1 text-center py-2 text-gray-600 text-sm">
                      {order.status === "preparing"
                        ? "⏱️ Please wait while we prepare your order"
                        : "🎉 Your order is ready!"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
