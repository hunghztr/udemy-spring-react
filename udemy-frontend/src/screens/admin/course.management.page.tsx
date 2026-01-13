import { Box, Typography, Paper } from "@mui/material";

export default function CourseManagementPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Quản lý khoá học
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Typography>
          Danh sách course sẽ hiển thị ở đây
        </Typography>
      </Paper>
    </Box>
  );
}
