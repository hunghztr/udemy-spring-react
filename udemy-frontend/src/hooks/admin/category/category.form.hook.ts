import { useCallback, useEffect, useState } from "react";
import { useFormHook } from "../form.hook";
import {  type ICategory, type ICategoryResponse } from "../../../type/category.module";
import { createCategory, getAllCategoriesNoPage, getCategoryDetail, updateCategory } from "../../../redux/thunks/admin/category.thunk";

interface IUseFormHookProps{
    categoryId?: string;
}
export const useCategoryFormHook =  ({categoryId}
     : IUseFormHookProps) =>{
    const [name,setName] = useState<string>("");
    const [selectedCategoryId,setSelectedCategoryId] = useState<string>("");
    const [categoryList,setCategoryList] = useState<ICategoryResponse[] | null>(null);


    const {dispatch,handleCreate,handleUpdate,errorCreate,errorUpdate} = useFormHook<boolean>({
        errorNameCreate:"categories/create",
        errorNameUpdate:"categories/update",
        errorNameGet:"categories/get",
        thunkMethodCreate:createCategory,
        thunkMethodUpdate:updateCategory,
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
    const fetchCategories = useCallback(async () =>{
        try{
            const res = await dispatch(getAllCategoriesNoPage()).unwrap();
            setCategoryList(res);
        }catch{
            setCategoryList(null);
        }
    },[]);
    const fetchCategory = useCallback(async () =>{
        try{
            if(categoryId){
                const res = await dispatch(getCategoryDetail({id:categoryId})).unwrap();
                setName(res.name);
                const category = categoryList?.find(r => r.name === res.categoryParent?.name);
                setSelectedCategoryId(category?.id||"");
            }
        }catch(err){

        }
    },[categoryId])
    // effects
    useEffect(() =>{
        fetchCategories();
        fetchCategory();
    },[categoryId])
    return {
        name,setName,errorCreate,errorUpdate,handleCreateCategory,handleUpdateCategory,
        selectedCategoryId,setSelectedCategoryId,categoryList
    }
}