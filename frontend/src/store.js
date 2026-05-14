import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./reducers/productReducer";

export default configureStore({
  reducer: {
    products: productReducer
  },
});
