import { useState } from "react";
import { Link } from "react-router-dom";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="text-whit px-4 sm:px-6 md:px-8 py-3 max-w-screen-xl mx-auto">
      {/* Top Section: Logo + Hamburger */}
      <div className="flex items-center justify-between">
        <img
          className="w-56" // Keep this big
          src="/images/Logo.jpg"
          alt="Logo"
        />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none p-1 bg-thaiblue"
          aria-label="Toggle menu"
          style={{ marginRight: "8px" }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop Links Below Logo */}
      <div className="hidden md:flex justify-center mt-4 space-x-6">
        <a href="#" className="hover:text-yellow-400">
          Home
        </a>
        <Link to="Menu" className="hover:text-yellow-400">
          Menu
        </Link>
        <a href="#" className="hover:text-yellow-400">
          About
        </a>
        <a href="#" className="hover:text-yellow-400">
          Contact
        </a>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="flex flex-col md:hidden mt-4 bg-gray-800">
          <Link to="/" className=" px-6 py-3">
            Home
          </Link>
          <Link to="Menu" className=" px-6 py-3">
            Menu
          </Link>

          <Link to="Contact" className=" px-6 py-3">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
