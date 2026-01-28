export interface IApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export interface IResult {
  result: string;
}

export interface IVideoResponse{
  result: string;
  duration: number;
}
export interface ISignatureResponse{
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: string;
}
export interface ITwoList<T,V>{
  firstList: T[];
  secondList: V[];
}