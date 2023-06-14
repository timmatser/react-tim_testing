import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Container, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
// routes
import { PATH_DASHBOARD, PATH_PAGE } from '../../routes/paths';
// redux
import { dispatch, useSelector } from '../../redux/store';
import { setFetching } from '../../redux/slices/api';
// hooks
import useSettings from '../../hooks/useSettings';
// sections
import OrderItem from '../../sections/@dashboard/orders/OrderItem';
import OrderProduct from '../../sections/@dashboard/orders/OrderProduct';
// @type
import { OrderDetail } from '../../@types/order';
// utils
import axios from '../../utils/axios';
// config
import { API_LANG } from '../../config';
// ----------------------------------------------------------------------

export default function OrderDetails() {
  const themeStretch = useSettings();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState<OrderDetail>();
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { orders } = useSelector((state) => state.order);
  // Find order index in cache orders list
  const index = orders.findIndex(function (o) {
    return o.id.toString() === id;
  });
  // Handle next/preview order
  const handleViewAnotherOrder = (isNewer: boolean) => {
    const newIndex = isNewer ? index - 1 : index + 1;
    navigate(PATH_DASHBOARD.order.view(orders[newIndex].id.toString()));
  };

  const getOrdersDetail = useCallback(async () => {
    try {
      dispatch(setFetching(true))
      setLoading(true);
      const response = await axios.get(`/${API_LANG}/orders/${id}.json`);
      setOrderDetail(response.data.order);
    } catch (error) {
      if (error.error?.code === 404) {
        navigate(PATH_PAGE.page404, { replace: true });
      }
      console.error(error);
    } finally {
      setLoading(false);
      dispatch(setFetching(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    getOrdersDetail();
  }, [getOrdersDetail]);
  const TABS = {
    completed_shipped: {
      value: 'completed_shipped',
      label: 'Completed',
      color: 'success',
    },
    processing_awaiting_shipment: {
      value: 'processing_awaiting_shipment',
      label: 'Awaiting Shipment',
      color: 'warning',
    },
    processing_awaiting_payment: {
      value: 'processing_awaiting_payment',
      label: 'Awaiting Payment',
      color: 'error',
    },
    cancelled: {
      value: 'cancelled',
      label: 'Cancelled',
      color: 'error',
    },
  };
  return (
    <Page title="Order: View">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="BESTEL DETAILS"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Order List',
              href: PATH_DASHBOARD.order.list,
            },
            { name: orderDetail?.id.toString() || '' },
          ]}
        />
        <OrderItem orderDetail={orderDetail} TABS={TABS} />
        <Stack sx={{ py: 2 }}>
          <OrderProduct order_id={id} />
        </Stack>

        {!!orders.length && (
          <Stack direction={'row'} justifyContent="center" sx={{ my: 1 }} spacing={1}>
            <LoadingButton
              variant="contained"
              disabled={index === 0}
              loading={loading}
              onClick={() => handleViewAnotherOrder(true)}
            >
              <Iconify icon={'fe:arrow-left'} width={20} height={20} />
              Previous
            </LoadingButton>
            <LoadingButton
              variant="contained"
              disabled={index >= orders.length - 1}
              loading={loading}
              onClick={() => handleViewAnotherOrder(false)}
            >
              Next
              <Iconify icon={'fe:arrow-right'} width={20} height={20} />
            </LoadingButton>
          </Stack>
        )}
      </Container>
    </Page>
  );
}
