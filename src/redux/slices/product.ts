import { createSlice } from '@reduxjs/toolkit';
import { ProductState } from '../../@types/product';

// ----------------------------------------------------------------------

const initialState: ProductState = {
  isLoading: false,
  error: null,
  products: [],
  viewedProductPage: {
    page: -1,
    rowsPerPage: 25,
    scrollY: null,
    count: 0,
  },
  product: null,
  sortBy: null,
  filters: {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: '',
    rating: '',
  },
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
  },
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProductCache(state, action) {
      state.products = action.payload;
    },

    setViewedProductPage(state, action) {
      state.viewedProductPage = { ...state.viewedProductPage, ...action.payload };
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setProductCache, setViewedProductPage } = slice.actions;
