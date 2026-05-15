import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useCreateProductMutation, useUpdateProductMutation, useGetProductDetailsQuery } from "../../store/productApi";
import { useGetMeQuery } from "../../store/authApi";
import { toast } from "sonner";
import { motion } from "motion/react";

const NewProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { data: user } = useGetMeQuery();
  const { data: existing } = useGetProductDetailsQuery(id, { skip: !isEdit });
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", stock: "" });

  useEffect(() => {
    if (existing) setForm({ name: existing.name, description: existing.description, price: existing.price, category: existing.category, stock: existing.stock });
  }, [existing]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (isEdit) { await updateProduct({ id, ...body }).unwrap(); toast.success("Product updated"); }
      else { await createProduct(body).unwrap(); toast.success("Product created"); }
      navigate("/admin/products");
    } catch (err) { toast.error(err.data?.message || "Failed"); }
  };

  if (!user || user.role !== "admin") return <p className="text-center mt-10 text-danger">Admin access required</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Product" : "New Product"}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Name</label><input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Price</label><input type="number" name="price" value={form.price} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Stock</label><input type="number" name="stock" value={form.stock} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Category</label><input name="category" value={form.category} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition">{isEdit ? "Update" : "Create"} Product</button>
        </form>
      </motion.div>
    </div>
  );
};

export default NewProduct;
