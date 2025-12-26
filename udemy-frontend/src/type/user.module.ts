export interface IResult {
  result: string;
}
export interface IUserToken{
  id : string;
  username: string;
  fullname: string;
  role: string;
  avatarPath: string;
}
export interface ILogin{
  username : string;
  password : string;
}
export interface ICurrentUser{
  accessToken : string;
  user : IUserToken;
}
export interface IRegister{
  username : string;
  password : string;
  fullname : string;
}