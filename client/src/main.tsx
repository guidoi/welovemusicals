import { createRoot } from "react-dom/client";
import App from "./App";
import { AppProviders } from "./AppProviders";
import "./index.css";

// Expose env vars to window for analytics script
if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
  (window as any).__VITE_ANALYTICS_ENDPOINT__ = import.meta.env.VITE_ANALYTICS_ENDPOINT;
}
if (import.meta.env.VITE_ANALYTICS_WEBSITE_ID) {
  (window as any).__VITE_ANALYTICS_WEBSITE_ID__ = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
}

createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <App />
  </AppProviders>
);
