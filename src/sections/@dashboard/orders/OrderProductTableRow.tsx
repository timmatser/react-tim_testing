import { useCallback, useState } from 'react';
// @mui
import { Link, Stack, TableCell, TableRow, Typography } from '@mui/material';
// @types
import { OrderProducts, productImage } from '../../../@types/order';
// components
import Image from '../../../components/Image';
import LightboxModal from '../../../components/LightboxModal';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import axios from '../../../utils/axios';
import { API_LANG } from '../../../config';
import { sortBy } from 'lodash';
import { Link as RouterLink } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

type Props = {
  row: OrderProducts;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function OrderProductTableRow({ row, selected }: Props) {
  const {
    product,
    productImage,
    priceIncl,
    productTitle,
    sku,
    quantityOrdered,
    variant,
    variantTitle,
    isNotFoundProduct,
  } = row;

  const total = priceIncl * quantityOrdered;
  const isDesktop = useResponsive('up', 'sm');
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [imagesLightbox, setImagesLightbox] = useState<string[]>([]);

  const getProductImages = useCallback(async () => {
    try {
      const images = await axios.get(`/${API_LANG}/products/${product.resource.id}/images.json`);
      const imageSort = sortBy(images.data.productImages, ['sortOrder']);
      setImagesLightbox(imageSort.map((image: productImage) => image.src));
      return imageSort;
    } catch (error) {
      console.error(error);
    }
  }, [product]);

  const handleOpenLightbox = async (url: string) => {
    setOpenLightbox(true);
    if (!imagesLightbox.length) {
      const productImages = await getProductImages();
      const selectedImage = productImages?.findIndex((item: productImage) => item.src === url) || 0;
      setSelectedImage(selectedImage);
    }
  };
  return (
    <TableRow
      hover
      selected={selected}
      title={isNotFoundProduct ? 'The details of the product are not available' : productTitle}
    >
      <TableCell
        size="small"
        padding="none"
        sx={{
          '&.MuiTableCell-root': {
            paddingLeft: 1,
          },
        }}
      >
        {productImage && (
          <Image
            disabledEffect
            alt={productTitle}
            src={productImage.src}
            onClick={() => (isNotFoundProduct ? undefined : handleOpenLightbox(productImage.src))}
            sx={{
              borderRadius: 0.5,
              width: 50,
              height: 100,
              cursor: isNotFoundProduct ? 'default' : 'pointer',
            }}
          />
        )}
        {imagesLightbox && !isNotFoundProduct && (
          <LightboxModal
            images={imagesLightbox}
            mainSrc={imagesLightbox[selectedImage] ?? productImage.src}
            photoIndex={selectedImage}
            setPhotoIndex={setSelectedImage}
            isOpen={openLightbox}
            onCloseRequest={() => setOpenLightbox(false)}
            wrapperClassName={imagesLightbox.length ? '' : 'loading'}
          />
        )}
      </TableCell>
      {isDesktop ? (
        <>
          <TableCell sx={{ alignItems: 'center' }}>
            <Stack spacing={1}>
              <Stack direction="row">
                <Typography variant="subtitle2" fontWeight="bold" />
                <Link
                  noWrap
                  component={RouterLink}
                  to={`${PATH_DASHBOARD.product.view(product.resource.id.toString())}?variant=${
                    variant.resource.id
                  }`}
                  sx={{
                    cursor: 'pointer',
                    fontSize: 'small',
                    pointerEvents: isNotFoundProduct ? 'none' : 'initial',
                  }}
                >
                  {productTitle}
                </Link>
              </Stack>
              <Stack direction="row">
                <Typography variant="subtitle2" fontWeight="bold" />
                <Typography variant="body2" sx={{ fontSize: 'small' }}>
                  {sku}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography variant="subtitle2" fontWeight="bold">
                  Variant:&nbsp;
                </Typography>
                <Typography variant="body2">{variantTitle}</Typography>
              </Stack>
              <Stack direction="row">
                <Typography variant="subtitle2" fontWeight="bold">
                  Aantal:&nbsp;
                </Typography>
                <Typography variant="body2">{quantityOrdered}</Typography>
              </Stack>
            </Stack>
          </TableCell>
          <TableCell align="left">€&nbsp;{priceIncl}</TableCell>
          <TableCell align="left">€&nbsp;{total}</TableCell>
        </>
      ) : (
        <TableCell
          sx={{
            paddingLeft: 1,
            paddingRight: 1,
          }}
        >
          <Stack spacing={1} maxWidth={250}>
            <Stack direction="row" alignItems="center">
              <Typography variant="subtitle2" fontWeight="bold" />
              <Link
                variant="subtitle2"
                component={RouterLink}
                to={`${PATH_DASHBOARD.product.view(product.resource.id.toString())}?variant=${
                  variant.resource.id
                }`}
                sx={{
                  cursor: 'pointer',
                  fontSize: 'small',
                  pointerEvents: isNotFoundProduct ? 'none' : 'initial',
                }}
              >
                {productTitle}
              </Link>
            </Stack>
            <Stack direction="row">
              <Typography variant="subtitle2" fontWeight="bold" />
              <Typography noWrap variant="body2" sx={{ fontSize: 'small' }}>
                {sku}
              </Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="subtitle2" fontWeight="bold" />
              <Typography variant="body2">{variantTitle}</Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="subtitle2" fontWeight="bold">
                Aantal:&nbsp;
              </Typography>
              <Typography variant="body2">{quantityOrdered}</Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="subtitle2" fontWeight="bold">
                Prijs:&nbsp;
              </Typography>
              <Typography variant="body2">€&nbsp;{priceIncl}</Typography>
              <Typography variant="subtitle2" fontWeight="bold">
                &nbsp;&nbsp;Totaal:&nbsp;
              </Typography>
              <Typography variant="body2">€&nbsp;{total}</Typography>
            </Stack>
          </Stack>
        </TableCell>
      )}
    </TableRow>
  );
}
