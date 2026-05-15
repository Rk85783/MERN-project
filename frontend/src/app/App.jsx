import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Profile from "../pages/Profile";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import OrderDetail from "../pages/OrderDetail";
import ProductList from "../pages/admin/ProductList";
import NewProduct from "../pages/admin/NewProduct";
import OrderList from "../pages/admin/OrderList";
import UserList from "../pages/admin/UserList";
import { Toaster } from "sonner";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetail />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/product/new" element={<NewProduct />} />
            <Route path="/admin/product/:id" element={<NewProduct />} />
            <Route path="/admin/orders" element={<OrderList />} />
            <Route path="/admin/users" element={<UserList />} />
          </Routes>
        </main>
        <Footer />
        <Toaster richColors position="top-right" />
      </div>
    </Router>
  );
};

export default App;
