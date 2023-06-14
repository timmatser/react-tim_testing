import { format } from 'date-fns';
// @mui
import { Box, Card, Grid, Link, Stack, Typography } from '@mui/material';
// @type
import { OrderDetail } from '../../../@types/order';
// components
import Label from '../../../components/Label';
// redux
import { useSelector } from '../../../redux/store';
// ----------------------------------------------------------------------

type Props = {
  orderDetail: OrderDetail | undefined;
  TABS: any;
};

export default function OrderItem({ orderDetail, TABS }: Props) {
  const fDate = (date: Date | string | number) => format(new Date(date), 'yyyy-MM-dd');
  const { totalQuantity } = useSelector((state) => state.order);

  return (
    <Stack>
      <Card sx={{ py: 5, px: 5 }}>
        <Grid container>
          <Stack spacing={2}>
            <Stack direction="row">
              <Box display="flex">
                <Typography variant="body2" fontWeight="bold">
                  Naam:&nbsp;
                </Typography>
                <Typography variant="body2">
                  {orderDetail?.number} {orderDetail?.firstname} {orderDetail?.lastname}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row">
              <Box display="flex">
                <Typography variant="body2" fontWeight="bold">
                  E-mail:&nbsp;
                </Typography>
                <Link variant="body2" color={'error.main'} href={`mailto:${orderDetail?.email}`}>
                  {orderDetail?.email}
                </Link>
              </Box>
            </Stack>
            <Stack direction="row">
              <Box display="flex">
                <Typography variant="body2" fontWeight="bold">
                  Aantal:&nbsp;
                </Typography>
                <Typography variant="body2">{orderDetail ? totalQuantity: ''}</Typography>
              </Box>
            </Stack>
            <Stack direction="row">
              <Box display="flex">
                <Typography variant="body2" fontWeight="bold">
                  Eindtotaal:&nbsp;
                </Typography>
                <Typography variant="body2">€&nbsp;{orderDetail?.priceIncl}</Typography>
              </Box>
            </Stack>
            <Stack direction="row">
              <Box display="flex">
                <Typography variant="body2" fontWeight="bold">
                  Besteldatum:&nbsp;
                </Typography>
                <Typography variant="body2">
                  {fDate(orderDetail?.createdAt || new Date())}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row">
              <Box display="flex">
                <Typography variant="body2" fontWeight="bold">
                  Status:&nbsp;
                </Typography>
                {orderDetail?.status && (
                  <Label color={TABS[orderDetail?.status].color}>
                    {TABS[orderDetail?.status].label}
                  </Label>
                )}
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </Card>
    </Stack>
  );
}
