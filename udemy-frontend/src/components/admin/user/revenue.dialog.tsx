// components/admin/user/instructor.revenue.dialog.tsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, Typography,
  Stack, Box, Chip, Alert, CircularProgress
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useTheme } from "@mui/material/styles";

import { getInstructorRevenueById } from "@/query/user/user.query";

interface Props {
  open: boolean;
  onClose: () => void;
  instructorId: string;
}

export default function InstructorRevenueDialog({ open, onClose, instructorId }: Props) {
  const theme = useTheme();

  const { data, isLoading } = getInstructorRevenueById(instructorId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <AccountBalanceWalletOutlinedIcon color="primary" />
          <Typography fontWeight={700}>
            Doanh thu giảng viên
            {data?.instructorName && ` — ${data.instructorName}`}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {/* Loading */}
        {isLoading && (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
          </Stack>
        )}

        {/* Tổng doanh thu */}
        {!isLoading && data && (
          <>
            <Box
              sx={{
                mb: 3, p: 2,
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main + "15",
                border: `1px solid ${theme.palette.primary.main}40`,
              }}
            >
              <Typography fontSize={13} color="text.secondary">Tổng doanh thu</Typography>
              <Typography fontSize={28} fontWeight={800} color="primary">
                ${data.totalRevenue.toLocaleString()}
              </Typography>
            </Box>

            {/* Bảng chi tiết */}
            {data.courseDetails.length === 0 ? (
              <Alert severity="info">Giảng viên chưa có doanh thu</Alert>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "grey.100" }}>
                      <TableCell sx={{ fontWeight: 700 }}>Khóa học</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Đã bán</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Doanh thu</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.courseDetails.map((course) => (
                      <TableRow key={course.courseId} hover>
                        <TableCell>{course.courseName}</TableCell>
                        <TableCell align="center">
                          <Chip label={course.sold} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={600} color="primary">
                            ${course.revenue.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}