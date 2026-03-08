import {
  Box,
  Typography,
  IconButton,
  Chip,
  Backdrop,
  Stack,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import type { IFilterRequest } from "@/type/course.module";

const MotionBox = motion(Box);

interface Props {
  filters: IFilterRequest | undefined;
  setFilters: React.Dispatch<React.SetStateAction<IFilterRequest | undefined>>;
}

export default function FilterDrawer({ filters, setFilters }: Props) {
  const [open, setOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  /** ===== DEFAULT VALUES ===== */
  const defaultValues = useMemo<IFilterRequest>(
    () => ({
      star: undefined,
      isFree: undefined,
      durationFrom: undefined,
      durationTo: undefined,
      sortBy: undefined,
    }), []);
  const { control, handleSubmit, reset } = useForm<IFilterRequest>({
    defaultValues,
  });
  /** ===== SYNC FILTERS ===== */
  useEffect(() => {
    if (filters) {
      reset(filters);
    } else {
      reset(defaultValues);
    }
  }, [filters, reset, defaultValues]);
  /** ===== OPEN DRAWER ===== */
  const handleOpen = () => {
    setShowOverlay(true);
    setOpen(true);
  };
  /** ===== CLOSE DRAWER ===== */
  const handleClose = () => {
    setShowOverlay(false);
    setTimeout(() => setOpen(false), 150);
  };
  /** ===== APPLY FILTER ===== */
  const onSubmit = (data: IFilterRequest) => {
    let durationTo = data.durationTo;
    if (data.durationFrom === 0) durationTo = 2;
    if (data.durationFrom === 3) durationTo = 6;
    if (data.durationFrom === 6) durationTo = 999;
    setFilters({
      ...data,
      durationTo,
    });

    handleClose();
  };
  /** ===== RESET ===== */
  const handleReset = () => {
    reset({
      star: undefined,
      isFree: undefined,
      durationFrom: undefined,
      durationTo: undefined,
    });

    setFilters(undefined);
  };
  return (
    <>
      {/* ===== BUTTON ===== */}
      <Chip
        icon={<TuneIcon />}
        label="Bộ lọc"
        onClick={handleOpen}
        sx={{
          mb: 3,
          px: 1.5,
          py: 2.5,
          fontWeight: 600,
          borderRadius: 999,
          border: "1px solid",
          borderColor: "divider",
        }}
      />
      {/* ===== OVERLAY ===== */}
      <AnimatePresence>
        {showOverlay && (
          <Backdrop
            open
            onClick={handleClose}
            sx={{
              zIndex: 1200,
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0,0,0,0.25)",
            }}
          />
        )}
      </AnimatePresence>
      {/* ===== DRAWER ===== */}
      <AnimatePresence>
        {open && (
          <MotionBox
            initial={{ x: -420 }}
            animate={{ x: 0 }}
            exit={{ x: -420 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 360,
              height: "100vh",
              zIndex: 1300,
              backgroundColor: "background.paper",
              boxShadow: 10,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* ===== HEADER ===== */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography fontWeight={700}>Bộ lọc khóa học</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            {/* ===== BODY ===== */}
            <Box sx={{ p: 2, overflowY: "auto", flexGrow: 1 }}>
              <Stack spacing={3}>
                {/* ⭐ RATING */}
                <Box>
                  <Typography fontWeight={600} mb={1}>
                    Đánh giá
                  </Typography>
                  <Controller
                    name="star"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                      >
                        <FormControlLabel
                          value={4.5}
                          control={<Radio />}
                          label="4.5 sao trở lên"
                        />
                        <FormControlLabel
                          value={4}
                          control={<Radio />}
                          label="4.0 sao trở lên"
                        />
                        <FormControlLabel
                          value={3.5}
                          control={<Radio />}
                          label="3.5 sao trở lên"
                        />
                      </RadioGroup>
                    )}
                  />
                </Box>
                <Divider />
                {/* 💰 PRICE */}
                <Box>
                  <Typography fontWeight={600} mb={1}>
                    Giá
                  </Typography>
                  <Controller
                    name="isFree"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={
                          field.value === undefined
                            ? ""
                            : field.value
                            ? "free"
                            : "paid"
                        }
                        onChange={(e) =>
                          field.onChange(e.target.value === "free")
                        }
                      >
                        <FormControlLabel
                          value="free"
                          control={<Radio />}
                          label="Miễn phí"
                        />
                        <FormControlLabel
                          value="paid"
                          control={<Radio />}
                          label="Trả phí"
                        />
                      </RadioGroup>
                    )}
                  />
                </Box>
                <Divider />
                {/* ⏱ DURATION */}
                <Box>
                  <Typography fontWeight={600} mb={1}>
                    Thời lượng khóa học
                  </Typography>
                  <Controller
                    name="durationFrom"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={
                          field.value !== undefined
                            ? field.value === 0
                              ? "0-2"
                              : field.value === 3
                              ? "3-6"
                              : "6+"
                            : ""
                        }
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "0-2") field.onChange(0);
                          if (v === "3-6") field.onChange(3);
                          if (v === "6+") field.onChange(6);
                        }}
                      >
                        <FormControlLabel
                          value="0-2"
                          control={<Radio />}
                          label="0 – 2 giờ"
                        />
                        <FormControlLabel
                          value="3-6"
                          control={<Radio />}
                          label="3 – 6 giờ"
                        />
                        <FormControlLabel
                          value="6+"
                          control={<Radio />}
                          label="Trên 6 giờ"
                        />
                      </RadioGroup>
                    )}
                  />
                </Box>
              </Stack>
            </Box>
            {/* ===== FOOTER ===== */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleSubmit(onSubmit)}
                >
                  Áp dụng bộ lọc
                </Button>
                <Button variant="outlined" fullWidth onClick={handleReset}>
                  Xóa bộ lọc
                </Button>
              </Stack>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
}