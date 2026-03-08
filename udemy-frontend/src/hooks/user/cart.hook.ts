import { query } from "@/main";
import { addToCart, deleteFromCart, getCart, getSalePrice } from "@/query/cart/cart.query";
import { useGetAll, useSave } from "@/query/use.crud.query";
import type { ICartResponse } from "@/type/cart.module";
import { showToast } from "@/utils/toast";

export const useCartHook = () => {

  const { mutate: applyCoupon, isPending: isCoupon } =
    useSave<number, { courseId: string; code: string }>(
      "/carts/get-sale-price",
      getSalePrice
    );

  const { mutate: deleteCourse, isPending: isDeleted } =
    useSave<boolean, string>("carts/delete-from-cart", deleteFromCart);

  const { mutate: add, isPending } =
    useSave<boolean, string>("carts/add-to-cart", addToCart);

  const { data, isPending: isList } =
    useGetAll<ICartResponse>("carts/get-cart", getCart);

  const handleAdd = (courseId: string) => {
    add(courseId, {
      onSuccess: () => {
        showToast("Thêm vào giỏ hàng thành công");
        query.invalidateQueries({ queryKey: ["carts/get-cart"] });
      },
      onError: (err) => {
        showToast(err.response?.data.message || "Thêm vào giỏ hàng thất bại");
      },
    });
  };

  const handleApplyCoupon = (courseId: string, code: string) => {
    applyCoupon(
      { courseId, code },
      {
        onSuccess: (salePrice) => {
          showToast("Áp dụng mã giảm giá thành công");

          query.setQueryData<ICartResponse>(
            ["carts/get-cart"],
            (oldData) => {
              if (!oldData) return oldData;

              const updatedCourses = oldData.courses.map((c) => {
                if (c.id === courseId) {
                  return {
                    ...c,
                    priceTemp: c.priceTemp ?? c.price,
                    code,
                    price: salePrice,
                  };
                }
                return c;
              });

              const newTotal = updatedCourses.reduce(
                (sum, c) => sum + c.price,
                0
              );

              return {
                ...oldData,
                courses: updatedCourses,
                price: newTotal,
              };
            }
          );
        },

        onError: (err) => {
          showToast(err.response?.data.message || "Mã giảm giá không hợp lệ", "error");
        },
      }
    );
  };

  const handleDelete = (courseId: string) => {
    deleteCourse(courseId, {
      onSuccess: () => {
        query.invalidateQueries({ queryKey: ["carts/get-cart"] });
      },
    });
  };

  return {
    handleAdd,
    handleDelete,
    handleApplyCoupon,
    data,
    isPending,
    isList,
    isDeleted,
    isCoupon,
  };
};