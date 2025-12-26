import { Box, Grid, Container, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: "#1c1d1f", color: "#fff", py: 6 }}>
      <Container maxWidth="lg">
        {/* TOP LINKS */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 6, md: 3 }}>
            <FooterColumn
              items={[
                "Udemy Business",
                "Dạy trên Udemy",
                "Ứng dụng di động",
                "Giới thiệu",
                "Liên hệ",
              ]}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <FooterColumn
              items={["Nghề nghiệp", "Blog", "Hỗ trợ", "Đối tác", "Nhà đầu tư"]}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <FooterColumn
              items={[
                "Điều khoản",
                "Chính sách bảo mật",
                "Cài đặt cookie",
                "Sơ đồ trang",
              ]}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <FooterColumn
              items={["Tải về trên App Store", "Tải về trên Google Play"]}
            />
          </Grid>
        </Grid>

        {/* BOTTOM INFO */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mt: 6,
            borderTop: "1px solid #3e4143",
            pt: 4,
          }}
        >
          {/* Logo */}
          <Typography variant="h5" fontWeight="bold">
            udemy
          </Typography>

          {/* Copyright */}
          <Typography variant="body2" sx={{ mt: { xs: 2, md: 0 } }}>
            © {new Date().getFullYear()} Udemy, Inc.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

function FooterColumn({ items }: { items: string[] }) {
  return (
    <Box>
      {items.map((item, index) => (
        <Link
          key={index}
          href="#"
          underline="none"
          color="inherit"
          sx={{
            display: "block",
            mb: 1,
            fontSize: "14px",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          {item}
        </Link>
      ))}
    </Box>
  );
}
