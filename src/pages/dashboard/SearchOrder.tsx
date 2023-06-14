import React, { useCallback, useEffect, useState } from 'react';
// @mui
import { Card, Container, Table, TableBody, TableContainer } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
import useLocales from '../../hooks/useLocales';
// @types
import { Order, OrderSearchApiParam, OrderStatusNum } from '../../@types/order';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableHeadCustom, TableNoData, TableSkeleton } from '../../components/table';
// sections
import SearchOrderTableRow from '../../sections/@dashboard/orders/SearchOrderTableRow';
import SearchOrderTableToolbar from '../../sections/@dashboard/orders/SearchOrderTableToolbar';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useDebouncedCallback from '../../hooks/useDebouncedCallback';
// pull to refresh
import PullToRefresh from 'pulltorefreshjs';
// styles component
import { styled } from '@mui/material/styles';
// utils (api)
import { countOrdersByStatus, getOrdersSearch as apiGetOrders } from '../../utils/api';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'number', label: 'Number', align: 'left' },
  { id: 'priceIncl', label: 'Price', align: 'left' },
];

const TableHeadPullRefresh = styled('thead')(({ theme }) => ({
  '& .ptr--ptr': {
    boxShadow: 'none',
  },
  '& .ptr--icon, & .ptr--text': {
    color: theme.palette.text.secondary,
  },
}));

// ----------------------------------------------------------------------
export default function SearchOrder() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const { dense, order, orderBy, selected, onSort } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const [filterName, setFilterName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderByStatus, setOrderByStatus] = useState<OrderStatusNum | null>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderParams, setOrderParams] = useState<OrderSearchApiParam>({ status: 'all' });
  const isMountedRef = useIsMountedRef();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const getOrders = useCallback(
    async (resetList, orderByStatus, lastEvaluatedKey, orderNumber?: string) => {
      try {
        setIsLoading(true);

        let params = {
          lastEvaluatedKey: lastEvaluatedKey,
          status: orderByStatus,
          number: '',
        };
        if (orderNumber) {
          params = {
            ...params,
            number: orderNumber.startsWith('ORD') ? orderNumber : `ORD${orderNumber}`,
          };
        }
        setOrderParams(params);
        const res = await apiGetOrders(params);
        if (isMountedRef.current) {
          setOrders((prevState) =>
            prevState.length > 0 && !resetList
              ? [...prevState, ...res.data.orders]
              : res.data.orders
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    }, // eslint-disable-next-line
    [isMountedRef]
  );

  const searchOrder = useDebouncedCallback(
    async (orderNumber: string, filterStatus: string, searchName: string) => {
      if (searchName === '') {
        setOrders([]);
        return;
      } else if (
        (orderNumber.length < 5 && !orderNumber.startsWith('ORD')) ||
        (orderNumber.length < 8 && orderNumber.startsWith('ORD'))
      ) {
        return;
      }
      setOrders([]);
      await getOrders(true, filterStatus, null, orderNumber);
    },
    500
  );

  useEffect(() => {
    if (isLoading) {
      PullToRefresh.destroyAll();
      return;
    }
    PullToRefresh.init({
      mainElement: '#pull-header',
      async onRefresh() {
        getOrders(true, orderParams.status, null).then();
        const arr = [
          {
            status: 'all',
            count: orderByStatus?.all || 0,
          },
        ];
        if (orderParams.status !== 'all') {
          arr.push({
            status: orderParams.status,
            count: orderByStatus ? orderByStatus[orderParams.status] : 0,
          });
        }

        await Promise.all(
          arr.map(async (obj) => {
            // @ts-ignore
            const res = await countOrdersByStatus(obj.status);
            setOrderByStatus((prevState) => {
              if (prevState) {
                prevState[obj.status] = res.data.count;
              }
              return prevState;
            });
            return res.data;
          })
        );
      },
    });

    // Specify how to clean up after this effect:
    return function cleanup() {
      PullToRefresh.destroyAll();
    };
  });

  useEffect(() => {
    if (!isFetching || isLoading || !orderParams.lastEvaluatedKey) return;
    getOrders(false, orderParams.status, orderParams.lastEvaluatedKey, filterName).then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleScroll = () => {
    if (isFetching || isLoading) return;

    if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
      setIsFetching(true);
    }
  };

  const handleFilterName = (filterName: string) => {
    let text = filterName.toUpperCase();
    searchOrder(text, orderParams.status, text);
    setFilterName(text);
  };

  const isNotFound = !orders.length && !isLoading;
  return (
    <Page title={translate('Zoek bestelling')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('Zoek bestelling')}
          links={[
            {
              name: translate('Dashboard'),
              href: PATH_DASHBOARD.root,
            },
            { name: translate('Zoek bestelling') },
          ]}
        />
        <Card>
          <SearchOrderTableToolbar filterName={filterName} onFilterName={handleFilterName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 'xs', position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                {orders.length > 0 && (
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={orders.length}
                    numSelected={selected.length}
                    onSort={onSort}
                  />
                )}
                <TableHeadPullRefresh>
                  <tr>
                    <th colSpan={TABLE_HEAD.length}>
                      <div id="pull-header" />
                    </th>
                  </tr>
                </TableHeadPullRefresh>
                <TableBody>
                  {orders.map((row) => (
                    <SearchOrderTableRow key={row.id} row={row} />
                  ))}
                  <TableNoData
                    isNotFound={isNotFound}
                    title={
                      filterName ? 'We cannot find this order, please check your ordernumber' : ''
                    }
                  />
                </TableBody>
                {isLoading && [...Array(5)].map((_, index) => <TableSkeleton key={index} />)}
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}
