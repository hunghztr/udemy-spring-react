import type { ICategory, ICategoryResponse } from "@/type/category.module";
import { useEffect, useState } from "react";
import { useFormHook } from "../form.hook";
import { useGetAll, useGetById } from "@/query/use.crud.query";
import { createCategory, getAllCategoriesNoPage, getCategoryById, updateCategory } from "@/query/category/category.query";

interface IUseFormHookProps{
    categoryId?: string;
}
export const useCategoryFormHook =  ({categoryId}
     : IUseFormHookProps) =>{
    const [name,setName] = useState<string>("");
    const [selectedCategoryId,setSelectedCategoryId] = useState<string>("");
    const [categoryList,setCategoryList] = useState<ICategoryResponse[] | null>(null);
    const {error:getError,data,isLoading:isLoadingCategory} = useGetById<ICategoryResponse>(
            'categories/get-by-id',getCategoryById,categoryId || ""
        )
    const {error:getListError,data:cateData,isLoading:isLoadingCategories} = useGetAll<ICategoryResponse[]>(
            'categories/get-all-no-page',getAllCategoriesNoPage
        )
    useEffect(() =>{
        if(cateData && !isLoadingCategories){
            setCategoryList(cateData);
        }
    },[cateData])
    useEffect(() =>{
        if(data && !isLoadingCategory){
            setName(data.name||"")
            const category = categoryList?.find(r => r.name === data.categoryParent?.name);
            setSelectedCategoryId(category?.id||"");
        }
    },[data])
    const {handleCreate,handleUpdate,errorCreate,errorUpdate} = useFormHook<ICategory>({
        mutationCreate:"categories/create",
        mutationUpdate:"categories/update",
        createData: createCategory,
        updateData: updateCategory
    });
    const handleCreateCategory = async () =>{
        const param : ICategory = {name}
        if(selectedCategoryId){
            param.categoryParent = {id : selectedCategoryId}
        }
        const res = await handleCreate<ICategory>(param);
        if(res){
            setName("");
        }
        return res;
    }
    const handleUpdateCategory = async (id : string) =>{
        const param : ICategory = {id,name}
        if(selectedCategoryId) param.categoryParent = {id : selectedCategoryId}
        const res = await handleUpdate<ICategory>(param);
        if(res){
            setName("");
        }
        return res;
    }
   
    return {
        name,setName,errorCreate,errorUpdate,handleCreateCategory,handleUpdateCategory,
        selectedCategoryId,setSelectedCategoryId,categoryList,getError,getListError
    }
}