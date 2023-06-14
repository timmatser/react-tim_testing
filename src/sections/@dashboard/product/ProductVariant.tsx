import React, { useState } from 'react';
import { styled } from '@mui/system';
import { ButtonGroup, IconButton, Stack, TextField, Typography } from '@mui/material';
import { cloneDeep, map, sortBy } from 'lodash';
import { useSnackbar } from 'notistack';
import axios from '../../../utils/axios';
import { API_LANG } from '../../../config';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import { ProductVariants } from '../../../@types/products';
import { LoadingButton } from '@mui/lab';

type VariantState = {
  id: number;
  title: string;
  stockLevel: number;
  sortOrder: number;
  random?: number;
};

const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& input': {
      textAlign: 'center',
      fontSize: '0.875rem',
      width: 'auto',
    },
    '&:hover fieldset': {
      borderColor: 'green',
    },
  },
});

export default function ProductVariant({ variants }: ProductVariants) {
  const [values, setValues] = useState<VariantState[]>(cloneDeep(variants));
  const [isUpdating, setIsUpdating] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const onSave = async () => {
    try {
      setIsUpdating(true);
      await axios.put(`/${API_LANG}/variants/bulk.json`, {
        variant: map(values, (value) => ({
          id: value.id,
          stockLevel: value.stockLevel,
        })),
      });
      enqueueSnackbar('Updated successfully!');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Fail!', { variant: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const renderOutOfStock = (stock: number) => {
    if (stock > 0) {
      return <Label color="success">op voorraad</Label>;
    }

    return <Label color="error">out of stock</Label>;
  };

  const handleInput = (
    event: React.ChangeEvent<{ value: string }>,
    index: number,
    item: { stockLevel: number }
  ) => {
    item.stockLevel = event.target.value === '' ? 0 : parseInt(event.target.value);
    setValues([...values]);
  };

  const handleChange = (index: number, item: { stockLevel: number }, type: number) => {
    item.stockLevel += type;
    if (item.stockLevel < 0) {
      item.stockLevel = 0;
    }
    setValues([...values]);
  };

  return (
    <>
      <Stack py={2}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '20%', textAlign: 'left' }}>
                <Typography variant="body2" fontWeight="bold" style={{ marginLeft: '50px' }}>
                  Aantal
                </Typography>
              </th>
              <th style={{ textAlign: 'left' }}>
                <Typography variant="body2" fontWeight="bold">
                  Maat
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortBy(values, ['sortOrder']).map((item, index) => (
              <tr key={`${index}_${item.id}`}>
                <td>
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined primary button group"
                    key={`${index}_${item.id}`}
                    style={{ padding: 2 }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => handleChange(index, item, -1)}
                      style={{ marginRight: 2 }}
                    >
                      <Iconify icon={'eva:minus-fill'} />
                    </IconButton>
                    <CssTextField
                      type="number"
                      InputProps={{
                        inputProps: {
                          max: 100,
                          min: 10,
                        },
                      }}
                      hiddenLabel
                      variant="outlined"
                      value={item.stockLevel}
                      onChange={(event) => handleInput(event, index, item)}
                    />
                    <IconButton
                      color="primary"
                      onClick={() => handleChange(index, item, 1)}
                      style={{ marginLeft: 2 }}
                    >
                      <Iconify icon={'eva:plus-fill'} />
                    </IconButton>
                  </ButtonGroup>
                </td>
                <td>
                  <Typography variant="body2">{item?.title}</Typography>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {renderOutOfStock(item.stockLevel)}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Stack>
      <Stack direction="row" spacing={1.5} justifyContent="start">
        <LoadingButton
          loading={isUpdating}
          color="primary"
          variant={'contained'}
          size="medium"
          onClick={onSave}
          style={{ marginLeft: '110px' }}
        >
          Update
        </LoadingButton>
      </Stack>
    </>
  );
}
