// https://{{api_key}}:{{api_secret}}@api.{{cluster}}.com/{{lang}}/orders.json?fields=id,createdAt,updatedAt,number,status,priceIncl,firstname,lastname,products
// ----------------------------------------------------------------------

export const orders_list = {
  orders: [
    {
      id: 218248201,
      createdAt: '2022-06-14T14:24:34+02:00',
      updatedAt: '2022-06-17T22:56:38+02:00',
      number: 'ORD00003',
      status: 'cancelled',
      priceIncl: 265.77,
      firstname: 'Test',
      lastname: 'Tester',
      products: {
        resource: {
          id: false,
          url: 'orders/218248201/products',
          link: 'https://api.webshopapp.com/nl/orders/218248201/products.json',
        },
      },
    },
    {
      id: 218248085,
      createdAt: '2022-06-14T14:23:15+02:00',
      updatedAt: '2022-06-14T14:23:40+02:00',
      number: 'ORD00002',
      status: 'processing_awaiting_shipment',
      priceIncl: 265.75,
      firstname: 'Test',
      lastname: 'Tester',
      products: {
        resource: {
          id: false,
          url: 'orders/218248085/products',
          link: 'https://api.webshopapp.com/nl/orders/218248085/products.json',
        },
      },
    },
    {
      id: 201834349,
      createdAt: '2021-11-29T12:04:09+01:00',
      updatedAt: '2021-11-29T12:04:21+01:00',
      number: 'ORD00001',
      status: 'processing_awaiting_shipment',
      priceIncl: 265.75,
      firstname: 'Test',
      lastname: 'Tester',
      products: {
        resource: {
          id: false,
          url: 'orders/201834349/products',
          link: 'https://api.webshopapp.com/nl/orders/201834349/products.json',
        },
      },
    },
  ],
};
