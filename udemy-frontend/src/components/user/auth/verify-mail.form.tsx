import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { verifyMail } from "../../../redux/thunks/auth.thunk";

export default function VerifyMail({setMode} : {setMode : (value : "mail"|"otp"|"change") => void}) {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string>("");
  const serverError = useAppSelector(state => state.error.errors['auths/verify-mail']);
  const dispatch = useAppDispatch();
  const handleSubmit = async (e : any) => {
    e.preventDefault();

    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setError("");
    try{
        await dispatch(verifyMail({email})).unwrap();
        setMode("otp");
    }catch(err){
        const errAxios = err as string;
        console.log(errAxios);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f7f9fa"
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
          Quên mật khẩu
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={3}
        >
          Nhập email để nhận link đặt lại mật khẩu
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {(error || serverError) && (
        <Typography color="error" textAlign="center">
          {error ? `${error}` : serverError ? `${serverError}` : ""}
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
            Gửi email đặt lại mật khẩu
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
