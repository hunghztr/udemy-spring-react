import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  Box
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { ILectureResponse, ISectionResponse } from "@/type/course.module";
import LectureItem from "./leacture.item";

interface Props {
  courseId:string;
  section: ISectionResponse;
  currentLecture?: ILectureResponse;
  setCurrentLecture: (lecture: ILectureResponse) => void;
}

export default function SectionItem({
  courseId,
  section,
  currentLecture,
  setCurrentLecture
}: Props) {

  const finishedLecture =
    section.lectures.filter(l => l.isFinished).length;

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider"
      }}
    >

      <AccordionSummary
        expandIcon={<ExpandMoreIcon
            sx={(theme)=>({
                color: theme.palette.hero.background
            })}
            />}
        sx={(theme)=>({
            backgroundColor: theme.palette.courseContent.sectionBg,

            "&:hover":{
                backgroundColor: theme.palette.courseContent.sectionHover
            }
            })}
      >

        <Box>

          <Typography
            fontWeight={600}
            sx={{ color: "text.primary" }}
            >
            {section.name}
          </Typography>

          <Typography
            fontSize={13}
            sx={{ color: "text.secondary" }}
          >
            {finishedLecture} / {section.totalLecture} | {section.hour}min
          </Typography>

        </Box>

      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>

        <List disablePadding>

          {section.lectures.map((lecture) => (
            <LectureItem
              key={lecture.id}
              courseId={courseId}
              lecture={lecture}
              active={lecture.id === currentLecture?.id}
              onClick={() => setCurrentLecture(lecture)}
            />
          ))}

        </List>

      </AccordionDetails>

    </Accordion>
  );
}