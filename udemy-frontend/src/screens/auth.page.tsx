import { useState } from "react";
import { Box, Grid, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/redux/hook";
import Loading from "@/components/loading";
import LoginForm from "@/components/auth/login.form";
import RegisterForm from "@/components/auth/register.form";
import { authVariants } from "@/helpers/variants";
import bgLogin from "@/assets/bg-login.png";
export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const isShortScreen = useMediaQuery("(max-height: 500px)");
  const isLoading = useAppSelector((state) => state.loading.pendingCount);

  

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "background.default",
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
            <img src={bgLogin} alt="Background" />
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
            {isLoading > 0 ? (
              <Loading />
            ) : 
            mode === "login" ? (
              <motion.div
                key="login"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={authVariants}
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
                variants={authVariants}
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
