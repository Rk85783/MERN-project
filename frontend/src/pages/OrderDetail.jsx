import { useParams } from "react-router";
import { useGetSingleOrderQuery } from "../store/orderApi";
import { useGetMeQuery } from "../store/authApi";
import Loader from "../components/layouts/Loader";
import { motion } from "motion/react";

const statusColor = (status) => {
  switch (status) {
    case "Processing": return "text-yellow-600 bg-yellow-50";
    case "Shipped": return "text-blue-600 bg-blue-50";
    case "Delivered": return "text-success bg-green-50";
    default: return "text-gray-500 bg-gray-50";
  }
};

const OrderDetail = () => {
  const { id } = useParams();
  const { data: user } = useGetMeQuery();
  const { data: order, isLoading, error } = useGetSingleOrderQuery(id, { skip: !user });

  if (!user) return <Loader />;
  if (isLoading) return <Loader />;
  if (error) return <p className="text-danger text-center mt-8">{error.data?.message}</p>;
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Order #{order._id.slice(-8)}</h1>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColor(order.orderStatus)}`}>{order.orderStatus}</span>
        <p className="text-sm text-gray-500 mt-2">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        {order.deliveredAt && <p className="text-sm text-gray-500">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Shipping Info</h2>
        <p><span className="text-gray-500">Address:</span> {order.shippingInfo.address}, {order.shippingInfo.city}</p>
        <p><span className="text-gray-500">Phone:</span> {order.shippingInfo.phone}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4 border-b pb-3 last:border-0">
              <div className="w-16 h-16 bg-gray-50 rounded flex items-center justify-center">
                {item.image && <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
              </div>
              <p className="font-semibold">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span>Items</span><span>₹{order.itemsPrice}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>₹{order.taxPrice}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice}`}</span></div>
          <hr />
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{order.totalPrice}</span></div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetail;
