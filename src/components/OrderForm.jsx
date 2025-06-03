import React, { useState } from "react";

const initialMenu = [
  {
    id: 1,
    name: "Americano",
    sizes: {
      medium: { price: 40, quantity: 0 },
      large: { price: 50, quantity: 0 },
    },
  },
  {
    id: 2,
    name: "Latte",
    sizes: {
      medium: { price: 50, quantity: 0 },
      large: { price: 60, quantity: 0 },
    },
  },
  {
    id: 3,
    name: "Cappuccino",
    sizes: {
      medium: { price: 50, quantity: 0 },
      large: { price: 60, quantity: 0 },
    },
  },
];

export default function OrderForm() {
  const [menu, setMenu] = useState(initialMenu);

  const handleQuantityChange = (id, size, delta) => {
    setMenu((prevMenu) =>
      prevMenu.map((item) =>
        item.id === id
          ? {
              ...item,
              sizes: {
                ...item.sizes,
                [size]: {
                  ...item.sizes[size],
                  quantity: Math.max(0, item.sizes[size].quantity + delta),
                },
              },
            }
          : item
      )
    );
  };

  const getOrderSummary = () => {
    return menu
      .flatMap((item) =>
        Object.entries(item.sizes).map(([size, data]) => {
          if (data.quantity > 0) {
            return `${data.quantity}x ${size} ${item.name}`;
          }
          return null;
        })
      )
      .filter(Boolean)
      .join(", ");
  };

  const getTotal = () => {
    return menu.reduce((sum, item) => {
      return (
        sum +
        Object.values(item.sizes).reduce(
          (s, size) => s + size.price * size.quantity,
          0
        )
      );
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const order = getOrderSummary();
    const total = getTotal();
    const subject = encodeURIComponent("New Coffee Order");
    const body = encodeURIComponent(`Order: ${order}\nTotal: ${total} THB`);
    window.location.href = `mailto:coffeelady@example.com?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-black p-6">
      <h2 className="text-2xl font-bold mb-4 ">Menu</h2>
      {menu.map((item) => (
        <div key={item.id} className="border-b pb-4">
          <h3 className="text-xl font-semibold">{item.name}</h3>
          {["medium", "large"].map((size) => (
            <div key={size} className="flex items-center gap-4 mt-2">
              <span className="capitalize w-20">{size}</span>
              <span>{item.sizes[size].price}฿</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(item.id, size, -1)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                −
              </button>
              <span>{item.sizes[size].quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(item.id, size, 1)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          ))}
        </div>
      ))}

      <div className="mt-6 text-lg">
        <p>
          <strong>Order:</strong> {getOrderSummary()}
        </p>
        <p>
          <strong>Total:</strong> {getTotal()} ฿
        </p>
      </div>

      <button
        type="submit"
        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        Send Order
      </button>
    </form>
  );
}
