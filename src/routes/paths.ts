// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
};

export const PATH_PAGE = {
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },
  order: {
    root: path(ROOTS_DASHBOARD, '/orders'),
    list: path(ROOTS_DASHBOARD, '/orders/list'),
    search: path(ROOTS_DASHBOARD, '/orders/search'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/orders/${id}`),
  },
  product: {
    root: path(ROOTS_DASHBOARD, '/products'),
    list: path(ROOTS_DASHBOARD, '/products/list'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/products/${id}`),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
  },
};

export const PATH_DOCS = 'https://www.onlinedistributeur.nl/';
