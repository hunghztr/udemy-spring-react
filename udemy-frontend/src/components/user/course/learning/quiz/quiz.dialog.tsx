import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@mui/material";
import type { IQuizz } from "@/type/learning.module";
import QuizPlayer from "./quiz.player";

interface Props {
  open: boolean;
  onClose: () => void;
  quiz: IQuizz[];
}

export default function QuizDialog({
  open,
  onClose,
  quiz
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >

      <DialogTitle>
        Trắc nghiệm chương
      </DialogTitle>

      <DialogContent>

        {quiz.length > 0 && (
          <QuizPlayer quiz={quiz}/>
        )}

      </DialogContent>

    </Dialog>
  );
}