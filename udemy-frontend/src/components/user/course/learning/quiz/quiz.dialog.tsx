import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QuizIcon from "@mui/icons-material/Quiz";
import type { IQuizz } from "@/type/learning.module";
import QuizPlayer from "./quiz.player";

interface Props {
  open: boolean;
  onClose: () => void;
  quiz: IQuizz[];
  sectionName: string;
}

export default function QuizDialog({ sectionName, open, onClose, quiz }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pb: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider"
      }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <QuizIcon color="primary" fontSize="small" />
          <Typography fontWeight={600} fontSize={16}>
            Trắc nghiệm — {sectionName}
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5 }}>
        {quiz.length > 0 && <QuizPlayer quiz={quiz} />}
      </DialogContent>
    </Dialog>
  );
}