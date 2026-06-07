import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { getPay } from "@/query/user/user.query";

export default function PayPage() {
  const theme = useTheme();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data } = getPay(startDate, endDate);

  return (
    <Box sx={{ p: 4 }}>
      <Typography fontSize={28} fontWeight={700} mb={3}>
        Ví giảng viên
      </Typography>

      {/* FILTER DATE */}

      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          type="date"
          label="Ngày bắt đầu"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <TextField
          type="date"
          label="Ngày kết thúc"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Stack>

      {/* WALLET */}

      <Card
        sx={{
          width: 420,
          borderRadius: 3,
          boxShadow: 3,
          height: 200
        }}
      >
        <CardContent sx={{ height: "100%" }}>
          <Stack height="100%" justifyContent="center">
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccountBalanceWalletOutlinedIcon
                  sx={{ color: theme.palette.primary.main }}
                />

                <Typography fontWeight={600}>
                  Doanh thu trong khoảng
                </Typography>
              </Stack>

              <Typography
                fontSize={36}
                fontWeight={800}
                mt={2}
                color={theme.palette.primary.main}
              >
                ${data?.amount ?? 0}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}