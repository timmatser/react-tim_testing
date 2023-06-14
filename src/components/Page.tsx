import { Helmet } from 'react-helmet-async';
import { forwardRef, ReactNode } from 'react';
// @mui
import { Box, BoxProps } from '@mui/material';
import LoadingLayer from './LoadingLayer';
import { useSelector } from '../redux/store';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  children: ReactNode;
  meta?: ReactNode;
  title: string;
}
const Page = forwardRef<HTMLDivElement, Props>(({ children, title = '', meta, ...other }, ref) => {
  const { fetching } = useSelector((state) => state.api);

  return <>
    <Helmet>
      <title>{`${title} | Order insights`}</title>
      {meta}
    </Helmet>

    <Box ref={ref} {...other}>
      {fetching && <LoadingLayer />}
      {children}
    </Box>
  </>
});

export default Page;
