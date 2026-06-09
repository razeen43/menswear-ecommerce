import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type WishlistItem = {
  productId: string;
  title: string;
  brand: string;
  price: number;
  image: string;
};

type WishlistState = {
  items: WishlistItem[];
};

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );

      if (existingItem) {
        state.items = state.items.filter(
          (item) => item.productId !== action.payload.productId
        );
      } else {
        state.items.push(action.payload);
      }
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;