// @mui
import { Box, Card, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// @type
import { OrderDashboard } from '../../../../@types/dashboard';
// components
import Iconify from '../../../../components/Iconify';
// ----------------------------------------------------------------------

type Props = {
  orderToday: OrderDashboard | undefined;
};

export default function DashboardOrdersToday({ orderToday }: Props) {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        pl: 3,
      }}
    >
      <div>
        <Typography variant="h3">{fShortenNumber(orderToday?.orders || 0)}</Typography>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          Orders today
        </Typography>
      </div>

      <Box>
        <Iconify icon="eva:shopping-cart-outline" width={90} height={90} color="primary.main" />
      </Box>
    </Card>
  );
}
