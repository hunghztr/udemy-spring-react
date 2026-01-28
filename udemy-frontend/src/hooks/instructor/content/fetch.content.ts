import type { ICourseDetailResponse, ISectionResponse } from "@/type/course.module";
import { useEffect, useState } from "react";

export const useFetchContent = (course:ICourseDetailResponse|null) =>{
    // lưu trạng thái collapse theo sectionId
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const handleToggleColapse = (sectionId : string) =>{
        setCollapsed(prev => ({...prev,[sectionId]: !prev[sectionId]}))
    }
          
    const [sections, setSections] = useState<ISectionResponse[]>([]);
        useEffect(() => {
            if (course) {
              setSections(course.sections);
              const init : Record<string,boolean> = {};
              course.sections.forEach((s) => {
                if(s.id) init[s.id] = false;
              })
              setCollapsed(init);
            }
          }, [course]);
    
    return {collapsed,setCollapsed,handleToggleColapse,sections,setSections}
          
}