import { ElementType, lazy, Suspense } from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = useAuth();

  const isDashboard = pathname.includes('/dashboard') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <Dashboard /> },
        {
          path: 'orders',
          children: [
            { element: <Navigate to="/dashboard/orders/list" replace />, index: true },
            { path: 'list', element: <OrderList /> },
            { path: 'search', element: <SearchOrder /> },
            { path: ':id', element: <OrderDetails /> },
          ],
        },
        {
          path: 'products',
          children: [
            { element: <Navigate to="/dashboard/products/list" replace />, index: true },
            { path: 'list', element: <ProductList /> },
            { path: ':id', element: <ProductDetails /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/account" replace />, index: true },
            { path: 'account', element: <UserAccount /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        // { element: <HomePage />, index: true },
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));

// DASHBOARD

// GENERAL
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/Dashboard')));

// ORDER
const OrderList = Loadable(lazy(() => import('../pages/dashboard/OrderList')));
const OrderDetails = Loadable(lazy(() => import('../pages/dashboard/OrderDetails')));

// SEARCH-ORDER
const SearchOrder = Loadable(lazy(() => import('../pages/dashboard/SearchOrder')));

// PRODUCT
const ProductList = Loadable(lazy(() => import('../pages/dashboard/ProductsList')));
const ProductDetails = Loadable(lazy(() => import('../pages/dashboard/ProductDetails')));

// USER
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));

// MAIN
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));
