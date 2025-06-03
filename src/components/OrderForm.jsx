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

const sweetnessOptions = [
  "ไม่หวาน 0%",
  "หวานน้อย 25%",
  "หวานปกติ 50%",
  "หวานมาก 75%",
  "Diabetes 100%",
];

const promptPayNumber = "0812345678";

export default function OrderForm() {
  const [menu, setMenu] = useState(
    initialMenu.map((item) => ({
      ...item,
      sizes: {
        medium: [],
        large: [],
      },
    }))
  );

  const addDrink = (id, size) => {
    setMenu((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              sizes: {
                ...item.sizes,
                [size]: [...item.sizes[size], "50%"],
              },
            }
          : item
      )
    );
  };

  const changeSweetness = (id, size, index, sweetness) => {
    setMenu((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newSweetnessArr = [...item.sizes[size]];
          newSweetnessArr[index] = sweetness;
          return {
            ...item,
            sizes: {
              ...item.sizes,
              [size]: newSweetnessArr,
            },
          };
        }
        return item;
      })
    );
  };

  const removeCup = (id, size, index) => {
    setMenu((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newSweetnessArr = [...item.sizes[size]];
          newSweetnessArr.splice(index, 1);
          return {
            ...item,
            sizes: {
              ...item.sizes,
              [size]: newSweetnessArr,
            },
          };
        }
        return item;
      })
    );
  };

  const totalPrice = menu.reduce((total, item) => {
    return (
      total +
      Object.entries(item.sizes).reduce(
        (subTotal, [size, cups]) => subTotal + cups.length * item.prices[size],
        0
      )
    );
  }, 0);

  const orderSummary = menu
    .flatMap((item) =>
      Object.entries(item.sizes).flatMap(([size, cups]) =>
        cups.map(
          (sweetness, index) =>
            `${item.name} (${size}) cup #${index + 1}, sweetness: ${sweetness}`
        )
      )
    )
    .join("\n");

  const handleConfirmOrder = () => {
    if (!orderSummary) {
      alert("Please add drinks before confirming your order.");
      return;
    }

    const subject = encodeURIComponent("Order Confirmation");
    const body = encodeURIComponent(`${orderSummary}\n\nTotal: ฿${totalPrice}`);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

    // Open in a new window or tab
    window.open(mailtoLink, "_blank");

    // Optional: alert the user
    alert(
      "อีเมลของคุณจะเปิดขึ้นในเร็วๆ นี้ โปรดยืนยันและส่งคำสั่งซื้อของคุณที่นั่น เมื่อได้รับ promptpay คำสั่งซื้อของคุณจะพร้อมใช้งาน/Your email will open shortly. Please confirm and send your order there. On recieved promptpay your order will be made ready."
    );
  };

  const styles = {
    container: {
      maxWidth: 420,
      margin: "2rem auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#222",
      padding: "1rem",
      border: "1px solid #ddd",
      borderRadius: 8,
      backgroundColor: "#f9f9f9",
    },
    menuItem: {
      marginBottom: "2rem",
      paddingBottom: "1rem",
      borderBottom: "1px solid #ccc",
    },
    drinkName: {
      fontWeight: "bold",
      fontSize: "1.3rem",
      marginBottom: "1rem",
      color: "#333",
      textAlign: "center",
    },
    sizeSection: {
      marginBottom: "1rem",
    },
    sizeHeader: {
      fontWeight: "600",
      fontSize: "1.1rem",
      marginBottom: "0.3rem",
      color: "#555",
    },
    addButton: {
      marginBottom: "0.6rem",
      padding: "0.35rem 1rem",
      borderRadius: 4,
      border: "none",
      backgroundColor: "#4caf50",
      color: "white",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.9rem",
    },
    sweetnessContainer: {
      paddingLeft: "1rem",
    },
    sweetnessRow: {
      marginBottom: "0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
    },
    select: {
      marginLeft: "0.5rem",
      padding: "0.2rem 0.4rem",
      borderRadius: 4,
      border: "1px solid #aaa",
    },
    removeButton: {
      padding: "0.2rem 0.5rem",
      borderRadius: 4,
      border: "none",
      backgroundColor: "#e53935",
      color: "white",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.8rem",
    },
    total: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      marginTop: "1rem",
      color: "#222",
      textAlign: "center",
    },
    confirmButton: {
      marginTop: "1rem",
      padding: "0.6rem 1.2rem",
      backgroundColor: "#1976d2",
      color: "white",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "700",
      fontSize: "1rem",
      width: "100%",
    },
    qrContainer: {
      marginTop: "1.5rem",
      textAlign: "center",
    },
    pre: {
      marginTop: "1rem",
      backgroundColor: "#eee",
      padding: "1rem",
      borderRadius: 6,
      fontSize: "0.9rem",
      whiteSpace: "pre-wrap",
      maxHeight: 150,
      overflowY: "auto",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: "center" }}>Order Menu</h1>

      {menu.map((item) => (
        <div key={item.id} style={styles.menuItem}>
          <div style={styles.drinkName}>{item.name}</div>

          {["medium", "large"].map((size) => (
            <div key={size} style={styles.sizeSection}>
              <div style={styles.sizeHeader}>
                {size.charAt(0).toUpperCase() + size.slice(1)} - ฿
                {item.prices[size]}
              </div>
              <button
                style={styles.addButton}
                onClick={() => addDrink(item.id, size)}
              >
                Add
              </button>

              {item.sizes[size].length > 0 && (
                <div
                  className="bg-slate-300 p-2 rounded"
                  style={styles.sweetnessContainer}
                >
                  {item.sizes[size].map((sweetness, idx) => (
                    <div key={idx} style={styles.sweetnessRow}>
                      <label>
                        Cup #{idx + 1} sweetness:
                        <select
                          className="bg-amber-100  rounded"
                          style={styles.select}
                          value={sweetness}
                          onChange={(e) =>
                            changeSweetness(item.id, size, idx, e.target.value)
                          }
                        >
                          {sweetnessOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        style={styles.removeButton}
                        onClick={() => removeCup(item.id, size, idx)}
                        title="Remove this cup"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <hr />
      <div style={styles.total}>Total: ฿{totalPrice}</div>

      <button style={styles.confirmButton} onClick={handleConfirmOrder}>
        Confirm Order
      </button>

      {orderSummary ? (
        <div style={styles.qrContainer}>
          <h3>Your Order QR Code</h3>
          <QRCode value={orderSummary} size={200} />
          <pre style={styles.pre}>{orderSummary}</pre>
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Please add drinks to see your order QR code.
        </p>
      )}
    </div>
  );
}
