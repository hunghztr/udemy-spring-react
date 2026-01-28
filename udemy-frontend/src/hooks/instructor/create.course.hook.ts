import { getCategoriesNoPage } from "@/query/category/category.query";
import { createCourse } from "@/query/course/course.query";
import { useGetAll, useSave } from "@/query/use.crud.query";
import type { ICategoryResponse } from "@/type/category.module";
import type { ICourse } from "@/type/course.module";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useCreateCourse = () =>{
  const navigate = useNavigate();
    const [step, setStep] = useState<number>(1);
  const {error : saveError, isPending,mutateAsync} = useSave<boolean, ICourse>(
    "course/create",
    createCourse
  );
  const {data} = useGetAll<ICategoryResponse[]>(
    "categories/get-all-no-page",
    getCategoriesNoPage
  );

  // ===== FORM STATE =====
  const [title, setTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<ICategoryResponse[]>([]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // ===== IF ERROR -> FORCE STEP 1 =====
  useEffect(() => {
    if (saveError) {
      setStep(1);
    }
  }, [saveError]);


  useEffect(() => {
    if(data){
      setCategories(data);
    }
  }, [data]);
  // ===== PROGRESS =====
  const progress = step === 1 ? 0 : 50;

  // ===== FILTER + LIMIT =====
  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const list = keyword
      ? categories.filter((c) => c.name?.toLowerCase().includes(keyword))
      : categories;

    return keyword ? list : list.slice(0, 10);
  }, [categories, search]);

  // ===== CATEGORY TOGGLE =====
  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // ===== SUBMIT =====
  const handleFinish = async () => {
    
  const request: ICourse = {
    name: title,
    categoriesId: selectedCategories,
  };

  await mutateAsync(request, {
    onSuccess: () => {
      navigate("/instructor/course");
    },
    onError: () => {
      setStep(1);
    },
  });
  };
return {step,progress,title,saveError,setTitle,setStep,search,setSearchOpen,searchOpen,setSearch,
    filteredCategories,setCategories,selectedCategories,toggleCategory,isPending,handleFinish
}
}