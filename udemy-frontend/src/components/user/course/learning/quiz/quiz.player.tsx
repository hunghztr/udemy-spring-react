import {
  Typography,
  Stack,
  LinearProgress,
  Box,
  Button,
  Alert,
  Fade,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ReplayIcon from "@mui/icons-material/Replay";
import { useState } from "react";
import type { IQuizz } from "@/type/learning.module";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  quiz: IQuizz[];
}

export default function QuizPlayer({ quiz }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finish, setFinish] = useState(false);

  const question = quiz[current];

  const choose = (opt: string) => {
    if (showAnswer) return;
    setSelected(opt);
    setShowAnswer(true);
    if (opt[0] === question.answer) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    if (current === quiz.length - 1) {
      setFinish(true);
      return;
    }
    setSelected(null);
    setShowAnswer(false);
    setCurrent((c) => c + 1);
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setShowAnswer(false);
    setScore(0);
    setFinish(false);
  };

  // RESULT SCREEN
  if (finish) {
    const pct = Math.round((score / quiz.length) * 100);
    const tier = pct >= 80 ? "success" : pct >= 50 ? "warning" : "error";
    const msg =
      pct >= 80 ? "Xuất sắc! 🎉" : pct >= 50 ? "Khá tốt! Cố gắng hơn nhé." : "Cần ôn thêm nhé!";

    return (
      <Stack spacing={2.5} alignItems="center" py={2}>
        <Box sx={{
          width: 88, height: 88, borderRadius: "50%",
          backgroundColor: `${tier}.light`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center"
        }}>
          <EmojiEventsIcon sx={{ color: `${tier}.main`, fontSize: 28, mb: 0.3 }} />
          <Typography fontSize={13} fontWeight={600} color={`${tier}.dark`}>
            {score}/{quiz.length}
          </Typography>
        </Box>

        <Typography fontWeight={600} fontSize={18}>{msg}</Typography>

        <Typography color="text.secondary" fontSize={14}>
          Bạn trả lời đúng {score} / {quiz.length} câu ({pct}%)
        </Typography>

        <LinearProgress
          variant="determinate"
          value={pct}
          color={tier}
          sx={{ width: "100%", height: 8, borderRadius: 4 }}
        />

        <Button
          variant="outlined"
          startIcon={<ReplayIcon />}
          onClick={reset}
        >
          Làm lại
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5} sx={{ minHeight: 360 }}>
      {/* PROGRESS */}
      <Box>
        <LinearProgress
          variant="determinate"
          value={((current + 1) / quiz.length) * 100}
          sx={{ height: 6, borderRadius: 4 }}
        />
        <Stack direction="row" justifyContent="space-between" mt={0.8}>
          <Typography fontSize={12} color="text.secondary">
            Câu {current + 1} / {quiz.length}
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            {score} điểm
          </Typography>
        </Stack>
      </Box>

      {/* QUESTION + OPTIONS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <Typography fontWeight={600} fontSize={16} mb={2} lineHeight={1.5}>
            {question.question}
          </Typography>

          <Stack spacing={1.2}>
            {question.options.map((opt, index) => {
              const isCorrect = opt[0] === question.answer;
              const isSelected = opt === selected;

              let color: "primary" | "success" | "error" | "inherit" = "primary";
              if (showAnswer) {
                if (isCorrect) color = "success";
                else if (isSelected && !isCorrect) color = "error";
                else color = "inherit";
              }

              return (
                <motion.div
                  key={opt}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.06 }}
                >
                  <Button
                    variant="outlined"
                    color={color}
                    fullWidth
                    disabled={showAnswer && !isCorrect && !isSelected}
                    onClick={() => choose(opt)}
                    startIcon={
                      <Box sx={{
                        width: 24, height: 24, borderRadius: "50%",
                        backgroundColor:
                          showAnswer && isCorrect ? "success.main"
                          : showAnswer && isSelected && !isCorrect ? "error.main"
                          : "action.selected",
                        color: showAnswer && (isCorrect || isSelected) ? "#fff" : "text.secondary",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, flexShrink: 0,
                        transition: "all 0.2s"
                      }}>
                        {opt[0]}
                      </Box>
                    }
                    endIcon={
                      showAnswer && isCorrect ? <CheckCircleIcon fontSize="small" /> :
                      showAnswer && isSelected && !isCorrect ? <CancelIcon fontSize="small" /> :
                      null
                    }
                    sx={{
                      justifyContent: "flex-start",
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: 14,
                      py: 1.2,
                      borderWidth: 1.5,
                      ...(showAnswer && isCorrect && {
                        borderColor: "success.main",
                        backgroundColor: "success.50",
                        color: "success.dark",
                        "&.Mui-disabled": {
                          borderColor: "success.main",
                          backgroundColor: "success.50",
                          color: "success.dark",
                        }
                      }),
                      ...(showAnswer && isSelected && !isCorrect && {
                        borderColor: "error.main",
                        backgroundColor: "error.50",
                        color: "error.dark",
                      }),
                      ...(showAnswer && !isCorrect && !isSelected && {
                        opacity: 0.45,
                      })
                    }}
                  >
                    {opt.slice(3)}
                  </Button>
                </motion.div>
              );
            })}
          </Stack>
        </motion.div>
      </AnimatePresence>

      {/* FEEDBACK */}
      {showAnswer && (
        <Fade in>
          <Alert
            severity={selected?.[0] === question.answer ? "success" : "error"}
            sx={{ borderRadius: 2 }}
          >
            {selected?.[0] === question.answer
              ? "Chính xác! Tiếp tục phát huy."
              : `Chưa đúng. Đáp án đúng là: ${question.options.find((o) => o[0] === question.answer)}`}
          </Alert>
        </Fade>
      )}

      {/* NEXT */}
      {showAnswer && (
        <Box textAlign="right">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <Button variant="contained" onClick={next}>
              {current === quiz.length - 1 ? "Xem kết quả" : "Câu tiếp →"}
            </Button>
          </motion.div>
        </Box>
      )}
    </Stack>
  );
}