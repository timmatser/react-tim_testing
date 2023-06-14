import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Link, Stack, TableCell, TableRow, Typography } from '@mui/material';
// @types
import { Order } from '../../../@types/order';
// utils
import { fDateTime } from '../../../utils/formatTime';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

type Props = {
  row: Order;
};

export default function SearchOrderTableRow({ row }: Props) {
  const { number, lastname, firstname, createdAt, priceIncl } = row;
  const isDesktop = useResponsive('up', 'sm');
  return (
    <>
      {isDesktop ? (
        <TableRow hover>
          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
            <Stack>
              <Link
                noWrap
                variant="subtitle2"
                component={RouterLink}
                to={PATH_DASHBOARD.order.view(row.id.toString())}
                sx={{ cursor: 'pointer' }}
              >
                {number}
              </Link>
              <Typography variant="body2" noWrap>
                {firstname} {lastname}
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
                noWrap
                variant="subtitle2"
                href={PATH_DASHBOARD.order.view(row.id.toString())}
                sx={{ cursor: 'pointer' }}
              >
                {number}
              </Link>
              <Typography variant="body2" noWrap>
                {firstname} {lastname}
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
