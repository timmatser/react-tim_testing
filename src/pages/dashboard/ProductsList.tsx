import React, { useCallback, useEffect, useState } from 'react';
// @mui
import { Card, Container, Tab, Table, TableBody, TableContainer, Tabs } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator } from '../../hooks/useTable';
import useTabs from '../../hooks/useTabs';
// @types
import { ProductList } from '../../@types/products';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableNoData, TableSkeleton } from '../../components/table';
import Label from '../../components/Label';
// sections
import ProductListTableRow from '../../sections/@dashboard/product/ProductListTableRow';
// utils
import axios from '../../utils/axios';
// config
import { API_LANG } from '../../config';
// redux
import { dispatch, useSelector } from '../../redux/store';
import { setProductCache, setViewedProductPage } from '../../redux/slices/product';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { setFetching } from '../../redux/slices/api';
// ----------------------------------------------------------------------

export default function ProductsList() {
  const { viewedProductPage, products: productsCached } = useSelector((state) => state.product);
  const { page, order, orderBy, rowsPerPage, selected, onChangePage } = useTable({
    defaultRowsPerPage: viewedProductPage.rowsPerPage || 25,
    defaultCurrentPage: viewedProductPage.page < 0 ? 0 : viewedProductPage.page,
    defaultOrderBy: 'createdAt',
  });

  const { themeStretch } = useSettings();
  const [filterName] = useState('');
  const isMountedRef = useIsMountedRef();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [products, setProducts] = useState<ProductList[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const getNumOfProduct = useCallback(async () => {
    try {
      dispatch(setFetching(true))
      if (viewedProductPage.page >= 0) {
        setNumberOfProducts(viewedProductPage.count);
      } else {
        const response = await axios.get(`/${API_LANG}/products/count.json`);
        setNumberOfProducts(response.data.count);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setFetching(false))
    }
  }, [viewedProductPage]);

  const getProduct = useCallback(
    async (currentPage) => {
      try {
        dispatch(setFetching(true))
        setIsLoading(true);
        const response = await axios.get(`/${API_LANG}/products.json`, {
          params: {
            fields: 'id,title,fulltitle,image',
            limit: rowsPerPage,
            page: currentPage + 1,
          },
        });
        setProducts((prevState) => {
          if (page > 0) {
            const newProduct = [...prevState, ...response.data.products];
            dispatch(setProductCache(newProduct));
            return newProduct;
          } else {
            dispatch(setProductCache(response.data.products));
            return response.data.products;
          }
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
        setIsLoading(false);
        dispatch(setFetching(false))
      }
    },
    [page, rowsPerPage]
  );

  useEffect(() => {
    if (viewedProductPage.page >= 0) {
      setProducts(productsCached);
      setIsLoading(false);
    } else {
      if (isMountedRef.current) {
        getProduct(0).then();
      }
    }

    if (isMountedRef.current) {
      getNumOfProduct().then();
    }
    // eslint-disable-next-line
  }, [isMountedRef]);

  /**
   * Change page
   */
  useEffect(() => {
    // If current page is the newest then we will fetch product
    const is_fetch_newest = page * rowsPerPage + 1 > productsCached.length;
    if (page !== 0 && is_fetch_newest) {
      // Calculate current_page to call LightSpeed API to get data in next page
      const current_page = Math.floor(products.length / rowsPerPage);
      getProduct(current_page).then();
    }
    // eslint-disable-next-line
  }, [page]);
  //
  // useEffect(() => {
  //   if (!isFetching || isLoading) return;
  //   onChangePage(null, page + 1);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isFetching, isLoading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleScroll = () => {
    // Check if scroll position in bottom and ready to load more data
    if (
      !isFetching &&
      !isLoading &&
      products.length !== numberOfProducts &&
      Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight
    ) {
      setIsFetching(true);
      onChangePage(null, page + 1);
    }
  };

  useEffect(() => {
    if (viewedProductPage.scrollY !== null) {
      setTimeout(() => {
        window.scrollTo(0, viewedProductPage.scrollY || 0)
      }, 500)
    }
  }, [viewedProductPage.scrollY])

  const handleViewRow = () => {
    dispatch(
      setViewedProductPage({
        page: page,
        rowsPerPage: rowsPerPage,
        count: numberOfProducts,
        scrollY: window.scrollY,
      })
    );
  };

  const dataFiltered = applySortFilter({
    products,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);
  const TABS = [{ value: 'all', label: 'All', color: 'info', count: numberOfProducts }] as const;
  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  return (
    <Page title="Producten">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Producten"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Producten' }]}
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                icon={<Label color={tab.color}> {tab.count} </Label>}
                label={tab.label}
              />
            ))}
          </Tabs>
          <Scrollbar>
            <TableContainer sx={{ position: 'relative', marginTop: '5px' }}>
              <Table size={'medium'}>
                <TableBody>
                  {dataFiltered.map((row) => (
                    <ProductListTableRow
                      key={row.id}
                      row={row}
                      onViewRow={() => handleViewRow()}
                      selected={selected.includes(row.id.toString())}
                    />
                  ))}
                  <TableNoData isNotFound={isNotFound} />
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

function applySortFilter({
  products,
  comparator,
  filterName,
}: {
  products: ProductList[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = products.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const product = comparator(a[0], b[0]);
    if (product !== 0) return product;
    return a[1] - b[1];
  });

  products = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    products = products.filter(
      (item: Record<string, any>) =>
        item.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return products;
}
