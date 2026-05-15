import { Link, useNavigate } from "react-router";
import { useGetAllProductsQuery, useDeleteProductMutation } from "../../store/productApi";
import { useGetMeQuery } from "../../store/authApi";
import Loader from "../../components/layouts/Loader";
import { toast } from "sonner";

const ProductList = () => {
  const navigate = useNavigate();
  const { data: user } = useGetMeQuery();
  const { data, isLoading } = useGetAllProductsQuery(undefined, { skip: !user || user?.role !== "admin" });
  const [deleteProduct] = useDeleteProductMutation();

  if (!user || user.role !== "admin") return <p className="text-center mt-10 text-danger">Admin access required</p>;
  if (isLoading) return <Loader />;

  const products = data?.products || [];

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await deleteProduct(id).unwrap(); toast.success("Product deleted"); }
    catch (err) { toast.error(err.data?.message || "Delete failed"); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link to="/admin/product/new" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark">+ New Product</Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-100"><th className="text-left p-3">Product</th><th className="text-left p-3">Price</th><th className="text-left p-3">Stock</th><th className="text-left p-3">Category</th><th className="p-3"></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-3 flex items-center gap-3">
                  <img src={p.image[0]?.url} alt={p.name} className="w-10 h-10 object-contain bg-gray-50 rounded" />
                  <span className="font-semibold">{p.name}</span>
                </td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3"><span className={`${p.stock > 0 ? "text-success" : "text-danger"}`}>{p.stock}</span></td>
                <td className="p-3 text-gray-500">{p.category}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => navigate(`/admin/product/${p._id}`)} className="text-primary hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(p._id, p.name)} className="text-danger hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
