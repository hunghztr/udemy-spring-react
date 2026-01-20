import type { AsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../redux/hook";

interface IUseFormHookProps<T>{
    userId?: string;
    errorNameCreate?: string;
    errorNameUpdate?: string;
    errorNameGet?: string;
        thunkMethodCreate?: AsyncThunk<
            T,
            any,
            { rejectValue: string }
        >;
        thunkMethodUpdate?: AsyncThunk<
            T,
            any,
            { rejectValue: string }
        >;

}
export const useFormHook = <T> ({errorNameCreate,errorNameUpdate,errorNameGet,thunkMethodCreate,thunkMethodUpdate
} : IUseFormHookProps<T>) =>{
    // state
    const errorCreate = useAppSelector(state => state.error.errors[errorNameCreate || "global"]);
    const errorUpdate = useAppSelector(state => state.error.errors[errorNameUpdate || "global"]);
    const errorGet = useAppSelector(state => state.error.errors[errorNameGet || "global"]);
    const loading = useAppSelector(state => state.loading);
    const dispatch = useAppDispatch();
    
    // handle functions
    const handleCreate = async <T>(data : T) =>{
        try{
            const res  = await dispatch(thunkMethodCreate!(data)).unwrap();
            return res;
        }catch(err){
            return null;
        }
    }
    const handleUpdate = async <T>(data : T) =>{
        try{
            const res = await dispatch(thunkMethodUpdate!(data)).unwrap();
            return res;
        }catch(err){
            return null;
        }
    }

    return {
        errorCreate,errorUpdate,errorGet,loading,
        handleCreate,handleUpdate,dispatch
    }
}