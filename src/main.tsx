import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { DemoDashboardProvider } from "@/context/DemoDashboardContext";
import i18n from "./i18n";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <DemoDashboardProvider>
          <App />
        </DemoDashboardProvider>
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);
