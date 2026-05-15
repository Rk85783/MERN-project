import Product from "../components/Product";
import { useGetAllProductsQuery } from "../store/productApi";
import Loader from "../components/layouts/Loader";
import { motion } from "motion/react";

const Home = () => {
  const { data, isLoading, error } = useGetAllProductsQuery();

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <p className="text-danger text-center mt-8 text-lg">
        {error.data?.message || "Something went wrong"}
      </p>
    );
  }

  const products = data?.products || [];
  const productCount = data?.productCount || 0;

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-blue-50 to-blue-100 py-16 text-center"
      >
        <p className="text-lg text-gray-600">Welcome to</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">
          ShopEase
        </h1>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          FIND AMAZING PRODUCTS BELOW
        </p>
        <a
          href="#products"
          className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary-dark transition"
        >
          Browse Products ↓
        </a>
      </motion.section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Featured Products
        </h2>
        <div id="products" className="flex flex-wrap justify-center gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Product product={product} />
            </motion.div>
          ))}
        </div>
        {productCount > 0 && (
          <p className="text-center text-gray-500 mt-6">
            Showing {products.length} of {productCount} products
          </p>
        )}
      </section>
    </>
  );
};

export default Home;
