import { fadeUp } from "@/helpers/variants";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

export default function BecomeInstructor() {
  return (
    <Box
      component={motion.section}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      sx={{
        px: 4,
        py: 8,
        textAlign: "center",
        background: "linear-gradient(135deg,#6a11cb,#2575fc)",
        color: "#fff"
      }}
    >
      <Typography variant="h4" fontWeight={700}>
        Trở thành giảng viên
      </Typography>
      <Typography mt={2}>
        Chia sẻ kiến thức – tạo thu nhập bền vững
      </Typography>
      <Button variant="contained" sx={{ mt: 3 }}>
        Bắt đầu giảng dạy
      </Button>
    </Box>
  );
}
