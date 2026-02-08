import { query } from "@/main";
import { deleteLecture, deleteSection } from "@/query/course/course.query";
import { useSave } from "@/query/use.crud.query";
import type { ICourseDetailResponse, ISectionResponse } from "@/type/course.module";
import { showToast } from "@/utils/toast";

export const useActionContent = (course:ICourseDetailResponse|null,
    setSections:React.Dispatch<React.SetStateAction<ISectionResponse[]>>) =>{
    // state client delete
    const {mutateAsync:mutateDeleteSection,isPending:isDeleteSectionPending} = useSave<boolean,
  {id:string,courseId:string}
  >('courses/delete-section',deleteSection);
  const {mutateAsync:mutateDeleteLecture,isPending:isDeleteLecturePending} = useSave<ISectionResponse,
  {id:string,courseId:string}
  >('courses/delete-lecture',deleteLecture)
  // handle delete
  const handleDeleteSection = async (sectionId : string) =>{
    await mutateDeleteSection({
      id: sectionId, courseId: course?.id||""
    })
    setSections(prev => prev.filter(s => s.id !== sectionId));
    query.removeQueries({queryKey:["courses/search"],exact:false})
  }
  const handleDeleteLecture = async (lectureId: string) => {
    try {
      const res = await mutateDeleteLecture({
        id: lectureId,
        courseId: course?.id || "",
      });

      setSections(prev =>
        prev.map(s => (s.id === res.id ? res : s))
      );
      query.removeQueries({queryKey:["courses/search"],exact:false})
    } catch (err) {
      showToast(`${err}`,"error");
    }
  };

  return {isDeleteSectionPending,handleDeleteSection,isDeleteLecturePending,handleDeleteLecture}
}