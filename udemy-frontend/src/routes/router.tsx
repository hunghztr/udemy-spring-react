import Loading from "@/components/loading";
import {  Suspense } from "react";
import { createBrowserRouter } from "react-router-dom"
import { AdminHomePage, AdminLayout, AdminNotifyPage, AuthPage, CategoryManagementPage, CourseInstructorPage, CourseManagementPage, CreateCoursePage, EditCoursePage, ForgotPasswordPage, HomePage, InstructorLayout, InstructorNotifyPage, Layout, OAuth2Callback, ProfileInstructorPage, SearchPage, UserManagementPage } from "./lazy";
import ProtectedLayout from "@/components/admin/layout/protected.layout";

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