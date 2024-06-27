import { createRoot } from "react-dom/client";
import { Artistry } from "./Artistry";

export function init() {
  const root = createRoot(document.getElementById("container"));
  root.render(<Artistry />);
}
