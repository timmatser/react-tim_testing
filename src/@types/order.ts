export type Order = {
  priceExcl: number;
  email: string;
  id: number;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
  number: string;
  status: string;
  priceIncl: number;
  firstname: string;
  lastname: string;
};

export type OrderStatusNum = {
  [key: string]: number;
};
export type OrderDetail = {
  id: number;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
  number: string;
  firstname: string;
  middlename: string;
  lastname: string;
  priceIncl: number;
  status: string;
  email: string;
  customStatusId: null;
  channel: string;
  remoteIp: string;
  userAgent: string;
  referralId: boolean;
  priceCost: number;
  products: {
    resource: {
      embedded: string[];
    };
  };
};

export type productImage = {
  id: string;
  src: string;
  thumb: string;
};

export type OrderProducts = {
  articleCode: string;
  basePriceExcl: number;
  basePriceIncl: number;
  brandTitle: string;
  colli: number;
  customExcl: number;
  customFields: boolean;
  customIncl: number;
  discountExcl: number;
  discountIncl: number;
  ean: string;
  id: number;
  isNotFoundProduct?: boolean;
  productImage: productImage;
  priceCost: number;
  priceExcl: number;
  priceIncl: number;
  productTitle: string;
  quantityInvoiced: number;
  quantityOrdered: number;
  quantityRefunded: number;
  quantityReturned: number;
  quantityShipped: number;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  sku: string;
  supplierTitle: string;
  taxRate: number;
  variantTitle: string;
  volume: number;
  weight: number;
  product: {
    resource: {
      id: number;
      url: string;
      link: string;
    };
  };
  variant: {
    resource: {
      id: number;
      url: string;
      link: string;
    };
  };
};

export type ViewOrderPage = {
  page: number;
  rowsPerPage: number;
  status: OrderStatus;
  scrollY: number | null;
};

export type OrderState = {
  totalQuantity: number;
  orders: Order[];
  viewedOrderPage: ViewOrderPage;
  orderApiParam: OrderApiParam;
};

export type OrderStatus =
    | 'completed_shipped'
    | 'processing_awaiting_shipment'
    | 'processing_awaiting_payment'
    | 'cancelled'
    | 'all';

export type OrderApiParam = {
  fields?: string;
  limit?: number;
  page?: number;
  status?: OrderStatus;
};

export type OrderSearchApiParam = {
  lastEvaluatedKey?: object | null;
  status: OrderStatus;
  number?: string;
};