import { useRef, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { verifyOtp } from "@/redux/thunks/auth.thunk";

interface Props {
  setMode: (value: "mail" | "otp" | "change") => void;
}

const OTP_LENGTH = 6;

export default function OtpForm({ setMode }: Props) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const error = useAppSelector(state => state.error.errors['auths/verify-otp']);
  const dispatch = useAppDispatch();
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    const email = localStorage.getItem("username");
    if (code.length !== OTP_LENGTH) return;
    if(email) {
      try{
        await dispatch(verifyOtp({value:code,email})).unwrap();
        setMode("change");
      }catch(err){
        console.log(err)
      }
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={6} textAlign="center">
      <Typography variant="h5" fontWeight={600} mb={1}>
        Nhập mã OTP
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Mã xác thực gồm 6 chữ số đã được gửi về email
      </Typography>

      <Box display="flex" justifyContent="center" gap={1.5} mb={3}>
        {otp.map((digit, index) => (
          <TextField
            key={index}
            value={digit}
            inputRef={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e.target.value, index)}
            inputProps={{
              maxLength: 1,
              inputMode: "numeric",
              onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(e, index),
              style: {
                textAlign: "center",
                fontSize: "1.5rem",
                padding: "10px",
              },
            }}
            sx={{ width: 48 }}
          />
        ))}
      </Box>
        {(error) && (
                <Typography color="error" textAlign="center">
                  {error ? `${error}` : ""}
                </Typography>
              )}
      <Button
        variant="contained"
        fullWidth
        sx={{ py: 1.2, fontWeight: 600 }}
        onClick={handleSubmit}
      >
        Xác nhận OTP
      </Button>

      <Button
        variant="text"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => setMode("mail")}
      >
        Quay lại
      </Button>
    </Box>
  );
}
