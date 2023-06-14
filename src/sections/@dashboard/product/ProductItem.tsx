import { useCallback, useEffect, useState } from 'react';
// @mui
import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// @type
import { IProductVariant, ProductDetail, ProductItems } from '../../../@types/products';
// utils
import axios from '../../../utils/axios';
import { API_LANG } from '../../../config';
// sections
import ProductVariant from './ProductVariant';
import { useSearchParams } from 'react-router-dom';
import { dispatch } from '../../../redux/store';
import { setFetching } from '../../../redux/slices/api';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

type Props = {
  productDetail: ProductDetail;
  id: string | undefined;
};
export default function ProductItem({ productDetail, id }: Props) {
  const [variantsProduct, setVariantsProduct] = useState<ProductItems>();
  const [variants, setVariants] = useState();
  const [searchParams] = useSearchParams();

  const getVariantsProduct = useCallback(async () => {
    try {
      dispatch(setFetching(true))
      const response = await axios.get(`/${API_LANG}/variants.json`, { params: { product: id } });
      const variant_param = searchParams.get('variant');
      let variant_idx = 0;
      if (variant_param) {
        variant_idx = response.data.variants.findIndex(
          (item: IProductVariant) => item.id === parseInt(variant_param || '')
        );
        // Not found
        if (variant_idx === -1) {
          variant_idx = 0;
        }
      }

      setVariantsProduct(response.data.variants[variant_idx]);
      setVariants(response.data.variants);
      dispatch(setFetching(false))
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    getVariantsProduct().then();
  }, [getVariantsProduct]);

  return (
    <RootStyle>
      <Stack spacing={2}>
        <Typography variant="h5" paragraph>
          {productDetail?.fulltitle} && {variantsProduct?.title}
        </Typography>
        <Stack direction="row">
          <Box display="flex">
            <Typography variant="body2" fontWeight="bold">
              SKU:&nbsp;
            </Typography>
            <Typography variant="body2">{variantsProduct?.sku}</Typography>
          </Box>
        </Stack>
        <Stack direction="row">
          <Box display="flex">
            <Typography variant="body2" fontWeight="bold">
              Speciale prijs:&nbsp;
            </Typography>
            {variantsProduct && (
              <Stack>
                {variantsProduct?.oldPriceIncl > 0 ? (
                  <Typography variant="body2">€ {variantsProduct?.oldPriceIncl}</Typography>
                ) : (
                  <Typography variant="body2">{''}</Typography>
                )}
              </Stack>
            )}
          </Box>
        </Stack>
        <Stack direction="row">
          <Box display="flex">
            <Typography variant="body2" fontWeight="bold">
              Prijs:&nbsp;
            </Typography>
            <Typography variant="body2">€ {variantsProduct?.priceIncl}</Typography>
          </Box>
        </Stack>
        <Stack direction="row">
          <Box display="flex">
            <Typography variant="body2" fontWeight="bold">
              Optie:&nbsp;
            </Typography>
            <Typography variant="body2">{variantsProduct?.title}</Typography>
          </Box>
        </Stack>
        <Stack direction="row">
          <Box display="flex">
            <Typography variant="body2" fontWeight="bold">
              Beschikbaarheid:&nbsp;
            </Typography>
            <Typography variant="body2">{variantsProduct?.stockLevel}</Typography>
          </Box>
        </Stack>
      </Stack>
      {variants && <ProductVariant variants={variants} />}
    </RootStyle>
  );
}
