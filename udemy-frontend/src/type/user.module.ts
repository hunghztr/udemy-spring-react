export interface IUserResponse{
    id : string,
    username : string,
    fullname : string,
    roleName : string,
    avatarPath?: string
}
export interface IUser{
    id? : string,
    username: string,
    password?: string,
    fullname: string,
    role: {
        id: string,
    }
}
export interface IUserDetailResponse{
    id : string,
    username : string,
    fullname : string,
    avatarPath?: string,
    roleName : string,
    description : string
}
export interface IInstructorProfileResponse {
  id: string;
  fullname: string;
  avatarPath: string;
  description: string;
  roleName: string;
  totalCourses: number;
  totalStudents: number;
  avgRating: number;
}
export interface IProfile{
    id?: string,
    fullname: string,
    description: string,
    avatarPath: string,
    roleName? : string
}
export interface IBank{
    account : string;
    bankName : string;
}
export interface IBankResponse{
    id:string;
    account:string;
    bankName:string;
    amount:number;
}

export interface IWalletResponse{
    id:string;
    username:string;
    fullname:string;
    account:string;
    bankName:string;
    amount:number;
}