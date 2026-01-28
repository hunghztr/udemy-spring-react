import api from "@/api/api";
import type { IApiResponse } from "@/type/api.response";
import { type ICourse, type ICourseDetailResponse, type ICourseResponse, type ILecture, type ISection, type ISectionResponse } from "@/type/course.module";
import type { IPagination, IPaginationResponse } from "@/type/pagination";
import { activate, create, getById, update } from "../api.crud.query";


export const getCoursesByAuthor = async ({
        page,size,active,keyword,filter
} : IPagination) =>{
    const res : IApiResponse<IPaginationResponse<ICourseResponse>> =
     await api
     .get(`/instructor/courses/get-courses-by-author?filter=name~'${keyword}' and isActive:${active}&sort=createdAt,${filter === 'newest'? 'desc':'asc'}&page=${page}&size=${size}`)
     return res.data;
}

export const createCourse = (data : ICourse) =>{
    return create<ICourse>({
        url:"/instructor/courses",
        data
    })
}
export const updateCourseDesc = (data : ICourse) =>{
    return update<ICourse>({
        url:"/instructor/courses/description",id:data.id||"",data
    })
}
export const createSection = ({data,courseId} : {data : ISection;courseId : string}) =>{
    return create<ISection,ISectionResponse>({
        url:`/instructor/courses/section/${courseId}`,
        data
    })
}
export const updateSectionName = ({data,courseId,id} : {data:ISection,courseId:string,id:string}) =>{
    return update<ISection,ISectionResponse>({
        url: `/instructor/courses/${courseId}/section`,
        id,data
    })
}
export const updateLectureName = ({data,courseId,id} : {data:ILecture,courseId:string,id:string}) =>{
    return update<ILecture,ISectionResponse>({
        url: `/instructor/courses/${courseId}/lecture`,
        id,data
    })
}
export const deleteSection = ({id,courseId} : {id : string; courseId : string}) =>{
    return activate({
        url:`/instructor/courses/${courseId}/delete/section`,
        id
    })
}
export const deleteLecture = ({id,courseId} : {id : string; courseId : string}) =>{
    return activate<ISectionResponse>({
        url:`/instructor/courses/${courseId}/delete/lecture`,
        id
    })
}
export const reorderLectures = ({sectionId,data} : {sectionId:string;data:string[]}) =>{
    return create<string[],ISectionResponse>({
        url:`/instructor/courses/${sectionId}/reorder-lectures`,
        data
    })
}
export const updateLectureVideo = ({data,courseId,id} : {data:ILecture,courseId:string,id:string}) =>{
    return update<ILecture,ISectionResponse>({
        url:`/instructor/courses/${courseId}/lecture-video`,
        data,id
    })
}
export const createLecture = ({data,courseId} : {data : ILecture,courseId : string}) =>{
    return create<ILecture,ISectionResponse>({
        url: `/instructor/courses/lecture/${courseId}`,
        data
    })
}
export const getCourseDetail = (id : string) =>{
    return getById<ICourseDetailResponse>({
        url:`/instructor/courses`,
        id
    })
}
