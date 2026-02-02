import type { INotification } from "@/type/notification.module"
import { create } from "../api.crud.query"

export const createNotification = (data : INotification) =>{
    return create<INotification>({
        url:"/notifications",
        data
    })
}