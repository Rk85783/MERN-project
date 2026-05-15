import { Link } from "react-router";
import { motion } from "motion/react";

const Product = ({ product }) => {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/product/${product._id}`}
        className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden w-60"
      >
        <div className="h-48 flex items-center justify-center p-4 bg-gray-50">
          <img
            src={product.image?.[0]?.url}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="p-4">
          <p className="font-semibold text-gray-800 truncate">
            {product.name}
          </p>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <span>⭐ {product.ratings?.toFixed(1) || "0.0"}</span>
            <span>({product.numOfReviews} Reviews)</span>
          </div>
          <span className="text-lg font-bold text-primary mt-2 block">
            ₹{product.price}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default Product;
