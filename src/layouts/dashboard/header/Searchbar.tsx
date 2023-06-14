import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { alpha, styled } from '@mui/material/styles';
import {
  Autocomplete,
  ClickAwayListener,
  InputAdornment,
  Link,
  Popper,
  PopperProps,
  Slide,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
// hooks
import useDebouncedCallback from '../../../hooks/useDebouncedCallback';
// components
import Iconify from '../../../components/Iconify';
import SearchNotFound from '../../../components/SearchNotFound';
import { IconButtonAnimate } from 'src/components/animate';
// utils
import cssStyles from '../../../utils/cssStyles';
import { searchProducts } from '../../../utils/api';
// graphql
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled('div')(({ theme }) => ({
  ...cssStyles(theme).bgBlur(),
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: APPBAR_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

const autocompleteStyle = {
  width: 1,
  height: 1,
  '& .MuiFormControl-root, .MuiOutlinedInput-root, .MuiAutocomplete-input': {
    height: 1,
    p: '0 !important',
    fontWeight: 'fontWeightBold',
    '& fieldset': { display: 'none' },
    // textTransform: 'uppercase',
  },
};

const PopperStyle = styled((props: PopperProps) => <Popper {...props} />)(({ theme }) => ({
  left: `8px !important`,
  top: `${APPBAR_MOBILE + 8}px !important`,
  width: 'calc(100% - 16px) !important',
  transform: 'none !important',
  [theme.breakpoints.up('md')]: {
    top: `${APPBAR_DESKTOP + 8}px !important`,
  },
  '& .MuiAutocomplete-paper': {
    padding: theme.spacing(1, 0),
  },
  '& .MuiListSubheader-root': {
    '&.MuiAutocomplete-groupLabel': {
      ...cssStyles(theme).bgBlur({ color: theme.palette.background.neutral }),
      ...theme.typography.overline,
      top: 0,
      margin: 0,
      lineHeight: '48px',
      borderRadius: theme.shape.borderRadius,
    },
  },
  '& .MuiAutocomplete-listbox': {
    '& .MuiAutocomplete-option': {
      padding: theme.spacing(0.5, 2),
      margin: 0,
      display: 'block',
      border: `dashed 1px transparent`,
      borderBottom: `dashed 1px ${theme.palette.divider}`,
      '&:hover': {
        border: `dashed 1px ${theme.palette.primary.main}`,
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
      },
    },
  },
}));

export type SearchProduct = {
  id: string;
  createdTime?: string;
  fields: {
    Title: string;
    Product_ID: number;
    search_data: string;
    Article_Code: string
  };
};

// ----------------------------------------------------------------------

export default function Searchbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);

  const [isOpen, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const searchProductsCall = useDebouncedCallback(async (search: string) => {
    if (search.length > 1) {
      setIsSearching(true)
      const res = await searchProducts({ search });
      setSearchResults(res.data);
      setIsSearching(false)
    }
  }, 500);

  const handleChangeSearch = async (value: string, event: React.SyntheticEvent<Element, Event>) => {
    if (event?.type === 'change') {
      setSearchQuery(value);
      await searchProductsCall(value.toUpperCase());
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!isOpen && (
          <IconButtonAnimate onClick={handleOpen}>
            <Iconify icon={'eva:search-fill'} width={20} height={20} />
          </IconButtonAnimate>
        )}

        <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
          <SearchbarStyle>
            <Autocomplete
              loading={isSearching}
              sx={autocompleteStyle}
              autoHighlight
              disablePortal
              disableClearable
              fullWidth
              PopperComponent={PopperStyle}
              popupIcon={null}
              options={searchResults}
              onInputChange={(event, value) => handleChangeSearch(value, event)}
              getOptionLabel={(product: SearchProduct) => product.fields.search_data}
              noOptionsText={<SearchNotFound searchQuery={searchQuery} />}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  autoFocus
                  placeholder={'Search products'}
                  InputProps={{
                    style: { textTransform: 'uppercase' },
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify
                          icon={'eva:search-fill'}
                          sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              renderOption={(props, product) => {
                const { fields } = product;

                return (
                  <li {...props}>
                    <Link
                      underline="none"
                      to={`${PATH_DASHBOARD.product.view(fields.Product_ID.toString())}`}
                      component={RouterLink}
                    >
                      <Stack direction={'row'}>
                        <Typography variant="subtitle2" sx={{ p: 1 }}>
                          {fields.Title}
                        </Typography>
                      </Stack>
                    </Link>
                  </li>
                );
              }}
            />
          </SearchbarStyle>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
