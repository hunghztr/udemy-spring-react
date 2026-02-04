import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
  LinearProgress,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useCreateCourse } from "@/hooks/instructor/create.course.hook";
import { AnimatePresence, motion } from "framer-motion";
import { stepVariants } from "@/helpers/variants";

export default function CreateCoursePage() {
  const navigate = useNavigate();

  const {
    step,
    progress,
    title,
    saveError,
    setTitle,
    setStep,
    search,
    setSearchOpen,
    searchOpen,
    setSearch,
    filteredCategories,
    selectedCategories,
    toggleCategory,
    isPending,
    handleFinish,
  } = useCreateCourse();

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
    } else {
      setStep(prev => prev - 1);
    }
  };
  const direction = step === 2 ? 1 : -1;

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", mt: 6 }}>
      <Paper sx={{ p: 4 }}>
        {/* ===== HEADER ===== */}
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>

          <Stack>
            <Typography variant="h5" fontWeight={700}>
              Tạo mới khoá học
            </Typography>
            <Typography color="text.secondary">
              Bước {step} trên 2
            </Typography>
          </Stack>
        </Stack>

        {/* ===== PROGRESS BAR ===== */}
        <Box mb={4}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 5,
              backgroundColor: "#eee",
              "& .MuiLinearProgress-bar": { borderRadius: 5 },
            }}
          />
          <Typography variant="caption" color="text.secondary" mt={0.5}>
            {progress}% hoàn thành
          </Typography>
        </Box>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {/* ================= STEP 1 ================= */}
                {step === 1 && (
                  <Stack spacing={3}>
                    <Typography fontWeight={600}>
                      Tên khoá học của bạn là gì?
                    </Typography>

                    <TextField
                      fullWidth
                      label="Course title"
                      placeholder="Eg: Spring Boot for Beginners"
                      value={title}
                      error={!!saveError}
                      helperText={saveError?.response?.data.message}
                      onChange={(e) => setTitle(e.target.value)}
                    />

                    <Stack direction="row" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        disabled={!title.trim()}
                        onClick={() => setStep(2)}
                      >
                        Tiếp
                      </Button>
                    </Stack>
                  </Stack>
                )}

                {/* ================= STEP 2 ================= */}
                {step === 2 && (
                  <Stack spacing={3}>
                    <Typography fontWeight={600}>
                      Chọn danh mục cho khoá học của bạn
                    </Typography>

                    {/* ===== SEARCH ===== */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      onMouseEnter={() => setSearchOpen(true)}
                      onMouseLeave={() => {
                        if (!search) setSearchOpen(false);
                      }}
                    >
                      <IconButton>
                        <SearchIcon />
                      </IconButton>

                      <motion.div
                        animate={{
                          width: searchOpen || !!search ? 260 : 0,
                          opacity: searchOpen || !!search ? 1 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                        style={{ overflow: "hidden" }}
                      >
                        <TextField
                          size="small"
                          placeholder="Tìm kiếm danh mục..."
                          value={search}
                          onFocus={() => setSearchOpen(true)}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </motion.div>
                    </Stack>

                    {/* ===== CATEGORY LIST ===== */}
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {filteredCategories.map((c) => {
                        const active = selectedCategories.includes(c.id);

                        return (
                          <Chip
                            key={c.id}
                            label={c.name}
                            clickable
                            color={active ? "primary" : "default"}
                            variant={active ? "filled" : "outlined"}
                            onClick={() => toggleCategory(c.id)}
                          />
                        );
                      })}
                    </Stack>

                    {selectedCategories.length > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Đã chọn: {selectedCategories.length} danh mục
                      </Typography>
                    )}

                    {/* ACTIONS */}
                    <Stack direction="row" justifyContent="space-between">
                      <Button variant="outlined" onClick={handleBack}>
                        Trở lại
                      </Button>

                      <Button
                        variant="contained"
                        disabled={selectedCategories.length === 0 || isPending}
                        onClick={async () =>{
                          await handleFinish();
                          window.location.reload();
                        }}
                      >
                        {isPending ? "Đang tạo..." : "Tạo khoá học"}
                      </Button>
                    </Stack>
                  </Stack>
                )}
              </motion.div>
            </AnimatePresence>
      </Paper>
    </Box>
  );
}
