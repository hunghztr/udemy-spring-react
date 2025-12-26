import { useState } from "react";
import { Box, Grid, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "../components/auth/login.form";
import RegisterForm from "../components/auth/register.form";
import { useAppSelector } from "../redux/hook";
import Loading from "../components/layout/loading";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const isShortScreen = useMediaQuery("(max-height: 500px)");
  const isLoading = useAppSelector((state) => state.ui.isLoading);

  const formVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f7f7",
        p: 2,
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          px: 2,
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "1200px",
          position: "relative",
        }}
      >
        {/* LEFT - BACKGROUND IMAGE */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: {
              xs: "none",
              sm: isShortScreen ? "none" : "flex",
              md: isShortScreen ? "none" : "flex",
            },
            justifyContent: "center",
            alignItems: "center",
            order: { xs: 1, md: 0 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "& img": {
                width: "100%",
                maxWidth: { sm: 350, md: 600 },
                maxHeight: { sm: 260, md: 400 },
                objectFit: "contain",
              },
            }}
          >
            <img src="/src/assets/bg-login.png" alt="Background" />
          </Box>
        </Grid>

        {/* RIGHT - FORM */}
        <Grid
          size={{ xs: 12, md: isShortScreen ? 12 : 6 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            order: { xs: 2, md: 1 },
            position: "relative",
            height: 500,
          }}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              // <motion.div
              //   key="loading"
              //   initial={{ opacity: 0 }}
              //   animate={{ opacity: 1 }}
              //   exit={{ opacity: 0 }}
              //   style={{ position: "absolute", width: "100%" }}
              // >
              <Loading />
            ) : // </motion.div>
            mode === "login" ? (
              <motion.div
                key="login"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={formVariants}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  width: "100%",
                }}
              >
                <LoginForm onSwitchMode={() => setMode("register")} />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={formVariants}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  width: "100%",
                }}
              >
                <RegisterForm onSwitchMode={() => setMode("login")} />
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>
      </Grid>
    </Box>
  );
}
