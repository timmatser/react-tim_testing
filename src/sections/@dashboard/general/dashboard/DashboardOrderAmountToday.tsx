import numeral from 'numeral';
// @mui
import { Box, Card, Typography } from '@mui/material';
// @types
import { OrderDashboard } from '../../../../@types/dashboard';
// components
import Iconify from '../../../../components/Iconify';
// ----------------------------------------------------------------------

type Props = {
  orderToday: OrderDashboard | undefined;
};

export default function DashboardOrderAmountToday({ orderToday }: Props) {
  const fCurrency = (number: string | number) =>
    numeral(number).format(Number.isInteger(number) ? '€0,0' : '€0,0.00');
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
        <Typography variant="h3">€ {fCurrency(orderToday?.salesIncl || 0)}</Typography>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          Order amount today
        </Typography>
      </div>

      <Box>
        <Iconify icon="gridicons:money" width={90} height={90} color="primary.main" />
      </Box>
    </Card>
  );
}
