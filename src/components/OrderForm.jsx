import React, { useState } from "react";
import QRCode from "react-qr-code";

const initialMenu = [
  { id: 1, name: "กาแฟเนส", prices: { medium: 25, large: 30 } },
  { id: 2, name: "กาแฟโบราณ", prices: { medium: 25, large: 30 } },
  { id: 3, name: "มอคค่า", prices: { medium: 25, large: 30 } },
  { id: 4, name: "คาปูชิโน่", prices: { medium: 25, large: 30 } },
  { id: 5, name: "ลาเต้", prices: { medium: 25, large: 30 } },
  { id: 6, name: "ชาเขียว", prices: { medium: 25, large: 30 } },
  { id: 7, name: "ชานมเย็น", prices: { medium: 25, large: 30 } },
  { id: 8, name: "ชามะนาว", prices: { medium: 25, large: 30 } },
  { id: 9, name: "โกโก้", prices: { medium: 25, large: 30 } },
  { id: 10, name: "โอวัลติน", prices: { medium: 25, large: 30 } },
  { id: 11, name: "ไมโล", prices: { medium: 25, large: 30 } },
  { id: 12, name: "นมสด", prices: { medium: 25, large: 30 } },
  { id: 13, name: "นมเย็น", prices: { medium: 25, large: 30 } },
  { id: 14, name: "แดงโซดา", prices: { medium: 25, large: 30 } },
  { id: 15, name: "มะนาวโซดา", prices: { medium: 25, large: 30 } },
  { id: 16, name: "อิตาเลียนโซดา", prices: { medium: 25, large: 30 } },
  { id: 17, name: "บ๊วย", prices: { medium: 25, large: 30 } },
  { id: 18, name: "โค้ก", prices: { medium: 25, large: 30 } },
  { id: 19, name: "น้ำ", prices: { medium: 25, large: 30 } },
];

const sweetnessOptions = ["0%", "25%", "50%", "75%", "100%"];

const promptPayNumber = "0812345678";

export default function OrderForm() {
  // Cart holds individual drinks: { id, name, size, price, sweetness }
  const [cart, setCart] = useState([]);

  // Add one drink with default sweetness "50%"
  const addDrink = (menuItem, size) => {
    const price = menuItem.prices[size];
    setCart((prev) => [
      ...prev,
      {
        key: Date.now() + Math.random(), // unique key
        id: menuItem.id,
        name: menuItem.name,
        size,
        price,
        sweetness: "50%",
      },
    ]);
  };

  // Remove one drink from cart by its unique key
  const removeDrink = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  // Change sweetness for an individual drink
  const changeSweetness = (key, sweetness) => {
    setCart((prev) =>
      prev.map((item) => (item.key === key ? { ...item, sweetness } : item))
    );
  };

  // Order summary string
  const getOrderSummary = () => {
    if (cart.length === 0) return "(empty)";
    // Count identical drinks by name, size, sweetness
    const summaryMap = {};
    cart.forEach(({ name, size, sweetness }) => {
      const key = `${name}-${size}-${sweetness}`;
      summaryMap[key] = (summaryMap[key] || 0) + 1;
    });

    return Object.entries(summaryMap)
      .map(([key, qty]) => {
        const [name, size, sweetness] = key.split("-");
        return `${qty}x ${size} ${name} (หวาน ${sweetness})`;
      })
      .join(", ");
  };

  const getTotal = () => cart.reduce((sum, item) => sum + item.price, 0);

  const generatePromptPayPayload = () => {
    const total = getTotal();
    const baht = total.toFixed(2).replace(".", "");
    return `00020101021129370016A00000067701011101130066${promptPayNumber}53037646304${baht}5802TH6304`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("กรุณาเพิ่มเครื่องดื่มก่อนสั่งซื้อ");
      return;
    }
    const order = getOrderSummary();
    const total = getTotal();
    const subject = encodeURIComponent("New Coffee Order");
    const body = encodeURIComponent(`Order: ${order}\nTotal: ${total} THB`);

    const mailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=coffeelady@example.com&su=${subject}&body=${body}`;
    window.open(mailUrl, "_blank");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 text-black p-6 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4">Menu</h2>

      {initialMenu.map((item) => (
        <div key={item.id} className="border-b pb-4">
          <h3 className="text-xl font-semibold">{item.name}</h3>
          {Object.entries(item.prices).map(([size, price]) => (
            <div key={size} className="flex items-center gap-4 mt-2 flex-wrap">
              <span className="capitalize w-20">{size}</span>
              <span>{price}฿</span>
              <button
                type="button"
                onClick={() => addDrink(item, size)}
                className="px-3 py-1 bg-green-400 hover:bg-green-500 text-white rounded"
              >
                Add +
              </button>
            </div>
          ))}
        </div>
      ))}

      <h2 className="text-2xl font-bold mt-8 mb-4">Your Order</h2>

      {cart.length === 0 && <p>Your cart is empty.</p>}

      {cart.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto border p-4 rounded bg-gray-50">
          {cart.map(({ key, name, size, sweetness, price }, index) => (
            <div
              key={key}
              className="flex items-center gap-4 bg-white p-2 rounded shadow-sm"
            >
              <div className="flex-grow">
                <div>
                  {size} {name} - {price}฿
                </div>
                <select
                  className="mt-1 p-1 border rounded"
                  value={sweetness}
                  onChange={(e) => changeSweetness(key, e.target.value)}
                >
                  {sweetnessOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      หวาน {opt}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeDrink(key)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                title="Remove item"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-lg">
        <p>
          <strong>Order Summary:</strong> {getOrderSummary()}
        </p>
        <p>
          <strong>Total:</strong> {getTotal()} ฿
        </p>
      </div>

      <button
        type="submit"
        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        Confirm Order
      </button>

      {getTotal() > 0 && (
        <div className="text-center mt-6">
          <p className="mb-2 text-md font-semibold">
            Scan to Pay via PromptPay
          </p>
          <QRCode value={generatePromptPayPayload()} size={180} />
        </div>
      )}
    </form>
  );
}
