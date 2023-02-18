import "./style/main.scss";
import { setChildren } from "redom";
import { createMainField } from "./scripts/view/app/mainpage";
import { createGameItems } from "./scripts/controllers/createAppLogic";
import createModal from "./scripts/view/components/modal";

(() => {
  const main = document.getElementById("section-app");
  setChildren(main, [createMainField(), createModal()]);

  createGameItems();
})();
