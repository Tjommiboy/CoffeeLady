import { Outlet, Link } from "react-router-dom";
import OrderForm from "./OrderForm";
export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="bg-gray-900 text-white p-4">
        <nav className="flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">Coffee Lady</h1>
          <div className="space-x-4">
            <Link to="/" className="hover:text-red-400">
              Home
            </Link>
            <Link to="/about" className="hover:text-red-400">
              About
            </Link>
            <Link to="/contact" className="hover:text-red-400">
              Contact
            </Link>
          </div>
        </nav>
      </header>

      {/* Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <OrderForm />
      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        © {new Date().getFullYear()} Coffee Lady
      </footer>
    </div>
  );
}
