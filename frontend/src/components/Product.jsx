import React from "react";
import { Link } from "react-router";

const Product = ({product}) => {
  return (
    <Link to={product._id}>
      <img src={product.image[0]?.url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        {/* Rating Stars */} <span>({product.numOfReviews} Reviews)</span>
      </div>
      <span>₹ {product.price}</span>
    </Link>
  );
};

export default Product;
