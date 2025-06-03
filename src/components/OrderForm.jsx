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
  // menu items with cups grouped by size & sweetness
  const [menu, setMenu] = useState(
    initialMenu.map((item) => ({
      ...item,
      sizes: { medium: [], large: [] },
    }))
  );

  // track which drink user wants to add size for (null = no prompt)
  const [pendingAddDrinkId, setPendingAddDrinkId] = useState(null);

  // Add a cup of given drink ID and size with default sweetness 50%
  const addCup = (id, size) => {
    setMenu((prevMenu) =>
      prevMenu.map((item) =>
        item.id === id
          ? {
              ...item,
              sizes: {
                ...item.sizes,
                [size]: [...item.sizes[size], "หวานปกติ 50%"],
              },
            }
          : item
      )
    );
    setPendingAddDrinkId(null); // close size prompt
  };

  // Change sweetness for a specific cup
  const changeSweetness = (id, size, index, sweetness) => {
    setMenu((prevMenu) =>
      prevMenu.map((item) => {
        if (item.id === id) {
          const newSweetness = [...item.sizes[size]];
          newSweetness[index] = sweetness;
          return {
            ...item,
            sizes: {
              ...item.sizes,
              [size]: newSweetness,
            },
          };
        }
        return item;
      })
    );
  };

  // Remove a cup from drink and size
  const removeCup = (id, size, index) => {
    setMenu((prevMenu) =>
      prevMenu.map((item) => {
        if (item.id === id) {
          const newSizes = { ...item.sizes };
          newSizes[size] = [...newSizes[size]];
          newSizes[size].splice(index, 1);
          return {
            ...item,
            sizes: newSizes,
          };
        }
        return item;
      })
    );
  };

  // Calculate total price
  const totalPrice = menu.reduce((acc, item) => {
    return (
      acc +
      Object.entries(item.sizes).reduce(
        (sum, [size, cups]) => sum + cups.length * item.prices[size],
        0
      )
    );
  }, 0);

  // Compose order summary for email body
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
      alert("กรุณาเพิ่มเครื่องดื่มก่อนยืนยันคำสั่งซื้อ");
      return;
    }

    const subject = encodeURIComponent("ยืนยันคำสั่งซื้อ / Order Confirmation");
    const body = encodeURIComponent(`${orderSummary}\n\nรวม: ฿${totalPrice}`);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank");
    alert(
      "อีเมลจะถูกเปิดขึ้น โปรดยืนยันและส่งคำสั่งซื้อของคุณที่นั่น\nเมื่อได้รับ PromptPay คำสั่งซื้อของคุณจะถูกดำเนินการ"
    );
  };

  const promptPayQRData = `promptpay://pay?number=${promptPayNumber}&amount=${totalPrice.toFixed(
    2
  )}`;

  // Styles
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
    drinkRow: { marginBottom: "1.5rem" },
    drinkName: {
      fontWeight: "bold",
      fontSize: "1.2rem",
      marginBottom: "0.3rem",
    },
    addButton: {
      padding: "6px 12px",
      borderRadius: 12,
      border: "1px solid #ccc",
      backgroundColor: "#d9f7ff",
      cursor: "pointer",
    },
    cupList: { marginTop: "0.5rem", paddingLeft: "1rem" },
    cupItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "0.4rem",
      fontSize: "0.9rem",
    },
    selectSweetness: {
      borderRadius: 3,
      padding: "2px 6px",
      border: "1px solid #ccc",
      backgroundColor: "#f0f0f0",
    },
    removeButton: {
      cursor: "pointer",
      backgroundColor: "#ffcccc",
      border: "none",
      borderRadius: 3,
      padding: "2px 10px",
    },
    totalPrice: {
      fontWeight: "bold",
      fontSize: "1.2rem",
      textAlign: "center",
      marginTop: "1rem",
    },
    confirmButton: {
      display: "block",
      margin: "1rem auto 0",
      padding: "10px 20px",
      fontSize: "1.1rem",
      borderRadius: 16,
      cursor: "pointer",
      border: "none",
      backgroundColor: "#52c41a",
      color: "white",
    },
    qrContainer: {
      marginTop: "2rem",
      textAlign: "center",
      background: "#fff",
      padding: "1rem",
      borderRadius: 8,
    },
    sizeSelectorOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    sizeSelectorBox: {
      backgroundColor: "#fff",
      padding: "1rem 2rem",
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      textAlign: "center",
    },
    sizeButton: {
      margin: "0.2rem",
      padding: "0.3rem .5rem",
      fontSize: "1rem",
      borderRadius: "8px",
      cursor: "pointer",
      border: "1px solid #ccc",
      backgroundColor: "#e0f7fa",
    },
    cancelButton: {
      marginTop: "1rem",
      padding: "0.4rem 1.2rem",
      borderRadius: 5,
      cursor: "pointer",
      border: "1px solid #f44336",
      color: "#f44336",
      backgroundColor: "#fff0f0",
    },
    drinkRow: {
      marginBottom: "1.5rem",
      paddingBottom: "1rem",
      borderBottom: "1px solid #ccc", // Add this line
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: "center" }}>เมนูเครื่องดื่ม / Order Menu</h1>

      {menu.map((item) => (
        <div key={item.id} style={styles.drinkRow}>
          <div style={styles.drinkName}>{item.name}</div>
          <button
            style={styles.addButton}
            onClick={() => setPendingAddDrinkId(item.id)}
          >
            Add
          </button>

          {/* Show cups of this drink by size */}
          <div style={styles.cupList}>
            {["medium", "large"].map((size) =>
              item.sizes[size].map((sweetness, idx) => (
                <div key={size + idx} style={styles.cupItem}>
                  <span>
                    {size} - Cup #{idx + 1}
                  </span>
                  <select
                    value={sweetness}
                    onChange={(e) =>
                      changeSweetness(item.id, size, idx, e.target.value)
                    }
                    style={styles.selectSweetness}
                  >
                    {sweetnessOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeCup(item.id, size, idx)}
                    style={styles.removeButton}
                    title="Remove cup"
                  >
                    X
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ))}

      <div style={styles.totalPrice}>รวมทั้งหมด / Total: ฿{totalPrice}</div>

      <button style={styles.confirmButton} onClick={handleConfirmOrder}>
        Confirm Order
      </button>

      {/* Show QR code only if there is an order */}
      {totalPrice > 0 && (
        <div style={styles.qrContainer}>
          <div>PromptPay QR Code:</div>
          <QRCode value={promptPayQRData} size={150} />
          <div>PromptPay Number: {promptPayNumber}</div>
        </div>
      )}

      {/* Size selector popup */}
      {pendingAddDrinkId !== null && (
        <div style={styles.sizeSelectorOverlay}>
          <div style={styles.sizeSelectorBox}>
            <div style={{ fontWeight: "bold", marginBottom: "1rem" }}>
              เลือกขนาดแก้ว / Choose Size
            </div>
            <button
              style={styles.sizeButton}
              onClick={() => addCup(pendingAddDrinkId, "medium")}
            >
              Medium (฿25)
            </button>
            <button
              style={styles.sizeButton}
              onClick={() => addCup(pendingAddDrinkId, "large")}
            >
              Large (฿30)
            </button>
            <br />
            <button
              style={styles.cancelButton}
              onClick={() => setPendingAddDrinkId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
