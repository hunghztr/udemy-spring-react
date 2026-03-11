import Loading from "@/components/loading";
import {  Suspense } from "react";
import { createBrowserRouter } from "react-router-dom"
import { AdminHomePage, AdminLayout, AdminNotifyPage, AuthPage, CategoryManagementPage,
   CourseInstructorPage, CourseManagementPage, CreateCoursePage, EditCoursePage, ForgotPasswordPage,
    HomePage, InstructorLayout, InstructorNotifyPage, Layout, OAuth2Callback, ProfileInstructorPage,
     SearchPage, UserManagementPage, CourseDetailPage, 
     CategoryCoursePage,
     CartPage,
     PaySuccess,
     MyLearningPage,
     DetailLearningPage,
     AdminRatingPage} from "./lazy";
import ProtectedLayout from "@/components/admin/layout/protected.layout";
import PaySuccessPage from "@/screens/user/pay.success.page";

export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<Loading />}>
        <Layout />
      </Suspense>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/search", element: <SearchPage />},
      { path: "/auth", element: <AuthPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/course/:slug", element: <CourseDetailPage /> },
      { path: "/category/:slug", element: <CategoryCoursePage /> },
      { path: "/cart", element: <CartPage />},
      { path: "/payment-success", element: <PaySuccessPage />},
      { path: "/payment-result", element: <PaySuccess />},
      { path: "/my-learning", element: <MyLearningPage />},
      { path: "/learn/:slug", element: <DetailLearningPage />}
    ],
  },
  {
    path: "/oauth2/callback",
    element: (
      <Suspense fallback={<Loading />}>
        <OAuth2Callback />
      </Suspense>
    ),
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        element: (
          <Suspense fallback={<Loading />}>
            <AdminLayout />
          </Suspense>
        ),
        children: [
          { path: "/admin", element: <AdminHomePage /> },
          { path: "/admin/users", element: <UserManagementPage /> },
          { path: "/admin/courses", element: <CourseManagementPage /> },
          { path: "/admin/categories", element: <CategoryManagementPage /> },
          { path: "/admin/notifications", element: <AdminNotifyPage /> },
          { path: "/admin/ratings/:courseId", element: <AdminRatingPage />}
        ],
      },
      {
        element: (
          <Suspense fallback={<Loading />}>
            <InstructorLayout />
          </Suspense>
        ),
        children: [
          { path: "/instructor/course", element: <CourseInstructorPage /> },
          { path: "/instructor/profile", element: <ProfileInstructorPage /> },
          { path: "/instructor/create-course", element: <CreateCoursePage /> },
          { path: "/instructor/edit-course/:id", element: <EditCoursePage /> },
          {
            path: "/instructor/notification",
            element: <InstructorNotifyPage />,
          },
        ],
      },
    ],
  },
]);