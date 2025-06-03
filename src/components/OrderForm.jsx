import React, { useState } from "react";
import QRCode from "react-qr-code";

const initialMenu = [
  {
    id: 1,
    name: "กาแฟเนส",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 2,
    name: "กาแฟโบราณ",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 3,
    name: "มอคค่า",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 4,
    name: "คาปูชิโน่",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 5,
    name: "ลาเต้",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 6,
    name: "ชาเขียว",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 7,
    name: "ชานมเย็น",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 8,
    name: "ชามะนาว",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 9,
    name: "โกโก้",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 10,
    name: "โอวัลติน",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 11,
    name: "ไมโล",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 12,
    name: "นมสด",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 13,
    name: "นมเย็น",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 14,
    name: "แดงโซดา",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 15,
    name: "มะนาวโซดา",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 16,
    name: "อิตาเลียนโซดา",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 17,
    name: "บ๊วย",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 18,
    name: "โค้ก",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
  {
    id: 19,
    name: "น้ำ",
    sizes: {
      medium: { price: 25, quantity: 0 },
      large: { price: 30, quantity: 0 },
    },
  },
];

const promptPayNumber = "0812345678"; // Replace with your actual PromptPay number

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

  const generatePromptPayPayload = () => {
    const total = getTotal();
    const baht = total.toFixed(2).replace(".", "");
    // Very simplified QR template string – for full spec, use a PromptPay library
    return `00020101021129370016A00000067701011101130066${promptPayNumber}53037646304${baht}5802TH6304`;
  };

  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const order = getOrderSummary();
    const total = getTotal();
    const subject = encodeURIComponent("New Coffee Order");
    const body = encodeURIComponent(`Order: ${order}\nTotal: ${total} THB`);

    // Open email in new tab with Gmail (preferred)
    const mailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=coffeelady@example.com&su=${subject}&body=${body}`;
    window.open(mailUrl, "_blank");

    // Show QR code after mail is opened
    setEmailSent(true);
  };
  const total = getTotal();
  const showQR = total > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-black p-6">
      <h2 className="text-2xl font-bold mb-4">Menu</h2>
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
          <strong>Total:</strong> {total} ฿
        </p>
      </div>
      <button
        type="submit"
        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        Confirm Order
      </button>

      {showQR && (
        <div className="text-center">
          <p className="mb-2 text-md font-semibold">
            Scan to Pay via PromptPay
          </p>
          <QRCode value={generatePromptPayPayload()} size={180} />
        </div>
      )}
    </form>
  );
}
