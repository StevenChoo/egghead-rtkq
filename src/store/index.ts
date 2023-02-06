import { configureStore } from "@reduxjs/toolkit";
import servicesReducer from "../pages/services/servicesSlice";
import dogsReducer from "../pages/dogs/dogsSlice";
import cartReducer from "../pages/checkout/cartSlice";

export const store = configureStore({
  reducer: {
    dogs: dogsReducer,
    services: servicesReducer,
    cart: cartReducer,
  },
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
