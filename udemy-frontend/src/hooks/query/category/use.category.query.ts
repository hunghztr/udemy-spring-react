import api from "../../../api/api"
import type { IApiResponse } from "../../../type/api.response"
import type { ICategoryParentResponse } from "../../../type/category.module"
import type { IPaginationResponse } from "../../../type/pagination"

export const getParents = async () =>{
        const res : IApiResponse<IPaginationResponse<ICategoryParentResponse>> =
         await api.get("/client/categories/get-all-parents?active=true&keyword=");
         return res.data.elements
    } 
