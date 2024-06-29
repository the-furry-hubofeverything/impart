import { createRoot } from "react-dom/client";
import { Impart } from "./Impart";

export function init() {
  const element = document.getElementById("container");

  if (!element) {
    return;
  }

  const root = createRoot(element);
  root.render(<Impart />);
}
