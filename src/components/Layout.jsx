import { Outlet, Link } from "react-router-dom";
import OrderForm from "./OrderForm";
import Nav from "./NavBar";
export default function Layout() {
  return (
    <div className=" flex flex-col min-h-screen bg-white ">
      {/* Navigation */}
      <header className="bg-thaired text-white p-4 ">
        <Nav />
      </header>

      {/* Page Content */}
      <main className="flex-grow rounded">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        © {new Date().getFullYear()} Coffee Lady
      </footer>
    </div>
  );
}
