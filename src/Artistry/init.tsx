import { createRoot } from "react-dom/client";
import { Artistry } from "./Artistry";

export function init() {
  const root = createRoot(document.body);
  root.render(<Artistry />);
}
