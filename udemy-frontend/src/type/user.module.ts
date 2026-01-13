export interface IUserResponse{
    id : string,
    username : string,
    fullname : string,
    roleName : string
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
