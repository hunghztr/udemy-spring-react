import type { IPagination } from "@/type/pagination";
import { create, getById, remove } from "../api.crud.query";
import type { IRating, IRatingResponse } from "@/type/learning.module";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { IApiResponse, ISliceResponse } from "@/type/api.response";
import api from "@/api/api";

export const useGetRatings = ({ courseId, pagination }: {
  courseId: string;
  pagination: IPagination;
}) => {

  return useInfiniteQuery({
    queryKey: ["ratings/get-all-by-course", courseId],

    queryFn: async ({ pageParam = 0 }) => {

      const res: IApiResponse<ISliceResponse<IRatingResponse>> =
        await api.get(`/learnings/get-ratings/${courseId}`, {
          params: {
            page: pageParam,
            size: pagination.size
          }
        });

      return res.data;
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage, pages) => {
        // last page là response
      if (!lastPage.hasNext) return undefined;
      // gán cho page param
      return pages.length;
    }
  });

};
export const createRating = ({courseId,rating} : {courseId : string,rating: IRating}) =>{
    return create<IRating,IRatingResponse>({
        url:`/learnings/rate/${courseId}`,
        data:rating
    })
}

export const getCount = (courseId : string) =>{
    return getById<number>({
        url:`/learnings/ratings/get-count`,
        id:courseId
    })
}
export const useUserReport = (userId:string,courseId:string) =>{
  return useQuery({
    queryKey:['ratings/get-report'],
    queryFn: async () =>{
      const res : IApiResponse<IRatingResponse> = await 
      api.get(`/admin/learnings/get-rating-by-user/${userId}/${courseId}`)
      return res.data; 
    }
  })
}
export const deleteRating = ({userId,courseId} : {userId:string|null,courseId:string|undefined}) =>{
  return remove<boolean>({
    url:`/admin/learnings/${userId}`,
    id:courseId||""
  })
}