import { ListItemButton, ListItemText, Tooltip, Box } from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState } from "react";
import { useSave } from "@/query/use.crud.query";
import { getQuizs } from "@/query/learning/learning.query";
import type { IQuizz } from "@/type/learning.module";
import QuizDialog from "./quiz.dialog";

interface Props {
  sectionId: string;
  sectionName: string;
}

export default function QuizRow({ sectionId, sectionName }: Props) {
  const [open, setOpen] = useState(false);
  const [quiz, setQuiz] = useState<IQuizz[]>([]);

  const { mutate } = useSave<IQuizz[], string>("quizs/get-by-section", getQuizs);

  const handle = () => {
    mutate(sectionId, {
      onSuccess: (data) => {
        setQuiz(data);
        setOpen(true);
      }
    });
  };

  return (
    <>
      <ListItemButton
        onClick={handle}
        sx={{
          pl: 2,
          pr: 2,
          py: 1.2,
          mx: 1,
          borderRadius: 1.5,
          gap: 1.5,
          "&:hover": { backgroundColor: "action.hover" }
        }}
      >
        <Box sx={{
          width: 32, height: 32, borderRadius: 1,
          backgroundColor: "primary.50",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0
        }}>
          <QuizIcon sx={{ fontSize: 18, color: "primary.main" }} />
        </Box>

        <ListItemText
          primary="Trắc nghiệm cùng AI"
          secondary="Kiểm tra cuối chương"
          primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }}
          secondaryTypographyProps={{ fontSize: 12 }}
        />

        <Tooltip title="Câu hỏi do AI tạo theo nội dung chương học" arrow placement="left">
          <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.disabled" }} />
        </Tooltip>
      </ListItemButton>

      <QuizDialog
        sectionName={sectionName}
        open={open}
        onClose={() => setOpen(false)}
        quiz={quiz}
      />
    </>
  );
}