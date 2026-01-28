
export interface ICourse{
    id? : string;
    name?: string;
    categoriesId?: string[];
    description?: string;
    requirement?: string;
}
export interface ICourseResponse{
    id: string;
    name: string;
    star: number;
    sold: number;
    hour: number;
}
export interface ICourseDetailResponse{
    id: string;
    name: string;
    description: string;
    requirement: string;
    price: number;
    totalSection: number;
    imagePath: number;
    coupons: ICouponResponse[];
    sections: ISectionResponse[];
}
export interface ICouponResponse{
    id: string;
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
