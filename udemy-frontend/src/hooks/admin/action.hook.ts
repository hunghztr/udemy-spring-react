import type { AsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../redux/hook";

interface IId{
    id : string;
}
interface IUseActionHookProps<T> {
    errorNameDisable: string;
    errorNameEnable: string;
    thunkMethodDisable: AsyncThunk<
        T,
        IId,
        { rejectValue: string }
    >;
    thunkMethodEnable: AsyncThunk<
        T,
        IId,
        { rejectValue: string }
    >;
}
export const useActionHook = <T>({errorNameDisable,errorNameEnable,
    thunkMethodDisable,thunkMethodEnable} : IUseActionHookProps<T>) =>{
    // state
    const loading = useAppSelector(state => state.loading);
    const errorDisable = useAppSelector(state => state.error.errors[errorNameDisable || "global"]);
    const errorEnable = useAppSelector(state => state.error.errors[errorNameEnable || "global"]);
        
    const dispatch = useAppDispatch();
    // handle click
    const handleDisable = async (id:string) =>{
        try{
            await dispatch(thunkMethodDisable({id})).unwrap();
        }catch(err){
            // nothing
        }
    }
    const handleEnable = async (id:string) =>{
        try{
            await dispatch(thunkMethodEnable({id})).unwrap();
        }catch(err){
            // nothing
        }
    }
    return {loading,errorDisable,errorEnable,handleDisable,handleEnable};
}
