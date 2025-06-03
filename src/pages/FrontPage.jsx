import OrderForm from "../components/OrderForm";
import React, { useState } from "react";
export default function Home() {
  return (
    <div className="relative min-h-screen bg-thaired">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/images/-edited.jpg)`,
        }}
        aria-hidden="true"
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          ยินดีต้อนรับสู่ ต๋อยกาแฟโบราณ
        </h1>

        {/* <button className="mt-6 sm:mt-8 px-5 sm:px-6 lg:px-8 py-2 sm:py-3 bg-red-600 hover:bg-red-700 rounded text-sm sm:text-base lg:text-lg text-white font-semibold transition">
          Shop Now
        </button> */}
      </div>
    </div>
  );
}
