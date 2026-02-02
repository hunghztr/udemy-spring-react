import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Divider,

} from "@mui/material";



import type {
  ICourseDetailResponse,
} from "@/type/course.module";
import { useUpdatePricing } from "@/hooks/instructor/pricing/update.pricing.course";

import Coupon from "./coupon";

interface Props {
  course: ICourseDetailResponse | null;
  refetch?: () => Promise<any>;
}

export default function UpdatePricing({ course, refetch }: Props) {
  const {price,setPrice,isPriceUpdated,handlePriceSave
    } = useUpdatePricing({course,refetch});
  
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Giá bán & Coupons
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* ===== PRICE ===== */}
          <Box>
            <Typography fontWeight={600} mb={1}>
              Giá gốc (VND)
            </Typography>

            <Stack direction="row" spacing={2}>
              <TextField
                type="number"
                size="small"
                sx={{ width: 200 }}
                value={price}
                onChange={(e) => setPrice(+e.target.value)}
              />

              <Button
                variant="contained"
                disabled={isPriceUpdated}
                onClick={handlePriceSave}
              >
                Lưu
              </Button>
            </Stack>
          </Box>

          <Divider />

          {/* ===== COUPONS ===== */}
          <Coupon course={course} refetch={refetch} />
        </Stack>
      </Paper>
    </Box>
  );
}
