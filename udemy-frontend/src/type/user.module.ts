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
export interface IProfile{
    id?: string,
    fullname: string,
    description: string,
    avatarPath: string,
    roleName? : string
}
