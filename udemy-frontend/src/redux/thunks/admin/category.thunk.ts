import type { ICategory, ICategoryResponse } from "../../../type/category.module";
import { create, get, getAll, getAllNoPage, removeOrActive, update } from "./crud.thunk";

export const getAllCategories = getAll<ICategoryResponse>(
    'categories/getAll',
    '/admin/categories'
)
export const getAllCategoriesNoPage = getAllNoPage<ICategoryResponse[]>(
  'categories/getAllNoPage',
  '/admin/categories/no-page'
)
export const createCategory = create<ICategory,boolean>(
    'categories/create',
    '/admin/categories'
)
export const updateCategory = update<ICategory, boolean>(
    "categories/update",
    (data) => `/admin/categories/${data.id}`
);
export const getCategoryDetail =  get<ICategory>(
  "categories/getDetail",
  (id) => `/admin/categories/${id}`
);
export const disableCategory = removeOrActive<boolean>(
  "categories/disable",
  (id) => `/admin/categories/delete/${id}`
);

export const activateCategory = removeOrActive<boolean>(
  "categories/activate",
  (id) => `/admin/categories/active/${id}`
);