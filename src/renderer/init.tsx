import { createRoot } from "react-dom/client";
import { Artistry } from "./Artistry";

export function init() {
  const element = document.getElementById("container");

  if (!element) {
    return;
  }

  const root = createRoot(element);
  root.render(<Artistry />);
}
