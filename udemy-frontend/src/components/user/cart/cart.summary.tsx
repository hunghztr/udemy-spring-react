import api from "@/api/api";
import type { IApiResponse, IResult } from "@/type/api.response";
import type { ICartCourseResponse } from "@/type/cart.module";
import { showToast } from "@/utils/toast";
import { Typography, Button, Stack, Paper } from "@mui/material";

interface Props {
  total: number;
  price: number;
  courses: ICartCourseResponse[];
}

export default function CartSummary({courses, total, price }: Props) {
    const handlePay = async () => {

      const paymentCourses = courses.map(c => ({
        courseId: c.id,
        code: c.code ?? "",
      }));
      const coursesId = courses.map(c => c.id);
      localStorage.setItem(
        "payment_courses",
        JSON.stringify(paymentCourses)
      );
      const existCourse : IApiResponse<boolean> = await api.post("/client/carts/check-course-in-order",coursesId);
      if(!existCourse.data){
        const res: IApiResponse<IResult> =
        await api.post(`/payments/vnpay?price=${price}`);

        window.location.href = res.data.result;
      }else{
        showToast("Vui lòng không thanh toán khoá học đã sở hữu");
      }
      
    };
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid #eee",
        borderRadius: 2
      }}
    >
      <Stack spacing={2}>

        <Typography color="text.secondary">
          {total} Khoá học trong giỏ
        </Typography>

        <Typography fontSize={32} fontWeight={700}>
          ₫{price.toLocaleString()}
        </Typography>

        <Button
        onClick={handlePay}
        variant="contained"
        size="large"
        fullWidth
        color="primary"
        sx={{ fontWeight: 600 }}
        >
        Tiến hành thanh toán
        </Button>

      </Stack>
    </Paper>
  );
}