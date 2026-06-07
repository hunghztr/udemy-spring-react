export interface ICategoryResponse{
    id : string,
    name? : string,
    categoryParent? : ICategoryResponse | null
}
export interface ICategory{
    id?: string;
    name: string;
    categoryParent?: ICategoryResponse | null
}
export interface ICategoryParentResponse{
    id : string;
    name : string;
    categories : {
        id : string;
        name : string;
    }[]
}
export interface ICategoryCourseResponse{
    id:string;
    name:string;
    courseCount:number;
}
export interface ICategoryStudentResponse{
    id: string;
    name: string;
    students: number;
    month: number;
}