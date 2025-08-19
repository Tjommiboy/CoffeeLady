import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import FrontPage from "./pages/FrontPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import About from "./pages/About.jsx";
import Menu from "./pages/Menu.jsx";
import BaristaLogin from "./pages/BaristaLogin.jsx";
import BaristaOrders from "./pages/BaristaOrders.jsx";
import UserAuth from "./pages/Customer.jsx";
import OrderForm from "./components/OrderForm.jsx";
import CustomerCart from "./pages/Cart.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FrontPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="About" element={<About />} />
          <Route path="/Menu" element={<Menu />} />
          <Route path="/Admin" element={<BaristaLogin />} />
          <Route path="/barista" element={<BaristaOrders />} />
          <Route path="/Customer" element={<UserAuth />} />
          <Route path="/Order" element={<OrderForm />} />
          <Route path="/Cart" element={<CustomerCart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
