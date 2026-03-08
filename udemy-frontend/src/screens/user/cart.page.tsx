import CartItem from "@/components/user/cart/cart.item";
import CartSummary from "@/components/user/cart/cart.summary";
import { useCartHook } from "@/hooks/user/cart.hook";
import { Box, Typography, Grid } from "@mui/material";
import { AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { data, handleDelete,handleApplyCoupon } = useCartHook();

  const courses = data?.courses ?? [];
  const total = data?.total ?? 0;

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: 3,
        py: 5
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={3}>
        Giỏ hàng mua sắm
      </Typography>

      <Grid container spacing={4}>

        {/* LEFT */}
        <Grid sx={{ xs: 12, md: 8.5 }}>
          <AnimatePresence mode="popLayout">
            {courses.map((course) => (
              <CartItem
                key={course.id}
                course={course}
                handleDelete={handleDelete}
                handleApply={handleApplyCoupon}
              />
            ))}
          </AnimatePresence>
        </Grid>

        {/* RIGHT */}
        <Grid sx={{ xs: 12, md: 3.5, ml: "auto" }}>
          <CartSummary courses={courses} price={data?.price || 0} total={total} />
        </Grid>

      </Grid>
    </Box>
  );
}