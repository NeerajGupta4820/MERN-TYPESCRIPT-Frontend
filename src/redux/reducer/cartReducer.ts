import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, ShippingInfo } from "../../types/types";
import { CartReducerInitialState } from "../../types/reducer-types";

const loadCartState = (): CartReducerInitialState => {
  const cartState = localStorage.getItem("cartState");
  return cartState ? JSON.parse(cartState) : initialState;
};

const saveCartState = (state: CartReducerInitialState) => {
  localStorage.setItem("cartState", JSON.stringify(state));
};

const initialState: CartReducerInitialState = {
  loading: false,
  cartItems: [],
  subtotal: 0,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
  shippingInfo: { address: "", city: "", state: "", country: "", pinCode: "" },
};

export const cartReducer = createSlice({
  name: "cartReducer",
  initialState: loadCartState(),
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.loading = true;
      const index = state.cartItems.findIndex(
        (i) => i.productId === action.payload.productId
      );

      if (index !== -1) state.cartItems[index] = action.payload;
      else state.cartItems.push(action.payload);
      
      state.loading = false;
      saveCartState(state);
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.cartItems = state.cartItems.filter(
        (i) => i.productId !== action.payload
      );
      state.loading = false;
      saveCartState(state);
    },
    calculatePrice: (state) => {
      const subtotal = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      state.subtotal = subtotal;
      state.shippingCharges = state.subtotal >= 1000 ? 0 : 100;
      state.tax = Math.round(state.subtotal * 0.18);
      state.total =
        state.subtotal + state.tax + state.shippingCharges - state.discount;
      saveCartState(state);
    },
    discountApplied: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
      saveCartState(state);
    },
    saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
      saveCartState(state);
    },
    resetCart: () => {
      const newState = initialState;
      saveCartState(newState);
      return newState;
    },
  },
});

export const {
  addToCart,
  removeCartItem,
  calculatePrice,
  discountApplied,
  saveShippingInfo,
  resetCart,
} = cartReducer.actions;
