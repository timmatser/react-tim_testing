import React, { useCallback, useEffect, useState } from 'react';
// @mui
import {
  Box,
  Card,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import useTable, { emptyRows, getComparator } from '../../../hooks/useTable';
// @types
import { OrderProducts } from '../../../@types/order';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSkeleton,
} from '../../../components/table';
import Pagination from '../../../components/pagination/Pagination';
// sections
import OrderProductTableRow from './OrderProductTableRow';
// utils
import axios from '../../../utils/axios';
// config
import { API_LANG } from '../../../config';
// routes
import { sumBy } from 'lodash';
import { dispatch } from '../../../redux/store';
import { setTotalQuantity } from '../../../redux/slices/order';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: 'image' },
  { id: 'product', label: 'Product' },
  {
    id: 'price',
    label: 'Prijs',
  },
  { id: 'total', label: 'Totaal' },
];
const TABLE_HEAD_MOBILE = [
  { id: '', label: 'image', width: 50 },
  { id: 'product', label: 'Product' },
];

// ----------------------------------------------------------------------
type Props = {
  order_id: string | undefined;
};
export default function OrderProduct({ order_id }: Props) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage, //
    selected,
    setSelected,
    onSelectRow, //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const isDesktop = useResponsive('up', 'sm');
  const [tableData, setTableData] = useState<OrderProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfOrdersProduct, setNumberOfOrdersProduct] = useState(0);
  const [totalQty, setTotalQty] = useState(0);

  const getNumOfOrdersProduct = useCallback(async () => {
    try {
      const response = await axios.get(`/${API_LANG}/orders/${order_id}/products/count.json`);
      setNumberOfOrdersProduct(response.data.count);
    } catch (error) {
      console.error(error);
    }
  }, [order_id]);

  const getOrdersProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/${API_LANG}/orders/${order_id}/products.json`);
      let { orderProducts } = response.data;
      const sum = sumBy(orderProducts, 'quantityOrdered');
      setTotalQty(sum);
      dispatch(setTotalQuantity(sum));

      const productImages = await getProductImg(orderProducts);
      orderProducts.forEach((item: OrderProducts) => {
        let tmp = productImages.find((val) => val?.id === item.id);
        item.productImage = tmp?.productImage || null;
        item.isNotFoundProduct = tmp?.isNotFoundProduct || false;
      });
      setTableData(orderProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [order_id]);

  // TODO: need to refactor
  const getProductImg = async (products: OrderProducts[]) => {
    const result = await Promise.all(
      products.map(async (item: OrderProducts) => {
        try {
          const res = await axios.get(`/${API_LANG}/products/${item.product.resource.id}.json`);

          return {
            id: item.id,
            productImage: res.data.product.image,
          };
        } catch (err) {
          console.log('Error get product image ', err);
          return {
            id: item.id,
            productImage: {
              src: '/logo/logo-short.png'
            },
            isNotFoundProduct: true
          }
        }
      })
    );
    return result;
  };

  const [filterName] = useState('');

  useEffect(() => {
    if (!numberOfOrdersProduct) {
      getNumOfOrdersProduct().then();
    } else {
      getOrdersProduct().then();
    }
  }, [getNumOfOrdersProduct, getOrdersProduct, numberOfOrdersProduct]);

  const handleDeleteRow = (id: string) => {
    const deleteRow = tableData.filter((row) => row.id.toString() !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  // const handleDeleteRows = (selected: string[]) => {
  //   const deleteRows = tableData.filter((row) => !selected.includes(row.id.toString()));
  //   setSelected([]);
  //   setTableData(deleteRows);
  // };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="Bestel Details">
      <Typography variant="subtitle1" sx={{ m: 1.5 }}>
        Product Gegevens: {totalQty} Product(en)
      </Typography>
      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 'xs', position: 'relative' }}>
            <Table size={dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={isDesktop ? TABLE_HEAD : TABLE_HEAD_MOBILE}
                rowCount={tableData.length}
                numSelected={selected.length}
                onSort={onSort}
                sx={{
                  '& .MuiTableCell-root': {
                    '&:first-of-type': {
                      paddingLeft: 1,
                      borderBottomLeftRadius: 0,
                      boxShadow: 'none',
                    },
                    '&:last-of-type': {
                      paddingLeft: 1,
                      borderBottomRightRadius: 0,
                      boxShadow: 'none',
                    },
                  },
                }}
              />
              {isLoading && [...Array(5)].map((_, index) => <TableSkeleton key={index} />)}
              {!isLoading && (
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <OrderProductTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id.toString())}
                        onSelectRow={() => onSelectRow(row.id.toString())}
                        onDeleteRow={() => handleDeleteRow(row.id.toString())}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <Box sx={{ position: 'relative' }}>
          <Pagination
            total={numberOfOrdersProduct}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />

          <FormControlLabel
            control={<Switch checked={dense} onChange={onChangeDense} />}
            label="Dense"
            sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
          />
        </Box>
      </Card>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
}: {
  tableData: OrderProducts[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return tableData;
}
