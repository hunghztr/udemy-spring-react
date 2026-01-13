import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/user/layout/layout.tsx";
import AuthPage from "./screens/auth.page.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.ts";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme/theme.ts";
import { CssBaseline } from "@mui/material";
import HomePage from "./screens/home.page.tsx";
import { PersistGate } from "redux-persist/integration/react";
import OAuth2Callback from "./utils/oauth2Callback.tsx";
import ForgotPasswordPage from "./screens/forgot.password.page.tsx";
import AdminHomePage from "./screens/admin/admin.home.page.tsx";
import AdminLayout from "./components/admin/layout/admin.layout.tsx";
import AuthInitializer from "./utils/auth.initializer.tsx";
import ProtectedLayout from "./components/admin/layout/protected.layout.tsx";
import UserManagementPage from "./screens/admin/user.management.page.tsx";
import CourseManagementPage from "./screens/admin/course.management.page.tsx";
import CategoryManagementPage from "./screens/admin/category.management.page.tsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />
      }
    ],
  },
  {
    element: <OAuth2Callback />,
    path: "/oauth2/callback",
  },
  // protected
  {
    element: <ProtectedLayout />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/admin",
            element: <AdminHomePage />,
          },
          {
            path: "/admin/users",
            element: <UserManagementPage />
          },
          {
            path: "/admin/courses",
            element: <CourseManagementPage />
          },
          {
            path: "/admin/categories",
            element: <CategoryManagementPage />
          }
        ],
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AuthInitializer >
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
        
            <ToastContainer
            position="top-center"
            closeButton={false}
            hideProgressBar
            toastStyle={{
              background: "transparent",
              boxShadow: "none",
              padding: 0,
            }} />
            <CssBaseline />
          </ThemeProvider>
        </AuthInitializer>
      </PersistGate>
    </Provider>
  </StrictMode>
);
