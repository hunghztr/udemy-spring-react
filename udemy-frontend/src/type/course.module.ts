import type { ICategoryResponse } from "./category.module";
import type { IUserResponse } from "./user.module";

export interface ICourse{
    id? : string;
    name?: string;
    imagePath?: string;
    price?: number;
    categoriesId?: string[];
    description?: string;
    requirement?: string;
}
export type Status = "PENDING" | "PUBLISHED" | "REJECTED"
export interface ICourseResponse{
    id: string;
    name: string;
    star: number;
    sold: number;
    hour: number;
    status: Status;
}
export interface ICourseDetailResponse{
    id: string;
    name: string;
    description: string;
    requirement: string;
    price: number;
    totalSection: number;
    imagePath?: string;
    status: Status;
    coupons: ICouponResponse[];
    sections: ISectionResponse[];
}
export interface ICouponResponse{
    id?: string;
    code: string;
    discount: number;
}
export interface ISectionResponse{
    id?: string;
    name: string;
    totalLecture: number;
    hour: number;
    lectures: ILectureResponse[];
}
export interface ISection{
    id?: string;
    name?: string;
}
export interface ILecture{
    id?:string;
    name?: string;
    section?: ISection;
    path?: string;
    second?: number;
}
export interface ILectureResponse{
    id?: string;
    name: string;
    second: number;
    path: string;
    sectionId?: string;
    isFinished?: boolean;
}

export interface ICourseSearchResponse{
    id:string;
    name:string;
    authorName:string;
    imagePath:string;
    star:number;
    sold:number;
    hour:number;
    description:string;
    price:number;
    categories:string[]
}
export interface ILearningResponse{
    id : string;
    imagePath: string;
    name : string;
    progress : number;
    star:number;

}
export interface IRecommendResponse{
    keyword:string;
    type:"HISTORY"|"TRENDING"
}
export interface ICourseInfoResponse{
    id : string;
    name : string;
    description : string;
    requirement : string;
    price : number;
    hour : number;
    sold : number;
    star : number;
    totalSection : number;
    imagePath : string;
    sections : ISectionResponse[];
    updatedAt : string;
    author : IUserResponse;
    categories : ICategoryResponse[];
}

export interface IFilterRequest{
    star? : number;
    isFree? : boolean;
    durationFrom? :number;
    durationTo? : number;
    sortBy? : "ratingDesc" | "ratingAsc" | "priceDesc" | "priceAsc" | "durationDesc" | "durationAsc";
}