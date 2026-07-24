import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Track } from '../components/TrackCard';

export interface CartItem extends Track {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state: CartState, action: PayloadAction<Track>) {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1; // RTK uses Immer — looks mutative but stays immutable
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart(state: CartState, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity(state: CartState, action: PayloadAction<{ id: number; delta: number }>) {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, item.quantity + action.payload.delta);
      }
    },
    clearCart(state: CartState) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectTotalItems = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectTotalPrice = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;
