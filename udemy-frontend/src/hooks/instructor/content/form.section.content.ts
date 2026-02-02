import { createSection, updateSectionName } from "@/query/course/course.query";
import { useSave } from "@/query/use.crud.query";
import type { ICourseDetailResponse, ISection, ISectionResponse } from "@/type/course.module";
import { showToast } from "@/utils/toast";
import { useState } from "react";

export const useFormSection = (course:ICourseDetailResponse|null,
    setSections:React.Dispatch<React.SetStateAction<ISectionResponse[]>>) =>{
    // state client create
    const {mutateAsync:mutateCreateSection,isPending:isCreateSectionPending} = useSave<ISectionResponse,
    {data:ISection;courseId:string}
    >('courses/create-section',createSection);
    // state client update
    const {mutateAsync:mutateUpdateSectionName} = useSave<ISectionResponse,
    {id:string,data:ISection,courseId:string}
    >('courses/update-name-section',updateSectionName)
    // state section edit
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [editingSectionTitle, setEditingSectionTitle] = useState("");
    // state section create
    const [newSectionTitle, setNewSectionTitle] = useState("");
    const [isAddingSection, setIsAddingSection] = useState(false);

    // handle add section
    const handleAddSection = () => {
        if (!newSectionTitle.trim()) return;

        const newSection: ISection = {
        name: newSectionTitle,
        };
        mutateCreateSection({
        data:newSection,
        courseId:course?.id||""
        },{
        onSuccess:(res) =>{
            setSections(prev => [...prev,res])
        },
        onError:(err) =>{
            showToast(`Có vấn đề xảy ra: ${err.response?.data.message}`,"error");
        }
        })
        setNewSectionTitle("");
        setIsAddingSection(false);
    };
    // handle edit section
    const updateSectionTitle = (sectionId: string, newName: string) => {
        mutateUpdateSectionName({
        id:sectionId,courseId:course?.id||"",data:{name:newName}
        },{
        onSuccess:(res) =>{
            setSections((prev) =>
            prev.map((s) =>
            s.id === sectionId ? { ...s, name: res.name } : s
            )
          );
        },onError:(err) =>{
            showToast(`Có vấn đề xảy ra: ${err.response?.data.message}`,"error");
        }
        })
    };
    return {setEditingSectionId,setEditingSectionTitle,editingSectionId,
        editingSectionTitle,updateSectionTitle,isAddingSection,newSectionTitle,
        setNewSectionTitle,handleAddSection,isCreateSectionPending,setIsAddingSection,
    }
}