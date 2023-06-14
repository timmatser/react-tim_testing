import React, { useCallback, useEffect, useState } from 'react';
// @mui
import {
  Card,
  Container,
  Divider,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator } from '../../hooks/useTable';
import useLocales from '../../hooks/useLocales';
// @types
import { Order, OrderStatusNum } from '../../@types/order';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton,
} from '../../components/table';
// sections
import { OrderTableRow, OrderTableToolbar } from '../../sections/@dashboard/orders';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
// redux
import { dispatch, useSelector } from '../../redux/store';
import { resetViewedOrderPage, setOrdersState, setViewedOrderPage } from '../../redux/slices/order';
// pull to refresh
import PullToRefresh from 'pulltorefreshjs';
// styles component
import { styled } from '@mui/material/styles';
// utils (api)
import { countOrdersByStatus, getOrders as apiGetOrders } from '../../utils/api';
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
export default function OrderList() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const { viewedOrderPage, orders: ordersCached } = useSelector((state) => state.order);
  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs(viewedOrderPage.status);
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    setPage,
    onSelectAllRows,
    onSort,
    onChangePage,
  } = useTable({
    defaultRowsPerPage: viewedOrderPage.rowsPerPage || 25,
    defaultCurrentPage: viewedOrderPage.page < 0 ? 0 : viewedOrderPage.page, // Cached or not
    defaultOrderBy: 'createdAt',
  });

  const [filterName, setFilterName] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [totalOrderByStatus, setTotalOrderByStatus] = useState<number>(0);
  const [orderByStatus, setOrderByStatus] = useState<OrderStatusNum | null>();

  const countOrderByStatus = useCallback(async () => {
    try {
      let numOfOrder = {};
      await Promise.all(
        Object.values(TABS).map(async (tab) => {
          const res = await countOrdersByStatus(tab.value);
          Object.assign(numOfOrder, { [tab.value]: res.data.count || 0 });
          return res.data;
        })
      );
      setOrderByStatus(numOfOrder);
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line
  }, []);
  const [orders, setOrders] = useState<Order[]>([]);
  const isMountedRef = useIsMountedRef();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isChangeStatus, setIsChangeStatus] = useState<boolean>(false);
  const getOrders = useCallback(
    async (resetList, filterStatus, currentPage) => {
      try {
        setIsLoading(true);
        setIsFetching(false);
        const res = await apiGetOrders({
          fields: 'id,createdAt,updatedAt,number,status,priceIncl,firstname,lastname,products',
          limit: rowsPerPage,
          page: 1 + currentPage,
          status: filterStatus,
        });
        if (isMountedRef.current) {
          setOrders((prevState) => {
            if (prevState.length > 0 && !resetList) {
              const newOrders = [...prevState, ...res.data.orders];
              dispatch(setOrdersState(newOrders));
              return newOrders;
            } else {
              dispatch(setOrdersState(res.data.orders));
              if (viewedOrderPage.scrollY !== null) {
                dispatch(resetViewedOrderPage());
              }
              return res.data.orders;
            }
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
        setIsChangeStatus(false);
      }
    },
    // eslint-disable-next-line
    [rowsPerPage, isMountedRef]
  );

  // Get orders when access page or change filterStatus
  useEffect(() => {
    if (filterStatus === viewedOrderPage.status && viewedOrderPage.page >= 0) {
      // Cached and status not changed
      setOrders(ordersCached);
      setIsLoading(false);
    } else {
      getOrders(true, filterStatus, 0).then();
    }
    setIsChangeStatus(true);
    // eslint-disable-next-line
  }, [filterStatus]);

  useEffect(() => {
    if (filterStatus === viewedOrderPage.status && viewedOrderPage.scrollY !== null) {
      setTimeout(() => {
        window.scrollTo(0, viewedOrderPage.scrollY || 0);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewedOrderPage.scrollY]);

  useEffect(() => {
    if (ordersCached) {
      setIsChangeStatus(false);
    }
  }, [ordersCached]);

  // Page changes
  useEffect(() => {
    // If current page is the newest then we will fetch order
    // const is_fetch_newest = (page + 1) * rowsPerPage > ordersCached.length + rowsPerPage - 1;
    const is_fetch_newest = page * rowsPerPage + 1 > ordersCached.length;
    if (page !== 0 && is_fetch_newest) {
      // Calculate current_page to call LightSpeed API to get data in next page
      const current_page = Math.floor(orders.length / rowsPerPage);
      getOrders(false, filterStatus, current_page).then();
    }
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (!orderByStatus) {
      countOrderByStatus().then();
    }
    if (orderByStatus && filterStatus) {
      setTotalOrderByStatus(
        orderByStatus && orderByStatus[filterStatus] ? orderByStatus[filterStatus] : 0
      );
    }
  }, [countOrderByStatus, orderByStatus, filterStatus]);

  useEffect(() => {
    if (isLoading) {
      PullToRefresh.destroyAll();
      return;
    }
    PullToRefresh.init({
      mainElement: '#pull-header',
      async onRefresh() {
        getOrders(true, filterStatus, 0).then();
        setPage(0);
        const arr = [
          {
            status: 'all',
            count: orderByStatus?.all || 0,
          },
        ];
        if (filterStatus !== 'all') {
          arr.push({
            status: filterStatus,
            count: orderByStatus ? orderByStatus[filterStatus] : 0,
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
    if (!isFetching || isLoading) return;
    onChangePage(null, page + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, isLoading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleScroll = () => {
    if (
      !isFetching &&
      !isLoading &&
      orders.length !== totalOrderByStatus &&
      Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight
    ) {
      setIsFetching(true);
      onChangePage(null, page + 1);
    }
  };

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleViewRow = () => {
    dispatch(
      setViewedOrderPage({
        page: page,
        status: filterStatus,
        rowsPerPage: rowsPerPage,
        scrollY: window.scrollY,
      })
    );
    // navigate(PATH_DASHBOARD.order.view(id));
  };

  const dataFiltered = applySortFilter({
    orders,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isNotFound = !dataFiltered.length && !!filterName;

  const TABS = {
    all: { value: 'all', label: 'All', color: 'info', count: orderByStatus?.all },
    completed_shipped: {
      value: 'completed_shipped',
      label: 'Completed',
      color: 'success',
      count: orderByStatus?.completed_shipped,
    },
    processing_awaiting_shipment: {
      value: 'processing_awaiting_shipment',
      label: 'Awaiting Shipment',
      color: 'warning',
      count: orderByStatus?.processing_awaiting_shipment,
    },
    processing_awaiting_payment: {
      value: 'processing_awaiting_payment',
      label: 'Awaiting Payment',
      color: 'error',
      count: orderByStatus?.processing_awaiting_payment,
    },
    cancelled: {
      value: 'cancelled',
      label: 'Cancelled',
      color: 'error',
      count: orderByStatus?.cancelled,
    },
  } as const;

  return (
    <Page title="Order: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('Order List')}
          links={[
            { name: translate('Dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Order List') },
          ]}
        />
        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={(event: React.SyntheticEvent<Element, Event>, newValue: string) => {
              onFilterStatus(event, newValue);
              setPage(0);
            }}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {Object.values(TABS).map((tab) => (
              <Tab
                disabled={isLoading}
                disableRipple
                key={tab.value}
                value={tab.value}
                icon={<Label color={tab.color}> {tab.count} </Label>}
                label={tab.label}
              />
            ))}
          </Tabs>

          <Divider />

          <OrderTableToolbar filterName={filterName} onFilterName={handleFilterName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 'xs', position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={orders.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      orders.map((row) => row.id.toString())
                    )
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={orders.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />
                <TableHeadPullRefresh>
                  <tr>
                    <th colSpan={TABLE_HEAD.length}>
                      <div id="pull-header" />
                    </th>
                  </tr>
                </TableHeadPullRefresh>
                {isChangeStatus && [...Array(5)].map((_, index) => <TableSkeleton key={index} />)}
                {!isChangeStatus && (
                  <TableBody>
                    {dataFiltered.map((row) => (
                      <OrderTableRow
                        key={row.id}
                        row={row}
                        TABS={TABS}
                        onViewRow={() => handleViewRow()}
                      />
                    ))}
                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                )}
                {isLoading && [...Array(5)].map((_, index) => <TableSkeleton key={index} />)}
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  orders,
  comparator,
  filterName,
}: {
  orders: Order[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = orders.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  orders = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    orders = orders.filter((item: Record<string, any>) => {
      const has_name =
        (item.firstname + ' ' + item.lastname).toLowerCase().search(filterName.toLowerCase()) !==
        -1;
      const has_number = item.number.toLowerCase().search(filterName.toLowerCase()) !== -1;
      return has_name || has_number;
    });
  }

  return orders;
}
