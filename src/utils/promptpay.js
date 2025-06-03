import * as qrcode from "qrcode";

const PROMPTPAY_NUMBER = "0812345678"; // 🔁 Replace this with your real number

export function generatePromptPayPayload(amount) {
  const id = PROMPTPAY_NUMBER.replace(/[^0-9]/g, "");
  return `00020101021129370016A000000677010111${
    id.length === 13 ? "02" : "01"
  }${id.length.toString().padStart(2, "0")}${id}53037646304${amount
    .toFixed(2)
    .replace(".", "")}5802TH6304`;
}
