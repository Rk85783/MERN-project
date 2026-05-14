import React, { useEffect } from "react";
import { BsMouse } from "react-icons/bs";
import Product from "./Product";
import { useSelector, useDispatch } from "react-redux";
import { getProduct } from "../actions/productAction";
import Loader from "./layouts/Loader";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products, productsCount } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      return alert(error);
    }
    dispatch(getProduct());
  }, [dispatch, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>
            <a href="">
              <button>
                Scroll <BsMouse />
              </button>
            </a>
          </div>
          <h2>Featured Products</h2>
          <div>{products && products.map((product) => <Product key={product._id} product={product} />)}</div>
        </>
      )}
    </>
  );
};

export default Home;
