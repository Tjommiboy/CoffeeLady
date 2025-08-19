import { useState } from "react";
import { Link } from "react-router-dom";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="text-whit px-4 sm:px-6 md:px-8 py-3 max-w-screen-xl mx-auto">
      {/* Top Section: Logo + Hamburger */}
      <div className="flex items-center justify-between">
        <img className="min-w-56 w-full" src="/images/Logo.jpg" alt="Logo" />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none p-1 bg-blue-400 "
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
      <div className=" hidden md:flex justify-between mt-4 space-x-6">
        <div className="  mt-4 space-x-6">
          <a href="/" className="nav-link">
            Home
          </a>
          <a href="Menu" className="nav-link">
            Menu
          </a>

          <a href="Customer" className="nav-link">
            Customer
          </a>

          <a href="Cart" className="nav-link">
            Cart
          </a>
        </div>
        <a href="Admin" className="nav-link mt-4">
          Barista
        </a>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="flex flex-col md:hidden mt-4 bg-thaired">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="Menu" className="nav-link">
            Menu
          </Link>

          <Link to="Customer" className="nav-link">
            Customer
          </Link>
          <Link to="Cart" className="nav-link">
            Cart
          </Link>
          <Link to="Admin" className="nav-link">
            Barista
          </Link>
        </div>
      )}
    </nav>
  );
}
