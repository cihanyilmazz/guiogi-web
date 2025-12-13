// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Ant Design CSS
import "antd/dist/reset.css";  // v5 için reset.css, v4 ise 'antd/dist/antd.css'

import "./index.css"; // Tailwind CSS
import "./assets/style.scss"; // Tailwind CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
