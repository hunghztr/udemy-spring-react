import type { IUserResponse } from "./user.module";

export interface ILearningResponse{
    id : string;
    imagePath: string;
    name : string;
    progress : number;
    star:number;

}
export interface IRatingResponse{
    id : {
        userId : string;
        courseId : string;
    };
    star : number;
    message : string;
    customer : IUserResponse;
    createdAt : string;
}
export interface IRating{
    star : number;
    message : string;
}
export interface IFinishResponse{
    lectureId : string;
    isFinish: boolean;
}
export interface IQuizz{
    id : string;
    question: string;
    answer : string;
    options : string[];
}