import { query } from "@/main";
import { updateCourseDesc } from "@/query/course/course.query";
import {  useSave } from "@/query/use.crud.query";
import type { ICourseDetailResponse } from "@/type/course.module";
import { showToast } from "@/utils/toast";
import { useEffect, useState } from "react";

export const useUpdateDescCourse = (course : ICourseDetailResponse|null) =>{
    
      const { isPending, mutateAsync } = useSave("courses/update", updateCourseDesc);

  /* ===== OBJECTIVES ===== */
  const [objectives, setObjectives] = useState<string[]>(["", ""]);
  const [initialObjectives, setInitialObjectives] = useState<string[]>([]);

  const handleObjectiveChange = (index: number, value: string) => {
    const copy = [...objectives];
    copy[index] = value;
    setObjectives(copy);
  };

  const addObjective = () => {
    setObjectives([...objectives, ""]);
  };

  /* ===== REQUIREMENTS ===== */
  const [requirements, setRequirements] = useState<string[]>(["", ""]);
  const [initialRequirements, setInitialRequirements] = useState<string[]>([]);

  const handleReqChange = (index: number, value: string) => {
    const copy = [...requirements];
    copy[index] = value;
    setRequirements(copy);
  };

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const removeObjective = (index: number) => {
  setObjectives((prev) => prev.filter((_, i) => i !== index));
};

const removeRequirement = (index: number) => {
  setRequirements((prev) => prev.filter((_, i) => i !== index));
};

  /* ===== FILL DATA FROM BE ===== */
  useEffect(() => {
    if (!course) return;

    try {
      if (course.description) {
        const descArr = JSON.parse(course.description);
        if (Array.isArray(descArr)) {
          setObjectives(descArr);
          setInitialObjectives(descArr);
        }
      }

      if (course.requirement) {
        const reqArr = JSON.parse(course.requirement);
        if (Array.isArray(reqArr)) {
          setRequirements(reqArr);
          setInitialRequirements(reqArr);
        }
      }
    } catch (err) {
      console.error("Parse description/requirement failed", err);
    }
  }, [course]);
    /* ===== SAVE ===== */
  const handleSaveDescription = async () => {
    const jsonDesc = JSON.stringify(objectives);
    const jsonRequire = JSON.stringify(requirements);
    await mutateAsync(
      {
        id:course?.id,
        description: jsonDesc,
        requirement: jsonRequire,
      },
      {
        onSuccess: () => {
          showToast("Đã lưu thông tin thành công");
          setInitialObjectives(objectives);
          setInitialRequirements(requirements);
          query.invalidateQueries({queryKey:["courses/get-by-id"]})
          query.removeQueries({queryKey:["courses/search"],exact:false})
        },
        onError: (err) => {
          showToast(`Có vấn đề xảy ra: ${err.response?.data.message}`,"error");
        },
      }
    );
  };
  return {objectives,initialObjectives,requirements,initialRequirements,course,handleSaveDescription,isPending,
    handleObjectiveChange,addObjective,addRequirement,handleReqChange,removeObjective,removeRequirement
  }
}