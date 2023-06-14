import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Container, Grid } from '@mui/material';
// components
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
// routes
import { PATH_DASHBOARD, PATH_PAGE } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// sections
import ProductItem from '../../sections/@dashboard/product/ProductItem';
import ProductDetailCarousel from '../../sections/@dashboard/product/ProductDetailCarousel';
// utils
import axios from '../../utils/axios';
// config
import { API_LANG } from '../../config';
// @type
import { ProductDetail } from '../../@types/products';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// redux
import { dispatch } from '../../redux/store';
import { setFetching } from '../../redux/slices/api';
// ----------------------------------------------------------------------

export default function ProductDetails() {
  const themeStretch = useSettings();
  const navigate = useNavigate();
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState<ProductDetail>();
  const isMountedRef = useIsMountedRef();

  const getProductDetail = useCallback(async () => {
    try {
      dispatch(setFetching(true))
      const response = await axios.get(`/${API_LANG}/products/${id}.json`);
      setProductDetail(response.data.product);
      dispatch(setFetching(false))
    } catch (error) {
      if (error.error?.code === 404) {
        navigate(PATH_PAGE.page404, { replace: true });
      }
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (isMountedRef.current) {
      getProductDetail().then();
    }
    // eslint-disable-next-line
  }, [isMountedRef]);

  return (
    <Page title="Product: View">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Producten',
              href: PATH_DASHBOARD.product.list,
            },
            { name: productDetail?.title || '' },
          ]}
        />
        <Card>
          {productDetail && (
            <Grid container>
              <Grid item xs={12} md={6} lg={7}>
                <ProductDetailCarousel id={id} />
              </Grid>
              <Grid item xs={12} md={6} lg={5}>
                <ProductItem productDetail={productDetail} id={id} />
              </Grid>
            </Grid>
          )}
        </Card>
      </Container>
    </Page>
  );
}
