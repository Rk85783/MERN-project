import { useState } from "react";
import { useGetAllOrdersQuery, useUpdateOrderMutation, useDeleteOrderMutation } from "../../store/orderApi";
import { useGetMeQuery } from "../../store/authApi";
import Loader from "../../components/layouts/Loader";
import { toast } from "sonner";

const statusColor = (s) => {
  switch (s) { case "Processing": return "text-yellow-600"; case "Shipped": return "text-blue-600"; case "Delivered": return "text-success"; default: return ""; }
};

const OrderList = () => {
  const { data: user } = useGetMeQuery();
  const { data, isLoading } = useGetAllOrdersQuery(undefined, { skip: !user || user?.role !== "admin" });
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [status, setStatus] = useState({});

  if (!user || user.role !== "admin") return <p className="text-center mt-10 text-danger">Admin access required</p>;
  if (isLoading) return <Loader />;

  const orders = data?.orders || [];

  const handleStatus = async (id) => {
    const newStatus = status[id];
    if (!newStatus) return;
    try { await updateOrder({ id, status: newStatus }).unwrap(); toast.success("Order updated"); }
    catch (err) { toast.error(err.data?.message || "Update failed"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return;
    try { await deleteOrder(id).unwrap(); toast.success("Order deleted"); }
    catch (err) { toast.error(err.data?.message || "Delete failed"); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Manage Orders (Total: ₹{data?.totalAmount || 0})</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-100"><th className="text-left p-3">Order ID</th><th className="text-left p-3">Items</th><th className="text-left p-3">Total</th><th className="text-left p-3">Status</th><th className="text-left p-3">Date</th><th className="p-3">Action</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">{o._id.slice(-8)}</td>
                <td className="p-3">{o.orderItems.length}</td>
                <td className="p-3 font-semibold">₹{o.totalPrice}</td>
                <td className={`p-3 font-semibold ${statusColor(o.orderStatus)}`}>{o.orderStatus}</td>
                <td className="p-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-3 flex gap-2 items-center">
                  {(o.orderStatus !== "Delivered") && (
                    <>
                      <select value={status[o._id] || ""} onChange={(e) => setStatus({ ...status, [o._id]: e.target.value })} className="border rounded px-2 py-1 text-xs">
                        <option value="">Set status</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <button onClick={() => handleStatus(o._id)} className="text-primary hover:underline text-xs">Update</button>
                    </>
                  )}
                  <button onClick={() => handleDelete(o._id)} className="text-danger hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
