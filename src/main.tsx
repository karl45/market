import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./provider/AuthProvider.tsx";
import { LoadingProvider } from "./provider/LoadingProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoadingProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LoadingProvider>
  </StrictMode>,
);
