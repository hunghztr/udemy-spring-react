import { useQuery } from "@tanstack/react-query";

export const useGetAll = <T>(
    key : string, apiFn : () => Promise<T>
) => {
    return useQuery<T>({
        queryKey : [key],
        queryFn : apiFn
    })
}

// export const useGetById = <T>(
//     key : string, apiFn : (id : string) => Promise<T>, id : string
// ) =>{
//     return useQuery<T>({
//         queryKey: [key],
//         queryFn : () => apiFn(id)
//     })
// }

// export const usePaging = <T>(
//     key : string, apiFn : (param : any) => Promise<T>, param : any
// ) =>{
//     return useQuery<T>({
//         queryKey: [key],
//         queryFn : () => apiFn(param),
//     })
// }