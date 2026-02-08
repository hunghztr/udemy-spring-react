
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
}

export interface ICourseSearchResponse{
    id:string;
    name:string;
    authorName:string;
    imagePath:string;
    rating:number;
    sold:number;
    hour:number;
    description:string;
    price:number;
    categories:string[]
}