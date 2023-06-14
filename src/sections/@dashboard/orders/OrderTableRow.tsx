// @mui
import { Link as RouterLink } from 'react-router-dom';
import { Link, Stack, TableCell, TableRow, Typography } from '@mui/material';
// @types
import { Order } from '../../../@types/order';
// utils
import { fDateTime } from '../../../utils/formatTime';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import Label from '../../../components/Label';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

type Props = {
  row: Order;
  onViewRow: VoidFunction;
  TABS: any;
};

export default function OrderTableRow({ row, onViewRow, TABS }: Props) {
  const { status, number, lastname, firstname, createdAt, priceIncl, id } = row;
  const isDesktop = useResponsive('up', 'sm');
  return (
    <>
      {isDesktop ? (
        <TableRow hover>
          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
            <Stack>
              <Link
                component={RouterLink}
                to={PATH_DASHBOARD.order.view(id.toString())}
                sx={{ cursor: 'pointer' }}
                variant="subtitle2"
                onClick={onViewRow}
                noWrap
              >
                {number}
              </Link>
              <Typography variant="body2" noWrap>
                {firstname} {lastname}
              </Typography>
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                <Label color={TABS[status].color}> {TABS[status].label} </Label>
              </Typography>
            </Stack>
          </TableCell>
          <TableCell align="left">
            <Stack>
              <Typography variant="subtitle2" color="primary" noWrap>
                € {priceIncl}
              </Typography>
              <Typography variant="body2" noWrap>
                {fDateTime(createdAt)}
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow hover>
          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
            <Stack width={120}>
              <Link
                component={RouterLink}
                to={PATH_DASHBOARD.order.view(id.toString())}
                sx={{ cursor: 'pointer' }}
                variant="subtitle2"
                onClick={onViewRow}
                noWrap
              >
                {number}
              </Link>
              <Typography variant="body2" noWrap>
                {firstname} {lastname}
              </Typography>
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                <Label color={TABS[status].color}> {TABS[status].label} </Label>
              </Typography>
            </Stack>
          </TableCell>
          <TableCell align="left">
            <Stack>
              <Typography variant="subtitle2" color="primary" noWrap>
                € {priceIncl}
              </Typography>
              <Typography variant="body2" noWrap>
                {fDateTime(createdAt)}
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
