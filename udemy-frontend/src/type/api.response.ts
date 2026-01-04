export interface IApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}
export interface Error{
  loginError : string|null,
  registerError : string|null,
  mailError : string |null,
  refreshError : string|null,
  logOutError : string|null,
  otpError : string|null,
  changePassError : string|null
}