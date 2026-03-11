import { deleteLecture, deleteSection } from "@/query/course/course.query";
import { query } from "@/query/queryClient";
import { useSave } from "@/query/use.crud.query";
import type {
  ICourseDetailResponse,
  ISectionResponse,
} from "@/type/course.module";
import { showToast } from "@/utils/toast";

export const useActionContent = (course: ICourseDetailResponse | null) => {
  // delete section
  const {
    mutateAsync: mutateDeleteSection,
    isPending: isDeleteSectionPending,
  } = useSave<boolean, { id: string; courseId: string }>(
    "courses/delete-section",
    deleteSection
  );

  // delete lecture
  const {
    mutateAsync: mutateDeleteLecture,
    isPending: isDeleteLecturePending,
  } = useSave<ISectionResponse, { id: string; courseId: string }>(
    "courses/delete-lecture",
    deleteLecture
  );

  // handle delete section
  const handleDeleteSection = async (sectionId: string) => {
    if (!course) return;

    await mutateDeleteSection({
      id: sectionId,
      courseId: course.id,
    });

    // ✅ update course detail cache
    query.setQueryData<ICourseDetailResponse>(
      ["courses/get-by-id", course.id],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          sections: old.sections.filter((s) => s.id !== sectionId),
        };
      }
    );

    // ✅ invalidate derived data
    query.invalidateQueries({ queryKey: ["courses/search"] });
    query.invalidateQueries({ queryKey: ["courses/get-all-by-author"] });
  };

  // handle delete lecture
  const handleDeleteLecture = async (lectureId: string) => {
    if (!course) return;

    try {
      const updatedSection = await mutateDeleteLecture({
        id: lectureId,
        courseId: course.id,
      });

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

      // ✅ invalidate derived data
      query.invalidateQueries({ queryKey: ["courses/search"] });
      query.invalidateQueries({ queryKey: ["courses/get-all-by-author"] });
    } catch (err) {
      showToast(`${err}`, "error");
    }
  };

  return {
    isDeleteSectionPending,
    handleDeleteSection,
    isDeleteLecturePending,
    handleDeleteLecture,
  };
};
