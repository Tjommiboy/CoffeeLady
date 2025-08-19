import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function BaristaOrders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        window.location.href = "/Admin";
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to orders in real-time
  useEffect(() => {
    if (!user) return;

    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const ordersData = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Order data:", data); // Debug log
          return {
            id: doc.id,
            ...data,
          };
        });
        console.log("All orders:", ordersData); // Debug log
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

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown time";
    // Handle both Firestore timestamp and createdAt
    const date = timestamp.toDate
      ? timestamp.toDate()
      : timestamp.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">☕ Barista Orders</h2>
            <p className="text-gray-700">
              Welcome, <span className="font-medium">{user.email}</span>
            </p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Order #{order.id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatTime(order.createdAt || order.timestamp)} • Customer:{" "}
                    {order.customerEmail || order.userEmail || "Unknown"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status || "pending"}
                </span>
              </div>

              {/* Order Items */}
              <div className="mb-4 text-black">
                <h4 className="font-medium mb-2">Order Details:</h4>
                <div className="space-y-2">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center  bg-gray-50 p-3 rounded"
                      >
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <div className="text-sm text-gray-600">
                            Size: {item.size} • Sweetness: {item.sweetness}
                          </div>
                        </div>
                        <div className="text-right text-black">
                          <span className="font-medium">x{item.quantity}</span>
                          <div className="text-sm text-gray-600">
                            ฿{item.totalPrice}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : order.summary ? (
                    /* Fallback for old summary format */
                    <div className="bg-gray-50 p-3 text-black rounded">
                      <div className="text-sm whitespace-pre-wrap">
                        {order.summary}
                      </div>
                    </div>
                  ) : (
                    /* No data */
                    <p className="text-gray-500 text-black bg-gray-50 p-3 rounded">
                      No order details available
                    </p>
                  )}
                </div>
              </div>

              {/* Total */}
              {order.totalPrice && (
                <div className="flex justify-between items-center text-black mb-4 pt-2 border-t">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">฿{order.totalPrice}</span>
                </div>
              )}

              {/* Status Update Buttons */}
              <div className="flex gap-2">
                {order.status === "pending" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "preparing")}
                    className="flex-1 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 transition"
                  >
                    Start Preparing
                  </button>
                )}

                {order.status === "preparing" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "ready")}
                    className="flex-1 px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600 transition"
                  >
                    Mark Ready
                  </button>
                )}

                {order.status === "ready" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "completed")}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                  >
                    Mark Completed
                  </button>
                )}

                {/* Emergency buttons for any status */}
                {order.status !== "pending" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "pending")}
                    className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
