import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/layout.tsx";
import AuthPage from "./screens/auth.page.tsx";
import OAuth2Callback from "./utils/Oauth2Callback.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme/theme.ts";
import { CssBaseline } from "@mui/material";
import HomePage from "./screens/home.page.tsx";
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
    ],
  },
  {
    element: <OAuth2Callback />,
    path: "/oauth2/callback",
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
        <CssBaseline />
      </ThemeProvider>
      <ToastContainer />
    </Provider>
  </StrictMode>
);
