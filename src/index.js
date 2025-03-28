import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./styles.css";
import { AppProvider } from "./AppContext";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppProvider> {/* Wrap the App with AppProvider */}
        <App />
      </AppProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
