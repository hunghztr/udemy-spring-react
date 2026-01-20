export interface IUserToken{
  id : string;
  username: string;
  fullname: string;
  roleName: string;
  avatarPath: string;
  description? : string;
}
export interface ILogin{
  username : string;
  password : string;
}

export interface IRegister{
  username : string;
  password : string;
  fullname : string;
}
export interface IToken{
  accessToken : string;
  isAuthenticated : boolean;
  isInittialized : boolean;
}