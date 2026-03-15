import { ListItemButton, ListItemText } from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import { useState } from "react";
import { useSave } from "@/query/use.crud.query";
import { getQuizs } from "@/query/learning/learning.query";
import type { IQuizz } from "@/type/learning.module";
import QuizDialog from "./quiz.dialog";

interface Props {
  sectionId: string;
}

export default function QuizRow({ sectionId }: Props) {

  const [open,setOpen] = useState(false);
  const [quiz,setQuiz] = useState<IQuizz[]>([]);

  const { mutate } = useSave<IQuizz[],string>(
    "quizs/get-by-section",
    getQuizs
  );

  const handle = () => {

    mutate(sectionId,{
      onSuccess:(data)=>{
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
          pl: 4,
          backgroundColor: "rgba(0,0,0,0.02)",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.06)"
          }
        }}
      >
        <QuizIcon sx={{ mr: 1.2 }} />

        <ListItemText
          primary="Trắc nghiệm"
          secondary="Kiểm tra cuối chương"
          primaryTypographyProps={{
            fontWeight: 500,
            fontSize: 14
          }}
          secondaryTypographyProps={{
            fontSize: 12
          }}
        />
      </ListItemButton>

      <QuizDialog
        open={open}
        onClose={()=>setOpen(false)}
        quiz={quiz}
      />
    </>
  );
}