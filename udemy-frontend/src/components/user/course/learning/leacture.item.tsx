import {
  Box,
  Checkbox,
  ListItemButton,
  Stack,
  Typography
} from "@mui/material";

import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import type { ILectureResponse, ISectionResponse } from "@/type/course.module";
import { useSave } from "@/query/use.crud.query";
import { markFinish } from "@/query/course/course.query";
import { query } from "@/main";

interface Props {
  courseId:string;
  lecture: ILectureResponse;
  active: boolean;
  onClick: () => void;
}

export default function LectureItem({
  courseId,
  lecture,
  active,
  onClick
}: Props) {
  const {mutate} = useSave<ILectureResponse,{lectureId:string,finish:boolean}>('lectures/mark-finish',markFinish);
  const handleMark = (finish:boolean) =>{
    mutate(
      { lectureId: lecture?.id || "", finish },
      {
        onSuccess:(data : ILectureResponse)=>{
          query.setQueryData(
            ["learnings/learn",courseId],
            (old:any)=>{
              if(!old) return old;

              return {
                ...old,
                sections: old.sections.map((section:ISectionResponse)=>({
                  ...section,
                  lectures: section.lectures.map((l:ILectureResponse)=>
                    l.id === data.id
                      ? { ...l, isFinished: finish }
                      : l
                  )
                }))
              }
            }
          )
          query.invalidateQueries({
            predicate: (q) =>
              q.queryKey[0]?.toString().startsWith("learnings/get-all") ?? false
          });
        }
      }
    )
  }
  return (
    <ListItemButton
      onClick={onClick}
      sx={(theme)=>({
        py: 1.5,
        px: 2,

        bgcolor: active
          ? "rgba(106,13,173,0.08)"   // highlight udemy purple
          : "transparent",

        borderLeft: active
          ? `4px solid ${theme.palette.primary.main}`
          : "4px solid transparent",

        "&:hover": {
          bgcolor: "rgba(106,13,173,0.12)"
        }
      })}
    >

      <Stack direction="row" spacing={1.5} alignItems="center" width="100%">

        <Checkbox
          size="small"
          checked={lecture.isFinished ?? false}
          onChange={(e) => {
            e.stopPropagation();
            handleMark(e.target.checked)}
          }
          sx={{
            color: "primary.main",
            "&.Mui-checked": {
              color: "primary.main"
            }
          }}
        />

        <PlayCircleOutlineIcon
          fontSize="small"
          sx={{ color: "primary.main" }}
        />

        <Box flex={1}>
          <Typography fontSize={14}>
            {lecture.name}
          </Typography>
        </Box>

        <Typography fontSize={12} color="text.secondary">
          {Math.floor(lecture.second / 60)}min
        </Typography>

      </Stack>

    </ListItemButton>
  );
}