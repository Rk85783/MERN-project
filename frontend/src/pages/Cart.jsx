import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { addToCart, removeFromCart, clearCart } from "../store/cartSlice";
import { useNewOrderMutation } from "../store/orderApi";
import { useGetMeQuery } from "../store/authApi";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useState } from "react";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { data: user } = useGetMeQuery();
  const [createOrder, { isLoading: ordering }] = useNewOrderMutation();
  const [shippingInfo, setShippingInfo] = useState({ address: "", city: "", state: "", country: "India", pinCode: "", phoneNo: "" });

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleQty = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    dispatch(addToCart({ ...item, quantity: newQty }));
  };

  const handleOrder = async () => {
    if (!user) return navigate("/login");
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.pinCode || !shippingInfo.phoneNo) {
      toast.error("Please fill shipping info");
      return;
    }
    try {
      await createOrder({
        shippingInfo,
        orderItems: items.map((i) => ({ product: i._id, name: i.name, price: i.price, image: i.image, quantity: i.quantity })),
        paymentInfo: { id: "sample", status: "succeeded" },
        itemsPrice: totalPrice,
        taxPrice: totalPrice * 0.18,
        shippingPrice: totalPrice > 500 ? 0 : 50,
        totalPrice: totalPrice + totalPrice * 0.18 + (totalPrice > 500 ? 0 : 50),
      }).unwrap();
      toast.success("Order placed!");
      dispatch(clearCart());
      navigate("/orders");
    } catch (err) {
      toast.error(err.data?.message || "Order failed");
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="text-primary hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div key={item._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm"
          >
            <img src={item.image} alt={item.name} className="w-20 h-20 object-contain bg-gray-50 rounded" />
            <div className="flex-1">
              <Link to={`/product/${item._id}`} className="font-semibold hover:text-primary">{item.name}</Link>
              <p className="text-primary font-bold">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleQty(item, -1)} className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200">−</button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button onClick={() => handleQty(item, 1)} className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200">+</button>
            </div>
            <p className="font-semibold w-20 text-right">₹{item.price * item.quantity}</p>
            <button onClick={() => dispatch(removeFromCart(item._id))} className="text-danger hover:underline text-sm">Remove</button>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-3">Shipping Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input placeholder="Address" value={shippingInfo.address} onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="City" value={shippingInfo.city} onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="State" value={shippingInfo.state} onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Pin Code" type="number" value={shippingInfo.pinCode} onChange={(e) => setShippingInfo({ ...shippingInfo, pinCode: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Phone" value={shippingInfo.phoneNo} onChange={(e) => setShippingInfo({ ...shippingInfo, phoneNo: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-lg">Total: <span className="font-bold text-xl">₹{totalPrice.toFixed(2)}</span></p>
          <p className="text-sm text-gray-500">Tax: 18% | Shipping: {totalPrice > 500 ? "Free" : "₹50"}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => dispatch(clearCart())} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Clear</button>
          <button onClick={handleOrder} disabled={ordering} className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition">
            {ordering ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
