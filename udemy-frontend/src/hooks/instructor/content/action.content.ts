import { deleteLecture, deleteSection } from "@/query/course/course.query";
import { useSave } from "@/query/use.crud.query";
import type { ICourseDetailResponse, ISectionResponse } from "@/type/course.module";

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
  const handleDeleteSection = (sectionId : string) =>{
    mutateDeleteSection({
      id: sectionId, courseId: course?.id||""
    },{
      onSuccess:() =>{
        setSections(prev => prev.filter(s => s.id !== sectionId))
      },
      onError:(err) =>{
        alert(err);
      }
    })
  }
  const handleDeleteLecture = (lectureId : string) =>{
    mutateDeleteLecture({
      id:lectureId,courseId:course?.id||""
    },{
      onSuccess:(res) =>{
        setSections(prev => prev.map(s => s.id === res.id ? res:s))
      },
      onError:(err)=>{
        alert(err);
      }
    })
  }
  return {isDeleteSectionPending,handleDeleteSection,isDeleteLecturePending,handleDeleteLecture}
}