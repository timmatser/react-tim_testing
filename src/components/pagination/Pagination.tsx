import React from 'react';
// @mui
import { TablePagination } from '@mui/material';
// ----------------------------------------------------------------------

type Props = {
  total: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export default function Pagination({
  total,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
}: Props) {
  return (
    <TablePagination
      rowsPerPageOptions={[25, 50]}
      component="div"
      count={total}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
}