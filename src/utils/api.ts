import axios from './axios';
import { API_LANG, HOST_ORIGIN_API } from '../config';
import { OrderApiParam, OrderSearchApiParam, OrderStatus } from '../@types/order';

// TODO: add showLoadingLayer = false to dispatch(setFetching(true)) to every api functions
/**
 * Could number of order by status
 *
 * @param status : OrderStatus
 */
export function countOrdersByStatus(status: OrderStatus) {
  return axios.get(`/${API_LANG}/orders/count.json`, {
    params: { status: status },
  });
}

/**
 * Get orders
 * @param params : OrderApiParam
 */
export function getOrders(params: OrderApiParam) {
  return axios.get(`/${API_LANG}/orders.json`, {
    params: {
      fields: params.fields,
      limit: params.limit || 25,
      page: params.page || 1,
      status: params.status,
    },
  });
}

export function getOrdersSearch(params: OrderSearchApiParam) {
  if (params) {
    return axios.get(`/orders`, { params });
  }

  return axios.get(`/orders`);
}

export function searchProducts(params: { search: string }) {
  return axios.get(`${HOST_ORIGIN_API}/airtable/products`, { params });
}
