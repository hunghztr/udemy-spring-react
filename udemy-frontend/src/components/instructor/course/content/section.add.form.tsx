import { useFormSection } from '@/hooks/instructor/content/form.section.content';
import type { ICourseDetailResponse, ISectionResponse } from '@/type/course.module';
import { Box, Button, Stack, TextField } from '@mui/material';
import React from 'react'
import AddIcon from "@mui/icons-material/Add";

export default function SectionAddForm({course,setSections} : {
    course:ICourseDetailResponse|null,setSections:React.Dispatch<React.SetStateAction<ISectionResponse[]>>
}) {
    const {isAddingSection,newSectionTitle,
        setNewSectionTitle,handleAddSection,isCreateSectionPending,setIsAddingSection,}
        = useFormSection(course,setSections)
  return (
    <Box mt={4}>
        {isAddingSection ? (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <TextField
              size="small"
              placeholder="Tên phần học..."
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              autoFocus
            />
            <Button variant="contained" onClick={handleAddSection} disabled={isCreateSectionPending}>
              Lưu
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setIsAddingSection(false);
                setNewSectionTitle("");
              }}
            >
              Huỷ
            </Button>
          </Stack>
        ) : (
          <Button
            startIcon={<AddIcon />}
            onClick={() => setIsAddingSection(true)}
          >
            Thêm phần học
          </Button>
        )}
      </Box>
  )
}
