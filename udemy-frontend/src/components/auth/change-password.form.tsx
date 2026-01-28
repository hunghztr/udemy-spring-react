import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { changePassword } from "@/redux/thunks/auth.thunk";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

export default function ChangePasswordForm() {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string>("");
    const navigate = useNavigate();
  const serverError = useAppSelector(
    (state) => state.error.errors['/auths/changePass']
  );

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setError("");

    try {
      await dispatch(changePassword({value : password })).unwrap();
      toast.success("Đổi mật khẩu thành công");
      navigate("/auth")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        elevation={3}
        sx={{
          width: 380,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          gutterBottom
        >
          Đổi mật khẩu
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={3}
        >
          Nhập mật khẩu mới của bạn
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Mật khẩu mới"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            fullWidth
            label="Xác nhận mật khẩu"
            type="password"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {(error || serverError) && (
            <Typography color="error" textAlign="center" mt={1}>
              {error || serverError}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.2,
              fontWeight: 600,
            }}
          >
            Đổi mật khẩu
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
