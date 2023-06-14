// @mui
import {
  Box,
  Card,
  CardHeader,
  CardProps,
  LinearProgress,
  Link,
  Stack,
  Typography,
} from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
import { NavLink as RouterLink } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { useCallback, useEffect, useState } from 'react';
import { countOrdersByStatus } from '../../../../utils/api';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  action?: React.ReactNode;
  subheader?: string;
  // data: {
  //   status: string;
  //   quantity: number;
  //   value: number;
  // }[];
}

export default function DashboardTotalOrders({ title, action, subheader, ...other }: Props) {
  // const data = [...Array(3)].map((_, index) => ({
  //   status: ['Pending', 'Cancel', 'Done'][index],
  //   quantity: [12, 10, 2000][index],
  //   value: [40, 45, 80][index],
  // }));
  // console.log(data);
  const [data, setData] = useState<{ status: string; quantity: number; value: number }[]>([
    {
      status: 'Pending',
      quantity: 0,
      value: 0,
    },
    {
      status: 'Cancel',
      quantity: 0,
      value: 0,
    },
    {
      status: 'Done',
      quantity: 0,
      value: 0,
    },
  ]);

  const getDashboard = useCallback(async () => {
    try {
      let sttArr = {
        processing_awaiting_shipment: 0,
        cancelled: 0,
        completed_shipped: 0,
      };

      await Promise.all(
        Object.entries(sttArr).map(async ([status]) => {
          // @ts-ignore
          const res = await countOrdersByStatus(status);
          // @ts-ignore
          sttArr[status] = res.data.count;
          return res.data;
        })
      );

      const sumOrders = Object.values(sttArr).reduce((a, b) => a + b);

      const data = [...Array(3)].map((_, index) => ({
        status: ['Pending', 'Cancel', 'Done'][index],
        quantity: [sttArr.processing_awaiting_shipment, sttArr.cancelled, sttArr.completed_shipped][
          index
        ],
        value: [
          (sttArr.processing_awaiting_shipment * 100) / sumOrders,
          (sttArr.cancelled * 100) / sumOrders,
          (sttArr.completed_shipped * 100) / sumOrders,
        ][index],
      }));
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getDashboard().then();
  }, [getDashboard]);

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={3} sx={{ px: 3, my: 5 }}>
        {data.map((progress) => (
          <LinearProgress
            variant="determinate"
            key={progress.status}
            value={progress.value}
            color={
              (progress.status === 'Pending' && 'warning') ||
              (progress.status === 'Cancel' && 'error') ||
              'success'
            }
            sx={{ height: 8, bgcolor: 'grey.50016' }}
          />
        ))}
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{ px: 3, pb: 3 }}>
        {data.map((progress) => (
          <Stack key={progress.status} alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  bgcolor: 'success.main',
                  ...(progress.status === 'Pending' && { bgcolor: 'warning.main' }),
                  ...(progress.status === 'Cancel' && { bgcolor: 'error.main' }),
                }}
              />

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {progress.status}
              </Typography>
            </Stack>

            <Typography variant="h6">{fShortenNumber(progress.quantity)}</Typography>
          </Stack>
        ))}
      </Stack>
      <Stack sx={{ px: 3, pb: 3 }} alignItems="flex-end">
        <Link noWrap underline="none" component={RouterLink} to={`${PATH_DASHBOARD.order.list}`}>
          {action}
        </Link>
      </Stack>
    </Card>
  );
}
