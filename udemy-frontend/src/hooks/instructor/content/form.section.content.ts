import { createSection, updateSectionName } from "@/query/course/course.query";
import { query } from "@/query/queryClient";
import { useSave } from "@/query/use.crud.query";
import type {
  ICourseDetailResponse,
  ISection,
  ISectionResponse,
} from "@/type/course.module";
import { showToast } from "@/utils/toast";
import { useState } from "react";

export const useFormSection = (course: ICourseDetailResponse | null) => {
  // create section
  const {
    mutateAsync: mutateCreateSection,
    isPending: isCreateSectionPending,
  } = useSave<ISectionResponse, { data: ISection; courseId: string }>(
    "courses/create-section",
    createSection
  );

  // update section name
  const { mutateAsync: mutateUpdateSectionName } = useSave<
    ISectionResponse,
    { id: string; data: ISection; courseId: string }
  >("courses/update-name-section", updateSectionName);

  // UI state
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isAddingSection, setIsAddingSection] = useState(false);

  // handle add section
  const handleAddSection = () => {
    if (!course || !newSectionTitle.trim()) return;

    const newSection: ISection = {
      name: newSectionTitle,
    };

    mutateCreateSection(
      {
        data: newSection,
        courseId: course.id,
      },
      {
        onSuccess: (createdSection) => {
          // ✅ update course detail cache
          query.setQueryData<ICourseDetailResponse>(
            ["courses/get-by-id", course.id],
            (old) => {
              if (!old) return old;
              return {
                ...old,
                sections: [...old.sections, createdSection],
              };
            }
          );

          setNewSectionTitle("");
          setIsAddingSection(false);
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

  // handle update section name
  const updateSectionTitle = (sectionId: string, newName: string) => {
    if (!course) return;

    mutateUpdateSectionName(
      {
        id: sectionId,
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
    setEditingSectionId,
    setEditingSectionTitle,
    editingSectionId,
    editingSectionTitle,
    updateSectionTitle,
    isAddingSection,
    newSectionTitle,
    setNewSectionTitle,
    handleAddSection,
    isCreateSectionPending,
    setIsAddingSection,
  };
};
