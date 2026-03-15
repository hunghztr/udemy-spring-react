import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { showToast } from "@/utils/toast";
import { useGetById } from "@/query/use.crud.query";
import type { IWalletResponse } from "@/type/user.module";
import { getWallet } from "@/query/user/user.query";


export default function AdminWalletUserPage() {

  const { id } = useParams();

  const { data } = useGetById<IWalletResponse>("wallets/get-by-id",getWallet,id||"");

  const [open, setOpen] = useState(false);

  const handleApprove = () => {
    setOpen(true);
  };
  const handleConfirm = async () => {
    setOpen(false);
    showToast("Đã phê duyệt thành công");
  };

  return (
    <Box sx={{ p: 4 }}>

      <Typography fontSize={28} fontWeight={700} mb={3}>
        Chi tiết ví người dùng
      </Typography>

      <Card sx={{ maxWidth: 500 }}>
        <CardContent>

          <Stack spacing={2}>

            <Typography>
              <b>User ID:</b> {data?.id}
            </Typography>

            <Typography>
              <b>Fullname:</b> {data?.fullname}
            </Typography>

            <Typography>
              <b>Username:</b> {data?.username}
            </Typography>

            <Typography>
              <b>Số tiền trong ví:</b> ${data?.amount}
            </Typography>

            <Typography>
              <b>Ngân hàng:</b> {data?.bankName}
            </Typography>

            <Typography>
              <b>Số tài khoản:</b> {data?.account}
            </Typography>
            <Typography>
                <b>Số tiền trong ví:</b> ${data?.amount}
            </Typography>
            <Button
              variant="contained"
              onClick={handleApprove}
              disabled={(data?.amount ?? 0) <= 0}
            >
              Duyệt rút tiền
            </Button>

          </Stack>

        </CardContent>
      </Card>

      {/* MODAL */}

      <Dialog open={open} onClose={() => setOpen(false)}>

        <DialogTitle>Xác nhận rút tiền</DialogTitle>

        <DialogContent>

          <Stack spacing={2} mt={1}>

            <TextField
              label="Tên ngân hàng"
              value={data?.bankName ?? ""}
              fullWidth
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Số tài khoản"
              value={data?.account ?? ""}
              fullWidth
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Số tiền rút"
              value={data?.amount ?? 0}
              fullWidth
              InputProps={{ readOnly: true }}
            />

          </Stack>

        </DialogContent>

        <DialogActions>

          <Button onClick={() => setOpen(false)}>
            Hủy
          </Button>

          <Button
            variant="contained"
            onClick={handleConfirm}
          >
            Xác nhận
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}