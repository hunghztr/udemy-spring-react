import { Box, Typography } from "@mui/material";

function CourseCard() {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: 1,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,.08)",
        cursor: "pointer",
        transition: ".25s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 6px 20px rgba(0,0,0,.15)"
        }
      }}
    >
      <Box sx={{ height: 140, bgcolor: "grey.300" }} />

      <Box sx={{ p: 1 }}>
        <Typography fontSize={14} fontWeight={600} lineHeight={1.3}>
          React + Spring Boot Full Course
        </Typography>

        <Typography fontSize={12} color="text.secondary">
          Trần Hùng
        </Typography>

        <Typography fontSize={12}>
          ⭐ 4.8 <span style={{ color: "#777" }}>(1,230)</span>
        </Typography>

        <Typography fontWeight={700}>₫299,000</Typography>
      </Box>
    </Box>
  );
}
export default CourseCard;