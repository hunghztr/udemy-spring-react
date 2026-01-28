import { useSave } from "@/query/use.crud.query";

interface IUseActionHookProps {
    mutationEnable: string;
    mutationDisable: string;
    disableMethod: (id: string) => Promise<boolean>;
    enableMethod: (id : string) => Promise<boolean>;
}
export const useActionHook = ({mutationDisable,mutationEnable,
    disableMethod,enableMethod} : IUseActionHookProps) =>{
    // state
    const {mutateAsync:mutateDisable,isPending:isPendingDisable,error: errorDisable} = useSave<boolean,string>(
        mutationDisable,
        disableMethod
    );
    const {mutateAsync:mutateEnable,isPending:isPendingEnable,error: errorEnable} = useSave<boolean,string>(
        mutationEnable,
        enableMethod
    )
    
    // handle click
    const handleDisable = async (id:string) =>{
         await mutateDisable(id);
    }
    const handleEnable = async (id:string) =>{
         await mutateEnable(id);
    }
    return {errorDisable,errorEnable,handleDisable,handleEnable,isPendingDisable,isPendingEnable};
}
