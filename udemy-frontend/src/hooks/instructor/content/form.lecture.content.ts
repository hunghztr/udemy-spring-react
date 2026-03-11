import { createLecture, updateLectureName } from "@/query/course/course.query";
import { query } from "@/query/queryClient";
import { useSave } from "@/query/use.crud.query";
import type {
  ICourseDetailResponse,
  ILecture,
  ISectionResponse,
} from "@/type/course.module";
import { showToast } from "@/utils/toast";
import { useState } from "react";

export const useFormLecture = (course: ICourseDetailResponse | null) => {
  const {
    mutateAsync: mutateCreateLecture,
    isPending: isCreateLecturePending,
  } = useSave<ISectionResponse, { data: ILecture; courseId: string }>(
    "courses/create-lecture",
    createLecture
  );

  const { mutateAsync: mutateUpdateLectureName } = useSave<
    ISectionResponse,
    { id: string; data: ILecture; courseId: string }
  >("courses/update-lecture-name", updateLectureName);

  // UI state
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
  const [editingLectureTitle, setEditingLectureTitle] = useState("");
  const [addingLectureSectionId, setAddingLectureSectionId] =
    useState<string | null>(null);
  const [newLectureTitle, setNewLectureTitle] = useState("");

  // handle add lecture
  const handleAddLecture = () => {
    if (!course || !newLectureTitle.trim()) return;

    const newLecture: ILecture = {
      name: newLectureTitle,
      section: { id: addingLectureSectionId || "" },
    };

    mutateCreateLecture(
      {
        data: newLecture,
        courseId: course.id,
      },
      {
        onSuccess: (updatedSection) => {
          // ✅ update course detail cache
          query.setQueryData<ICourseDetailResponse>(
            ["courses/get-by-id", course.id],
            (old) => {
              if (!old) return old;
              return {
                ...old,
                sections: old.sections.map((s) =>
                  s.id === updatedSection.id ? updatedSection : s
                ),
              };
            }
          );

          setNewLectureTitle("");
          setAddingLectureSectionId(null);
        },
        onError: (err) => {
          showToast(
            `Có vấn đề xảy ra: ${err.response?.data.message}`,
            "error"
          );
        },
      }
    );
  };

  // handle update lecture title
  const updateLectureTitle = (
    lectureId: string,
    newName: string
  ) => {
    if (!course) return;

    mutateUpdateLectureName(
      {
        id: lectureId,
        data: { name: newName },
        courseId: course.id,
      },
      {
        onSuccess: (updatedSection) => {
          // ✅ update course detail cache
          query.setQueryData<ICourseDetailResponse>(
            ["courses/get-by-id", course.id],
            (old) => {
              if (!old) return old;
              return {
                ...old,
                sections: old.sections.map((s) =>
                  s.id === updatedSection.id ? updatedSection : s
                ),
              };
            }
          );
        },
        onError: (err) => {
          showToast(
            `Có vấn đề xảy ra: ${err.response?.data.message}`,
            "error"
          );
        },
      }
    );
  };

  return {
    editingLectureId,
    editingLectureTitle,
    setEditingLectureTitle,
    updateLectureTitle,
    setEditingLectureId,
    setAddingLectureSectionId,
    setNewLectureTitle,
    addingLectureSectionId,
    newLectureTitle,
    isCreateLecturePending,
    handleAddLecture,
  };
};
