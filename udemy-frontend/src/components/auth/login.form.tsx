import {
  Box,
  Button,
  Divider,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useLoginHook } from "@/hooks/auth/login.hook";

export default function LoginForm({
  onSwitchMode,
}: {
  onSwitchMode: () => void;
}) {
  const {
    emailRef,
    passwordRef,
    error,
    handleLogin,
    handleGoogleLogin,
    handleForgotPassword,
    serverError,
  } = useLoginHook();

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        p: { xs: 2, sm: 4 },
        border: "1px solid #ccc",
        borderRadius: 3,
        width: "100%",
        maxWidth: 450,
        minHeight: 550,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" textAlign="center">
        Đăng nhập để tiếp tục hành trình học tập của bạn
      </Typography>

      <TextField label="Email" type="email" fullWidth inputRef={emailRef} />

      <TextField
        label="Password"
        type="password"
        fullWidth
        inputRef={passwordRef}
      />

      {(error || serverError) && (
        <Typography color="error" textAlign="center">
          {error ? `${error}` : serverError ? `${serverError}` : ""}
        </Typography>
      )}

      <Button type="submit" variant="contained" fullWidth size="large">
        Đăng nhập
      </Button>

      <Link
        component="button"
        variant="body2"
        onClick={handleForgotPassword}
        sx={{ alignSelf: "flex-end" }}
      >
        Quên mật khẩu?
      </Link>

      <Divider>HOẶC</Divider>

      <Button
        variant="outlined"
        size="large"
        startIcon={<GoogleIcon />}
        fullWidth
        onClick={handleGoogleLogin}
      >
        Đăng nhập với Google
      </Button>

      <Typography textAlign="center" variant="body2">
        Bạn chưa có tài khoản?{" "}
        <Link component="button" onClick={onSwitchMode} type="button">
          Đăng ký ngay
        </Link>
      </Typography>
    </Box>
  );
}
