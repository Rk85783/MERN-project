import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useGetMeQuery } from "../../store/authApi";
import { BsCart3, BsPerson, BsBox, BsList } from "react-icons/bs";
import { useState } from "react";

const Header = () => {
  const { data: user } = useGetMeQuery();
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          ShopEase
        </Link>

        <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}><BsList /></button>

        <nav className={`${menuOpen ? "flex" : "hidden"} md:flex absolute md:static top-16 left-0 w-full md:w-auto bg-primary md:bg-transparent flex-col md:flex-row items-start md:items-center gap-4 px-4 md:px-0 pb-4 md:pb-0`}>
          <Link to="/" className="hover:text-blue-200 transition" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/cart" className="relative hover:text-blue-200 transition flex items-center gap-1" onClick={() => setMenuOpen(false)}>
            <BsCart3 className="text-lg" />
            {cartCount > 0 && <span className="bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/orders" className="hover:text-blue-200 transition flex items-center gap-1" onClick={() => setMenuOpen(false)}><BsBox /> Orders</Link>
              <Link to="/profile" className="hover:text-blue-200 transition flex items-center gap-1" onClick={() => setMenuOpen(false)}><BsPerson /> Profile</Link>
              {isAdmin && (
                <div className="relative group">
                  <span className="hover:text-blue-200 transition cursor-pointer flex items-center gap-1">Admin ▾</span>
                  <div className="absolute top-full right-0 mt-1 bg-white text-gray-800 shadow-lg rounded-lg min-w-40 hidden group-hover:block">
                    <Link to="/admin/products" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setMenuOpen(false)}>Products</Link>
                    <Link to="/admin/orders" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setMenuOpen(false)}>Orders</Link>
                    <Link to="/admin/users" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setMenuOpen(false)}>Users</Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" className="hover:text-blue-200 transition" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
