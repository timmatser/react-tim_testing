import { useCallback, useEffect, useState } from 'react';
// @mui
import { Button, Container, Grid } from '@mui/material';
// components
import Page from '../../components/Page';
// hooks
import useSettings from '../../hooks/useSettings';
// sections
import {
  DashboardOrderAmountToday,
  DashboardOrderLast7Day,
  DashboardOrdersToday,
  DashboardTotalOrders,
} from '../../sections/@dashboard/general/dashboard';
// utils
import axios from '../../utils/axios';
// config
import { API_LANG } from '../../config';
// @types
import { OrderDashboard } from '../../@types/dashboard';
import { format } from 'date-fns';
import { sortBy } from 'lodash';
// redux
import { dispatch } from '../../redux/store';
import { setFetching } from '../../redux/slices/api';
// ----------------------------------------------------------------------

export default function Dashboard() {
  const themeStretch = useSettings();
  const [orderToday, setOrderToday] = useState<OrderDashboard>();
  const [dayInWeek, setDayInWeek] = useState<string[]>([]);
  const [oneDayTotal, setOneDayTotal] = useState<number[]>([]);

  const getDashboard = useCallback(async () => {
    try {
      dispatch(setFetching(true));
      const response = await axios.get(`/${API_LANG}/dashboard.json`);
      const periods = sortBy(response.data.dashboard.periods, 'date');
      setOrderToday(
        periods.find((c: OrderDashboard) => c.date === format(new Date(), 'yyyy-MM-dd'))
      );
      setDayInWeek(periods.map((o: OrderDashboard) => format(new Date(o.date), 'dd-MM')));
      setOneDayTotal(periods.map((o: OrderDashboard) => o.orders));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setFetching(false));
    }
  }, []);

  useEffect(() => {
    getDashboard();
  }, [getDashboard]);

  return (
    <Page title="Dashboard">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DashboardOrdersToday orderToday={orderToday} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardOrderAmountToday orderToday={orderToday} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardTotalOrders
              title="Total orders per status"
              action={<Button variant="contained">Order List</Button>}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardOrderLast7Day
              title="#Order last 7 days"
              chartLabels={dayInWeek}
              chartData={[
                {
                  data: [{ name: 'Total', data: oneDayTotal }],
                },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
