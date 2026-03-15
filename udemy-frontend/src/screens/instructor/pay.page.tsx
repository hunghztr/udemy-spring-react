import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { connectWallet, getPay } from "@/query/user/user.query";
import { showToast } from "@/utils/toast";
import { useSave } from "@/query/use.crud.query";
import type { INotification } from "@/type/notification.module";
import { createNotification } from "@/query/notification/notification.query";
import { useAppSelector } from "@/redux/hook";

const MotionCard = motion(Card);

export default function PayPage() {
  const theme = useTheme();
  const user = useAppSelector(state => state.currentUser);

  const [open, setOpen] = useState(false);
  const [bankName, setBankName] = useState("");
  const [account, setAccount] = useState("");

  const { data } = getPay();

  useEffect(() => {
    if (data) {
      setAccount(data.account);
      setBankName(data.bankName);
    }
  }, [data]);

  const { mutate } = connectWallet();

  const { mutate: sendNotify, isPending } =
    useSave<boolean, INotification>(
      "notifications/create",
      createNotification
    );

  const handleReport = () => {
    const notification: INotification = {
      title: "Yêu cầu rút tiền",
      message: `Giảng viên ${user.fullname} yêu cầu rút tiền khỏi ví`,
      url: `/admin/wallet/${user.id}`,
      user: {
        username: "admin@gmail.com"
      }
    };

    sendNotify(notification, {
      onSuccess: () => {
        showToast("Gửi yêu cầu rút tiền thành công", "success");
      },
      onError: (err: any) => {
        showToast(
          err?.response?.data?.message || "Có lỗi xảy ra",
          "error"
        );
      }
    });
  };

  const handleSubmit = () => {
    mutate(
      { bankName, account },
      {
        onSuccess: () => {
          showToast("Liên kết tài khoản thành công");
        }
      }
    );
    setOpen(false)
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography fontSize={28} fontWeight={700} mb={3}>
        Ví giảng viên
      </Typography>

      <Stack
        direction="row"
        spacing={3}
        alignItems="stretch"
        justifyContent="flex-start"
        sx={{ maxWidth: 900 }}
      >
        {/* WALLET */}
        <Card
          sx={{
            width: 420,
            borderRadius: 3,
            boxShadow: 3,
            height: 220
          }}
        >
          <CardContent sx={{ height: "100%" }}>
            <Stack height="100%" justifyContent="space-between">
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccountBalanceWalletOutlinedIcon
                    sx={{ color: theme.palette.primary.main }}
                  />
                  <Typography fontWeight={600}>
                    Tổng doanh thu
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

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => setOpen(!open)}
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none"
                  }}
                >
                  Tài khoản ngân hàng
                </Button>

                <Button
                  variant="contained"
                  onClick={handleReport}
                  disabled={isPending || (data?.amount ?? 0) <= 0}
                  sx={{
                    background: theme.palette.primary.main,
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      background: theme.palette.primary.dark
                    }
                  }}
                >
                  Rút tiền
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* BANK FORM */}
        <AnimatePresence>
          {open && (
            <MotionCard
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.25 }}
              sx={{
                width: 420,
                borderRadius: 3,
                boxShadow: 3,
                height: 220
              }}
            >
              <CardContent sx={{ height: "100%" }}>
                <Stack height="100%" justifyContent="space-between">
                  <Box>
                    <Typography fontWeight={700} mb={2}>
                      Thông tin tài khoản ngân hàng
                    </Typography>

                    <Stack spacing={2}>
                      <TextField
                        label="Tên ngân hàng"
                        fullWidth
                        size="small"
                        value={bankName}
                        onChange={(e) =>
                          setBankName(e.target.value)
                        }
                      />

                      <TextField
                        label="Số tài khoản"
                        fullWidth
                        size="small"
                        value={account}
                        onChange={(e) =>
                          setAccount(e.target.value)
                        }
                      />
                    </Stack>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                      background: theme.palette.primary.main,
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        background: theme.palette.primary.dark
                      }
                    }}
                  >
                    Xác nhận tài khoản
                  </Button>
                </Stack>
              </CardContent>
            </MotionCard>
          )}
        </AnimatePresence>
      </Stack>
    </Box>
  );
}