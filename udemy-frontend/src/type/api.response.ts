export interface IApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export interface IResult {
  result: string;
}


export interface ISignatureResponse{
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: string;
}
export interface ISliceResponse<T> {
  items: T[];
  hasNext: boolean;
}