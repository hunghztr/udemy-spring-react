import { createLecture, updateLectureName } from "@/query/course/course.query";
import { useSave } from "@/query/use.crud.query";
import type { ICourseDetailResponse, ILecture, ISectionResponse } from "@/type/course.module";
import { showToast } from "@/utils/toast";
import { useState } from "react";

export const useFormLecture = (course:ICourseDetailResponse|null,
    setSections:React.Dispatch<React.SetStateAction<ISectionResponse[]>>) =>{
    const {mutateAsync:mutateCreateLecture,isPending:isCreateLecturePending} = useSave<ISectionResponse,
      {data:ILecture;courseId:string}
      >('courses/create-lecture',createLecture);
    const {mutateAsync:mutateUpdateLectureName} = useSave<ISectionResponse,
      {id:string,data:ILecture,courseId:string}
      >('courses/update-lecture-name',updateLectureName)

    // state lecture edit
    const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
    const [editingLectureTitle, setEditingLectureTitle] = useState("");
    // state lecture create
    const [addingLectureSectionId, setAddingLectureSectionId] = useState<string | null>(null);
    const [newLectureTitle,setNewLectureTitle] = useState("");
    // handle add lecture
    const handleAddLecture = () =>{
      if(!newLectureTitle.trim()) return ;

      const newLecture: ILecture = {
        name: newLectureTitle,
        section: {id:addingLectureSectionId||""}
      };
      mutateCreateLecture({
        data:newLecture,
        courseId:course?.id||""
      },{
        onSuccess:(res) =>{
          setSections(prev => prev.map(s => s.id === res.id ? res : s));
        },
        onError:(err) =>{
          showToast(`Có vấn đề xảy ra: ${err.response?.data.message}`,"error");
        }
      })
      setNewLectureTitle("");
      setAddingLectureSectionId(null);
    }
    const updateLectureTitle = (lectureId:string,newName:string,sectionId:string) =>{
        mutateUpdateLectureName({
        id:lectureId,data:{name:newName},courseId:course?.id||""
        },{
        onSuccess:(res) =>{
            setSections(prev => prev.map(s => s.id === sectionId? res:s))
        },
        onError:(err) =>{
            showToast(`Có vấn đề xảy ra: ${err.response?.data.message}`,"error");
        }
        })
    }
    return {editingLectureId,editingLectureTitle,setEditingLectureTitle,updateLectureTitle,
        setEditingLectureId,setAddingLectureSectionId,setNewLectureTitle,addingLectureSectionId,
        newLectureTitle,isCreateLecturePending,handleAddLecture,
    }
}