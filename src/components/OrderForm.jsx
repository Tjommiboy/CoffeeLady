import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase.js"; // your firebase.js file

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

export default function OrderForm() {
  const [menu, setMenu] = useState(
    initialMenu.map((item) => ({
      ...item,
      sizes: { medium: [], large: [] },
    }))
  );

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
  };

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

  const totalPrice = menu.reduce((acc, item) => {
    return (
      acc +
      Object.entries(item.sizes).reduce(
        (sum, [size, cups]) => sum + cups.length * item.prices[size],
        0
      )
    );
  }, 0);

  // Create structured items array for Firestore
  const getOrderItems = () => {
    const items = [];

    menu.forEach((menuItem) => {
      Object.entries(menuItem.sizes).forEach(([size, cups]) => {
        cups.forEach((sweetness) => {
          // Check if this item/size/sweetness combination already exists
          const existingItem = items.find(
            (item) =>
              item.name === menuItem.name &&
              item.size === size &&
              item.sweetness === sweetness
          );

          if (existingItem) {
            // Increment quantity if it exists
            existingItem.quantity += 1;
            existingItem.totalPrice += menuItem.prices[size];
          } else {
            // Add new item
            items.push({
              name: menuItem.name,
              size: size,
              sweetness: sweetness,
              price: menuItem.prices[size],
              quantity: 1,
              totalPrice: menuItem.prices[size],
            });
          }
        });
      });
    });

    return items;
  };

  // Keep the summary for backwards compatibility or display purposes
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

  const handleConfirmOrder = async () => {
    const orderItems = getOrderItems();

    if (orderItems.length === 0) {
      alert("กรุณาเพิ่มเครื่องดื่มก่อนยืนยันคำสั่งซื้อ");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        items: orderItems,
        summary: orderSummary, // Keep for backwards compatibility
        totalPrice: totalPrice,
        status: "pending",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      alert("คำสั่งซื้อของคุณถูกบันทึกเรียบร้อย!");
      setMenu(
        initialMenu.map((item) => ({
          ...item,
          sizes: { medium: [], large: [] },
        }))
      );
    } catch (error) {
      console.error("Error saving order:", error);
      alert("เกิดข้อผิดพลาด! โปรดลองอีกครั้ง");
    }
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
  };

  return (
    <div style={styles.container}>
      {menu.map((item) => (
        <div key={item.id} style={styles.drinkRow}>
          <div style={styles.drinkName}>{item.name}</div>
          <button
            style={styles.addButton}
            onClick={() => addCup(item.id, "medium")}
          >
            Add Medium
          </button>
          <button
            style={styles.addButton}
            onClick={() => addCup(item.id, "large")}
          >
            Add Large
          </button>

          <ul style={styles.cupList}>
            {["medium", "large"].map((size) =>
              item.sizes[size].map((sweetness, index) => (
                <li key={index} style={styles.cupItem}>
                  <select
                    style={styles.selectSweetness}
                    value={sweetness}
                    onChange={(e) =>
                      changeSweetness(item.id, size, index, e.target.value)
                    }
                  >
                    {sweetnessOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <button
                    style={styles.removeButton}
                    onClick={() => removeCup(item.id, size, index)}
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ))}

      <div style={styles.totalPrice}>Total: {totalPrice} THB</div>
      <button style={styles.confirmButton} onClick={handleConfirmOrder}>
        Confirm Order
      </button>
    </div>
  );
}
