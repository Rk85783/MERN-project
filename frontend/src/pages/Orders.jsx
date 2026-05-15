import { Link } from "react-router";
import { useMyOrdersQuery } from "../store/orderApi";
import { useGetMeQuery } from "../store/authApi";
import Loader from "../components/layouts/Loader";

const statusColor = (status) => {
  switch (status) {
    case "Processing": return "text-yellow-600";
    case "Shipped": return "text-blue-600";
    case "Delivered": return "text-success";
    default: return "text-gray-500";
  }
};

const Orders = () => {
  const { data: user } = useGetMeQuery();
  const { data: orders, isLoading, error } = useMyOrdersQuery(undefined, { skip: !user });

  if (!user) return <p className="text-center mt-10"><Link to="/login" className="text-primary hover:underline">Login to see your orders</Link></p>;
  if (isLoading) return <Loader />;
  if (error) return <p className="text-danger text-center mt-8">{error.data?.message}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {!orders?.length ? (
        <p className="text-gray-500">No orders yet. <Link to="/" className="text-primary hover:underline">Start shopping</Link></p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Items</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Date</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{order._id.slice(-8)}</td>
                  <td className="p-3">{order.orderItems.length} items</td>
                  <td className="p-3 font-semibold">₹{order.totalPrice}</td>
                  <td className={`p-3 font-semibold ${statusColor(order.orderStatus)}`}>{order.orderStatus}</td>
                  <td className="p-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-3"><Link to={`/order/${order._id}`} className="text-primary hover:underline">Details</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
