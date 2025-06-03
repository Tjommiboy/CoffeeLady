import { useState } from "react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="text-white px-6 py-4 bg-gray-900">
      {/* Top Section: Logo */}
      <div className="flex items-center justify-between">
        <img className="w-58" src="/images/Logo.jpg" alt="Logo" />

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-1 h-3"
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
        <a href="#" className="hover:text-yellow-400">
          Menu
        </a>
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
          <a
            href="#"
            className="px-6 py-3 border-b border-gray-700 hover:bg-yellow-500 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>
          <a
            href="#"
            className="px-6 py-3 border-b border-gray-700 hover:bg-yellow-500 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            Menu
          </a>
          <a
            href="#"
            className="px-6 py-3 border-b border-gray-700 hover:bg-yellow-500 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
          <a
            href="#"
            className="px-6 py-3 hover:bg-yellow-500 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
}
