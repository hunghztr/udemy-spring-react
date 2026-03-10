import type { ICourseInfoResponse, ILearningResponse } from "@/type/course.module"
import { getAllNoPage, getById } from "../api.crud.query"

export const getAllLearnings = (filter : "in-progress"|"completed"|"all") =>{
    return getAllNoPage<ILearningResponse[]>({
        url: `/learnings?status=${filter}`
    })
}
export const getLearning = (courseId : string) =>{
    return getById<ICourseInfoResponse>({
        url:`/learnings/learn`,
        id:courseId
    })
}