import type { ICourseInfoResponse } from "@/type/course.module"
import { getAllNoPage, getById } from "../api.crud.query"
import type { ILearningResponse, IQuizz } from "@/type/learning.module"

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
export const getQuizs = (id : string) =>{
    return getById<IQuizz[]>({
        url: `/learnings/quiz`,
        id
    })
}