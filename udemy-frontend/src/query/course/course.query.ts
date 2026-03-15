import api from "@/api/api";
import type { IApiResponse } from "@/type/api.response";
import { type ICourseInfoResponse, type ICourse, type ICourseDetailResponse, type ICourseResponse, type ILecture, type ISection, type ISectionResponse, type ICourseSearchResponse } from "@/type/course.module";
import type { IPagination, IPaginationResponse } from "@/type/pagination";
import { activate, create, getAll, getAllNoPage, getById, remove, update } from "../api.crud.query";
import type { IFinishResponse } from "@/type/learning.module";


export const getCoursesByAuthor = async ({
  page,
  size,
  active,
  keyword,
  filter,
}: IPagination) => {
  const params: any = {
    page,
    size,
    sort: `createdAt,${filter === "newest" ? "desc" : "asc"}`,
  };
  // filter động
  const filters: string[] = [];

  if (keyword) {
    filters.push(`name~'${keyword}'`);
  }
  if (active !== undefined) {
    filters.push(`isActive:${active}`);
  }
  if (filters.length > 0) {
    params.filter = filters.join(" and ");
  }
  const res: IApiResponse<IPaginationResponse<ICourseResponse>> =
    await api.get(
      "/instructor/courses/get-courses-by-author",
      { params }
    );
  return res.data;
};

export const getInterestedCourses = () =>{
    return getAllNoPage<ICourseSearchResponse[]>({
        url:"/client/get-interested-courses"
    })
}
export const getCourseInfo = (id : string) =>{
    return getById<ICourseInfoResponse>({
        url:"/client/get-course-detail",
        id
    })
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
    return remove({
        url:`/instructor/courses/${courseId}/delete/section`,
        id
    })
}
export const deleteLecture = ({id,courseId} : {id : string; courseId : string}) =>{
    return remove<ISectionResponse>({
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

export const updateCourseImage = (data : ICourse) =>{
    return update<ICourse>({
        url: `/instructor/courses/update-image`,
        data,id:data.id||""
    })
}
export const updatePrice = ({courseId,data} : {courseId:string;data:ICourse}) =>{
    return update<ICourse>({
        url: `/instructor/courses/update-price`,
        id:courseId,data
    })
}
export const disableCourseByIns = (id : string) =>{
    return activate({
    url:"/instructor/courses/delete",
    id
    })
}
export const enableCourseByIns = (id : string) =>{
    return activate({
    url:"/instructor/courses/active",
    id
    })
}
// for admin
export const getAllCoursesByAdmin = (data : IPagination) =>{
    return getAll<ICourseResponse>({
    url:"/admin/courses",
    pagination : data
    })
}
export const disableCourse = (id : string) =>{
    return activate({
    url:"/admin/courses/delete",
    id
    })
}
export const enableCourse = (id : string) =>{
    return activate({
    url:"/admin/courses/active",
    id
    })
}
export const markFinish = ({lectureId,finish}:{lectureId : string,finish:boolean}) =>{
    return update<{finish:boolean},IFinishResponse>({
        url: `/learnings/lecture`,
        id: lectureId,
        data:{finish}
    })
}