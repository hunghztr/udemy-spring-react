import { useSave } from "@/query/use.crud.query";


interface IUseFormHookProps<Req>{
    userId?: string;
    mutationCreate: string;
    mutationUpdate: string;
    createData : (data : Req) => Promise<boolean>;
    updateData : (data : Req) => Promise<boolean>;
}
export const useFormHook = <Req> ({mutationCreate,mutationUpdate,createData,updateData
} : IUseFormHookProps<Req>) =>{
    // state
    const {error: errorCreate,isPending: isPendingCreate,mutateAsync: mutateAsyncCreate} =
     useSave<boolean, Req>(
        mutationCreate, createData
    )
    const {error: errorUpdate,isPending: isPendingUpdate,mutateAsync: mutateAsyncUpdate} =
     useSave<boolean, Req>(
        mutationUpdate, updateData
    )
    // handle functions
    const handleCreate = async <T>(data : T) =>{
        return await mutateAsyncCreate(data as unknown as Req);
    }
    const handleUpdate = async <T>(data : T) =>{
        return await mutateAsyncUpdate(data as unknown as Req);
    }

    return {
        errorCreate,errorUpdate,isPendingCreate,isPendingUpdate,
        handleCreate,handleUpdate
    }
}