
export interface INotificationResponse{
    id?:string;
    title:string;
    message:string;
    url:string;
    read:boolean;
    createdAt : string;
}
export interface INotification{
    title:string;
    message:string;
    url:string;
    user:{
        username:string;
    };
}
export interface NotificationSlice {
  items: INotificationResponse[];
  hasNext: boolean;
}