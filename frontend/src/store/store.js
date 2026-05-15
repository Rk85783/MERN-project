import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./productApi";
import { authApi } from "./authApi";
import { orderApi } from "./orderApi";
import cartReducer from "./cartSlice";

const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(authApi.middleware)
      .concat(orderApi.middleware),
});

export default store;
