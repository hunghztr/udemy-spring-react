import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useTheme } from "@mui/material/styles";
import { getInstructorRevenue } from "@/query/user/user.query";

export default function PayPage() {
  const theme = useTheme();
  const { data, isLoading } = getInstructorRevenue();

  if (isLoading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  console.log("check data >>> ",data)
  return (
    <Box sx={{ p: 4 }}>
      <Typography fontSize={28} fontWeight={700} mb={3}>
        Ví giảng viên
      </Typography>

      {/* WALLET CARD */}
      <Card sx={{ width: 420, borderRadius: 3, boxShadow: 3, height: 200, mb: 4 }}>
        <CardContent sx={{ height: "100%" }}>
          <Stack height="100%" justifyContent="center">
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccountBalanceWalletOutlinedIcon
                  sx={{ color: theme.palette.primary.main }}
                />
                <Typography fontWeight={600}>Tổng doanh thu</Typography>
              </Stack>

              <Typography
                fontSize={36}
                fontWeight={800}
                mt={2}
                color={theme.palette.primary.main}
              >
                ${data?.totalRevenue?.toLocaleString() ?? 0}
              </Typography>

              <Typography fontSize={14} color="text.secondary" mt={1}>
                {data?.instructorName}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* COURSE REVENUE TABLE */}
      <Typography fontSize={20} fontWeight={700} mb={2}>
        Doanh thu theo khóa học
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Khóa học</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }} align="center">Đã bán</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }} align="right">Doanh thu</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.courseDetails?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  Chưa có dữ liệu doanh thu
                </TableCell>
              </TableRow>
            )}

            {data?.courseDetails?.map((course) => (
              <TableRow
                key={course.courseId}
                sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
              >
                <TableCell>{course.courseName}</TableCell>
                <TableCell align="center">{course.sold}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  ${course.revenue.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}