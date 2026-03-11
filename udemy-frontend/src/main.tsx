import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {  RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.ts";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme/theme.ts";
import { CssBaseline } from "@mui/material";
import { PersistGate } from "redux-persist/integration/react";
import AuthInitializer from "./utils/auth.initializer.tsx";
import {  QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "./routes/router.tsx";
import { query } from "./query/queryClient.ts";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={query}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
          <ThemeProvider theme={theme}>
            <AuthInitializer >
              <RouterProvider router={router} />
              <ReactQueryDevtools initialIsOpen={false} />
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
            </AuthInitializer>
          </ThemeProvider>
      </PersistGate>
    </Provider>
    </QueryClientProvider>
  </StrictMode>
);
