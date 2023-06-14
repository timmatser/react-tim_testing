import { createSlice } from '@reduxjs/toolkit';
import { OrderState } from '../../@types/order';
// ----------------------------------------------------------------------

const initialState: OrderState = {
  totalQuantity: 0,
  orders: [],
  viewedOrderPage: {
    page: -1,
    status: 'completed_shipped',
    rowsPerPage: 25,
    scrollY: null,
  },
  orderApiParam: {
    status: 'completed_shipped',
  },
};

const slice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // START LOADING
    setTotalQuantity(state, action) {
      state.totalQuantity = action.payload;
    },
    setOrdersState(state, action) {
      state.orders = action.payload;
    },
    setViewedOrderPage(state, action) {
      state.viewedOrderPage = action.payload;
    },
    resetViewedOrderPage(state) {
      state.viewedOrderPage = initialState.viewedOrderPage;
    }
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setTotalQuantity, setOrdersState, setViewedOrderPage, resetViewedOrderPage } = slice.actions;

// ----------------------------------------------------------------------
