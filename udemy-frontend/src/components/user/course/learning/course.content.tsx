import type { ILectureResponse, ISectionResponse } from "@/type/course.module";
import { Paper, Typography } from "@mui/material";
import SectionItem from "./section.item";


interface Props {
  courseId : string;
  sections: ISectionResponse[];
  currentLecture?: ILectureResponse;
  setCurrentLecture: (lecture: ILectureResponse) => void;
}

export default function CourseContent({
  courseId,
  sections,
  currentLecture,
  setCurrentLecture
}: Props) {

  return (
    <Paper
      sx={{
        width: 380,
        height: "80vh",
        overflowY: "auto",
        borderLeft: "1px solid #e5e7eb"
      }}
    >

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 18,
          p: 2,
          borderBottom: "1px solid #e5e7eb"
        }}
      >
        Course content
      </Typography>

      {sections.map((section) => (
        <SectionItem
          key={section.id}
          courseId={courseId}
          section={section}
          currentLecture={currentLecture}
          setCurrentLecture={setCurrentLecture}
        />
      ))}

    </Paper>
  );
}