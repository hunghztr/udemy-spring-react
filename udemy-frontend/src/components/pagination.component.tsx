import { Box, Pagination, Typography } from '@mui/material'
import type { IMetaResponse } from '../type/pagination'

export default function PaginationComponent({meta,page,setPage,pendingCount}:{
    meta : IMetaResponse,page : number,setPage : (value : number) => void, pendingCount : number
}) {
  return (
    <>
    {/* 🔢 Pagination */}
<Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  mt={2}
>
  <Typography variant="body2" color="text.secondary">
    Tổng {meta.elementTotals} phần tử
  </Typography>

  <Pagination
    page={page}
    count={meta.pageTotals}
    color="primary"
    shape="rounded"
    onChange={(_, value) => setPage(value)}
    siblingCount={1}     // số page cạnh page hiện tại
  boundaryCount={1}    // số page ở đầu & cuối
  showFirstButton
  showLastButton
    disabled={pendingCount > 0}
  />
</Box>
</>
  )
}
