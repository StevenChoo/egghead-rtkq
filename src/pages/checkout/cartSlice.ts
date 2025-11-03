import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  serviceId: string;
  title: string;
  price: number;
}

interface CartState {
  items: CartItem[];
  checkoutLoading: boolean;
  checkoutError: string | null;
}

const initialState: CartState = {
  items: [],
  checkoutLoading: false,
  checkoutError: null,
};

export const submitCheckout = createAsyncThunk(
  "cart/submitCheckout",
  async ({ dogId, serviceIds }: { dogId: string; serviceIds: string[] }) => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dogId, serviceIds }),
    });

    if (!response.ok) {
      throw new Error("Checkout failed");
    }

    return response.json();
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      // Check if item already exists in cart
      const existingItem = state.items.find(
        (item) => item.serviceId === action.payload.serviceId
      );
      if (!existingItem) {
        state.items.push(action.payload);
        console.log('Added to cart:', action.payload, 'Total items:', state.items.length);
      } else {
        console.log('Item already in cart:', action.payload.serviceId);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.serviceId !== action.payload
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitCheckout.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutError = null;
      })
      .addCase(submitCheckout.fulfilled, (state) => {
        state.checkoutLoading = false;
        state.items = [];
      })
      .addCase(submitCheckout.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutError = action.error.message || "Checkout failed";
      });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
