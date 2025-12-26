import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useRegisterHook } from "../../hooks/auth/register.hook";

export default function RegisterForm({
  onSwitchMode,
}: {
  onSwitchMode: () => void;
}) {
  const {
    usernameRef,
    fullNameRef,
    passRef,
    confirmRef,
    error,
    serverError,
    handleRegisterSubmit,
  } = useRegisterHook(onSwitchMode);

  return (
    <Box
      component="form"
      onSubmit={handleRegisterSubmit}
      sx={{
        minHeight: 550,
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        p: { xs: 2, sm: 4 },
        border: "1px solid #ccc",
        borderRadius: 3,
        width: "100%",
        maxWidth: 450,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" textAlign="center">
        Tạo tài khoản Udemy của bạn
      </Typography>

      <TextField label="Username" fullWidth inputRef={usernameRef} />
      <TextField label="Full Name" fullWidth inputRef={fullNameRef} />
      <TextField
        label="Password"
        type="password"
        fullWidth
        inputRef={passRef}
      />
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        inputRef={confirmRef}
      />

      {(error || serverError) && (
        <Typography color="error" textAlign="center">
          {error ? `${error}` : serverError ? `${serverError}` : ""}
        </Typography>
      )}

      <Button type="submit" variant="contained" fullWidth size="large">
        Đăng ký
      </Button>

      <Typography textAlign="center" variant="body2">
        Đã có tài khoản?{" "}
        <Link component="button" onClick={onSwitchMode} type="button">
          Đăng nhập
        </Link>
      </Typography>
    </Box>
  );
}
