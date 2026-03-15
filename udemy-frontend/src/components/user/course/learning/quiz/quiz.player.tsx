import {
  Typography,
  Button,
  Stack,
  LinearProgress,
  Box
} from "@mui/material";
import { useState } from "react";
import type { IQuizz } from "@/type/learning.module";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  quiz: IQuizz[];
}

export default function QuizPlayer({ quiz }: Props) {

  const [current,setCurrent] = useState(0);
  const [selected,setSelected] = useState<string | null>(null);
  const [showAnswer,setShowAnswer] = useState(false);
  const [score,setScore] = useState(0);
  const [finish,setFinish] = useState(false);

  const question = quiz[current];

  const choose = (opt:string) => {

    if(showAnswer) return;

    setSelected(opt);
    setShowAnswer(true);

    if(opt[0] === question.answer){
      setScore(s => s + 1);
    }

  };

  const next = () => {

    if(current === quiz.length - 1){
      setFinish(true);
      return;
    }

    setSelected(null);
    setShowAnswer(false);
    setCurrent(c => c + 1);

  };

  // RESULT SCREEN
  if(finish){
    return (

      <Stack spacing={3} alignItems="center">

        <Typography variant="h5" fontWeight={600}>
          Kết quả
        </Typography>

        <Typography>
          Bạn đúng {score} / {quiz.length} câu
        </Typography>

        <LinearProgress
          variant="determinate"
          value={(score / quiz.length) * 100}
          sx={{width:"100%", height:8, borderRadius:4}}
        />

      </Stack>

    );
  }

  return (

    <Stack
      spacing={3}
      sx={{
        minHeight:360   // giữ modal không bị nhảy height
      }}
    >

      {/* PROGRESS */}
      <LinearProgress
        variant="determinate"
        value={((current + 1) / quiz.length) * 100}
        sx={{ height:6, borderRadius:4 }}
      />

      <Typography fontSize={14}>
        Câu {current + 1} / {quiz.length}
      </Typography>

      {/* QUESTION + OPTIONS FADE */}
      <AnimatePresence mode="wait">

        <motion.div
          key={current}
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          exit={{ opacity:0 }}
          transition={{ duration:0.25 }}
        >

          {/* QUESTION */}
          <Typography fontWeight={600} fontSize={18} mb={2}>
            {question.question}
          </Typography>

          {/* OPTIONS */}
          <Stack spacing={1.5}>

            {question.options.map((opt, index) => {

              const isCorrect = opt[0] === question.answer;
              const isSelected = opt === selected;

              let color: "primary" | "success" | "error" = "primary";

              if(showAnswer){

                if(isCorrect){
                  color = "success";
                }

                if(isSelected && !isCorrect){
                  color = "error";
                }

              }

              return (

                <motion.div
                  key={opt}
                  initial={{ opacity:0, y:10 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{
                    duration:0.25,
                    delay: index * 0.07
                  }}
                >

                  <Button
                    variant="outlined"
                    color={color}
                    fullWidth
                    onClick={() => {
                      if (!showAnswer) choose(opt)
                    }}
                    sx={{
                      justifyContent:"flex-start",
                      textTransform:"none",
                      fontWeight:500,
                      borderWidth:2,

                      ...(showAnswer && isCorrect && {
                        borderColor:"success.main",
                        backgroundColor:"success.light",
                        color:"success.dark"
                      }),

                      ...(showAnswer && isSelected && !isCorrect && {
                        borderColor:"error.main",
                        backgroundColor:"error.light",
                        color:"error.dark"
                      })

                    }}
                  >

                    {opt}

                  </Button>

                </motion.div>

              );

            })}

          </Stack>

        </motion.div>

      </AnimatePresence>

      {/* NEXT BUTTON */}
      {showAnswer && (

        <Box textAlign="right">

          <motion.div
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
          >

            <Button
              variant="contained"
              onClick={next}
            >
              {current === quiz.length - 1
                ? "Xem kết quả"
                : "Câu tiếp"}
            </Button>

          </motion.div>

        </Box>

      )}

    </Stack>

  );

}