import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./ui/App.jsx";
import { pixiManager } from "./lib/PixiManager.js";

pixiManager.init();
pixiManager.loadData().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
