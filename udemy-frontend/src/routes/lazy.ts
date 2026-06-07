// src/routes/lazy.ts
import { lazy } from "react";

/* ================= USER ================= */
export const Layout = lazy(
  () => import("../components/user/layout/layout")
);
export const HomePage = lazy(
  () => import("../screens/user/home.page")
);
export const AuthPage = lazy(
  () => import("../screens/auth.page")
);
export const ForgotPasswordPage = lazy(
  () => import("../screens/forgot.password.page")
);
export const SearchPage = lazy(
  () => import("../screens/user/search.page")
)
export const CourseDetailPage = lazy(
  () => import("../screens/user/course.detail.page")
);
export const CategoryCoursePage = lazy(
  () => import("../screens/user/category.course.page")
);
export const CartPage = lazy(
  () => import("../screens/user/cart.page")
)
export const PaySuccessPage = lazy(
  () => import("../screens/user/pay.success.page")
)
export const PaySuccess = lazy(
  () => import("../utils/pay.success")
)
export const MyLearningPage = lazy(
  () => import("../screens/user/my.learning.page")
)
export const DetailLearningPage = lazy(
  () => import("../screens/user/detail.learning.page")
)
/* ================= ADMIN ================= */
export const AdminLayout = lazy(
  () => import("../components/admin/layout/admin.layout")
);
export const AdminHomePage = lazy(
  () => import("../screens/admin/admin.home.page")
);
export const UserManagementPage = lazy(
  () => import("../screens/admin/user.management.page")
);
export const CourseManagementPage = lazy(
  () => import("../screens/admin/course.management.page")
);
export const CategoryManagementPage = lazy(
  () => import("../screens/admin/category.management.page")
);
export const AdminNotifyPage = lazy(
  () => import("../screens/admin/admin.notify.page")
);
export const AdminRatingPage = lazy(
  () => import("../screens/admin/admin.rating.page")
)
export const AdminWalletPage = lazy(
  () => import("../screens/admin/admin.wallet.page")
)
export const AdminWalletUserPage = lazy(
  () => import("../screens/admin/admin.wallet.user.page")
)
export const AdminDashBoardPage = lazy(
  () => import("../screens/admin/admin.dashboard.page")
)
/* ============== INSTRUCTOR =============== */
export const InstructorLayout = lazy(
  () => import("../components/instructor/layout/instructor.layout")
);
export const CourseInstructorPage = lazy(
  () => import("../screens/instructor/course.instructor.page")
);
export const ProfileInstructorPage = lazy(
  () => import("../screens/instructor/profile.instructor.page")
);
export const CreateCoursePage = lazy(
  () => import("../screens/instructor/create.course.page")
);
export const EditCoursePage = lazy(
  () => import("../screens/instructor/edit.course.page")
);
export const InstructorNotifyPage = lazy(
  () => import("../screens/instructor/instructor.notify.page")
);
export const PayPage = lazy(
  () => import("../screens/instructor/pay.page")
)

/* ================= MISC ================== */
export const OAuth2Callback = lazy(
  () => import("../utils/oauth2.callback")
);

export const ForbiddenPage = lazy(
  () => import("../errors/forbidden")
)