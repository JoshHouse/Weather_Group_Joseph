import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";

// Get the root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App inside root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
