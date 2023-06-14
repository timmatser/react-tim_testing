import { InputAdornment, Stack, TextField } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
// hooks
import useLocales from '../../../hooks/useLocales';
// ----------------------------------------------------------------------

// const INPUT_WIDTH = 160;

type Props = {
  // optionsService: string[];
  filterName: string;
  // filterService: string;
  // filterStartDate: Date | null;
  // filterEndDate: Date | null;
  onFilterName: (value: string) => void;
  // onFilterService: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // onFilterStartDate: (value: Date | null) => void;
  // onFilterEndDate: (value: Date | null) => void;
};

export default function OrderTableToolbar({
  // filterStartDate,
  // filterEndDate,
  filterName,
  onFilterName,
}: // onFilterStartDate,
// onFilterEndDate,
Props) {
  const { translate } = useLocales();

  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
      {/*<DatePicker*/}
      {/*  label={translate('Start date')}*/}
      {/*  value={filterStartDate}*/}
      {/*  onChange={onFilterStartDate}*/}
      {/*  renderInput={(params) => (*/}
      {/*    <TextField*/}
      {/*      {...params}*/}
      {/*      fullWidth*/}
      {/*      sx={{*/}
      {/*        maxWidth: { md: INPUT_WIDTH },*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*/>*/}

      {/*<DatePicker*/}
      {/*  label={translate('End date')}*/}
      {/*  value={filterEndDate}*/}
      {/*  onChange={onFilterEndDate}*/}
      {/*  renderInput={(params) => (*/}
      {/*    <TextField*/}
      {/*      {...params}*/}
      {/*      fullWidth*/}
      {/*      sx={{*/}
      {/*        maxWidth: { md: INPUT_WIDTH },*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*/>*/}

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder={translate('Search on name or ordernummer')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon={'eva:search-fill'}
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
