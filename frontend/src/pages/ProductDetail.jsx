import { useParams } from "react-router";
import { useGetProductDetailsQuery, useGetProductReviewsQuery, useCreateReviewMutation, useDeleteReviewMutation } from "../store/productApi";
import { useGetMeQuery } from "../store/authApi";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import Loader from "../components/layouts/Loader";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: user } = useGetMeQuery();
  const { data: product, isLoading, error } = useGetProductDetailsQuery(id);
  const { data: reviews = [], refetch: refetchReviews } = useGetProductReviewsQuery(id);
  const [createReview] = useCreateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-danger text-center mt-8 text-lg">{error.data?.message || "Something went wrong"}</p>;
  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart({ _id: product._id, name: product.name, price: product.price, image: product.image?.[0]?.url }));
    toast.success(`${product.name} added to cart`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error("Please select a rating"); return; }
    try {
      await createReview({ rating, comment, productId: id }).unwrap();
      toast.success("Review submitted");
      setRating(0); setComment(""); setShowForm(false);
      refetchReviews();
    } catch (err) { toast.error(err.data?.message || "Review failed"); }
  };

  const handleDeleteReview = async (reviewId) => {
    try { await deleteReview({ id, reviewId }).unwrap(); toast.success("Review deleted"); refetchReviews(); }
    catch (err) { toast.error(err.data?.message || "Delete failed"); }
  };

  const inStock = product.stock > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <div className="flex flex-col md:flex-row gap-8">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="flex-1 bg-gray-50 rounded-xl p-8 flex items-center justify-center"
        >
          <img src={product.image?.[0]?.url} alt={product.name} className="max-w-full max-h-96 object-contain" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-500">Product # {product._id}</p>
          <div className="text-3xl font-bold text-primary">₹{product.price}</div>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-yellow-500 font-semibold">⭐ {product.ratings?.toFixed(1) || "0.0"}</span>
            <span className="text-gray-500">({product.numOfReviews} Reviews)</span>
            <span className={`font-semibold ${inStock ? "text-success" : "text-danger"}`}>{inStock ? "In Stock" : "Out of Stock"}</span>
          </div>
          <motion.button whileHover={inStock ? { scale: 1.05 } : {}} whileTap={inStock ? { scale: 0.95 } : {}}
            onClick={handleAddToCart} disabled={!inStock}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition ${inStock ? "bg-primary hover:bg-primary-dark cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
          >{inStock ? "Add to Cart" : "Out of Stock"}</motion.button>
        </motion.div>
      </div>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-xl font-bold mb-4">Reviews ({reviews.length})</h2>
        <div className="space-y-4">
          {!reviews.length && <p className="text-gray-500">No reviews yet.</p>}
          {reviews.map((r) => (
            <div key={r._id} className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <span className="text-yellow-500 text-sm">{'⭐'.repeat(r.rating)}</span>
                </div>
                {user && r.user === user._id && (
                  <button onClick={() => handleDeleteReview(r._id)} className="text-danger hover:underline text-xs">Delete</button>
                )}
              </div>
              <p className="text-gray-600 mt-1 text-sm">{r.comment}</p>
            </div>
          ))}
        </div>

        {user ? (
          <>
            <button onClick={() => setShowForm(!showForm)} className="mt-6 text-primary hover:underline text-sm">
              {showForm ? "Cancel" : "Write a Review"}
            </button>
            {showForm && (
              <form onSubmit={handleReview} className="mt-4 bg-white p-4 rounded-xl shadow-sm space-y-3 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <div className="flex gap-1 text-2xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setRating(star)}
                        className={`${star <= rating ? "text-yellow-500" : "text-gray-300"} hover:text-yellow-400 transition`}
                      >★</button>
                    ))}
                  </div>
                </div>
                <textarea placeholder="Your review..." value={comment} onChange={(e) => setComment(e.target.value)} required rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
                <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark">Submit</button>
              </form>
            )}
          </>
        ) : (
          <p className="mt-4 text-sm text-gray-500"><a href="/login" className="text-primary hover:underline">Login</a> to write a review</p>
        )}
      </motion.section>
    </div>
  );
};

export default ProductDetail;
