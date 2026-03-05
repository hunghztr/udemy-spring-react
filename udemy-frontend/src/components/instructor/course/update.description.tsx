import { useUpdateDescCourse } from "@/hooks/instructor/update.desc.course";
import type { ICourseDetailResponse } from "@/type/course.module";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useMemo } from "react";

interface IProps {
  course: ICourseDetailResponse | null;
  setDone?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpdateDescription({ course }: IProps) {
  const {
    objectives,
    initialObjectives,
    requirements,
    initialRequirements,
    isPending,
    handleSaveDescription,
    handleObjectiveChange,
    handleReqChange,
    addObjective,
    addRequirement,
    removeObjective,
    removeRequirement,
  } = useUpdateDescCourse(course);
  const isSameArray = (a: string[], b: string[]) =>
    JSON.stringify(a) === JSON.stringify(b);

  const isChanged = useMemo(() => {
    return (
      !isSameArray(objectives, initialObjectives) ||
      !isSameArray(requirements, initialRequirements)
    );
  }, [objectives, requirements, initialObjectives, initialRequirements]);

  return (
    <Box>
      {/* ===== HEADER ===== */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Mô tả
          </Typography>
          <Typography color="text.secondary" fontSize={14}>
            Nội dung này sẽ hiển thị trên trang khóa học của bạn.
          </Typography>
        </Box>

        <Button
          onClick={handleSaveDescription}
          variant="contained"
          disabled={isPending || !isChanged}
          sx={{ borderRadius: 2, px: 3, textTransform: "none", fontWeight: 600 }}
        >
          {isPending ? "..." : "Lưu"}
        </Button>
      </Stack>

      {/* ===== OBJECTIVES ===== */}
      <Typography fontWeight={700} mb={1}>
        Khóa học này cung cấp kiến thức gì?
      </Typography>

      <Typography fontSize={14} color="text.secondary" mb={2}>
        Cần ít nhất 2 mục tiêu học tập.
      </Typography>

      <Stack spacing={2}>
        {objectives.map((v, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="center">
            <TextField
              value={v}
              placeholder={`Mục tiêu ${i + 1}`}
              onChange={(e) => handleObjectiveChange(i, e.target.value)}
              fullWidth
              inputProps={{ maxLength: 160 }}
              helperText={`${v.length}/160`}
            />

            <IconButton
              onClick={() => removeObjective(i)}
              disabled={objectives.length <= 1}
              sx={{ mt: "4px" }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <Button sx={{ mt: 2 }} onClick={addObjective}>
        + Thêm mục tiêu
      </Button>

      {/* ===== REQUIREMENTS ===== */}
      <Box mt={5}>
        <Typography fontWeight={700} mb={1}>
          Yêu cầu để học khóa này
        </Typography>

        <Typography fontSize={14} color="text.secondary" mb={2}>
          Ví dụ: Đã từng học Java cơ bản, có máy tính cài JDK...
        </Typography>

        <Stack spacing={2}>
          {requirements.map((v, i) => (
            <Stack key={i} direction="row" spacing={1} alignItems="center">
              <TextField
                value={v}
                placeholder={`Yêu cầu ${i + 1}`}
                onChange={(e) => handleReqChange(i, e.target.value)}
                fullWidth
              />

              <IconButton
                onClick={() => removeRequirement(i)}
                disabled={requirements.length <= 1}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Stack>
          ))}
        </Stack>

        <Button sx={{ mt: 2 }} onClick={addRequirement}>
          + Thêm yêu cầu
        </Button>
      </Box>
    </Box>
  );
}
