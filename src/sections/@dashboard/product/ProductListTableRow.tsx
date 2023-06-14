import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Link, Stack, TableCell, TableRow, Typography } from '@mui/material';
// components
import { ProductList } from '../../../@types/products';
import Image from '../../../components/Image';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

type Props = {
  row: ProductList;
  selected?: boolean;
  onViewRow?: VoidFunction;
};

export default function ProductListTableRow({ row, onViewRow, selected }: Props) {
  const { title, fulltitle, image, id } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Image
          disabledEffect
          alt={title}
          src={image.thumb}
          sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
        />
        <Stack>
          <Link
            component={RouterLink}
            to={PATH_DASHBOARD.product.view(id.toString())}
            sx={{ cursor: 'pointer' }}
            variant="subtitle2"
            onClick={onViewRow}
            noWrap
          >
            {title}
          </Link>
          <Typography variant="body2" noWrap>
            {fulltitle}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="right"> {} </TableCell>
    </TableRow>
  );
}
