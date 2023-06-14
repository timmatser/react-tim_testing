import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import productReducer from './slices/product';
import orderReducer from './slices/order';
import apiReducer from './slices/api'

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const apiPersistConfig = {
  key: 'api',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
}

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout', 'products'],
};

const orderPersistConfig = {
  key: 'order',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['totalQuantity', 'orders', 'orderApiParam'],
};

const rootReducer = combineReducers({
  product: persistReducer(productPersistConfig, productReducer),
  order: persistReducer(orderPersistConfig, orderReducer),
  api: persistReducer(apiPersistConfig, apiReducer),
});

export { rootPersistConfig, rootReducer };
