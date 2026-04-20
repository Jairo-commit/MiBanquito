import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import { CustomTheme } from "./mui/customTheme";
import { queryClient } from "~/lib/queryClient";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CustomTheme>
          <App />
        </CustomTheme>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
