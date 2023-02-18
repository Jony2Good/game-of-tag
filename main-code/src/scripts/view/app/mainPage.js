import { el, setChildren } from "redom";

export function createMainField() {
  const container = el("div.page.text-center");
  const title = el("h1.title", "Game of tag");
  const wrap = el("div.game-field");
  const row = el("div.fifteen", { id: "main-block" });
  const radioBtns = createRadioBtns();

  for (let i = 0; i < 16; i++) {
    const item = el(
      "button.items",
      { "data-matrix-id": i + 1 },
      el(
        "span.items-span.d-flex.justify-content-center.align-items-center",
        i + 1
      )
    );
    row.append(item);
  }
  const btn = el(
    "div.d-flex.justify-content-center.align-items-center",
    el("button.btn-layout", { id: "js-button" }, "Mix")
  );
  setChildren(wrap, row);

  container.append(title, radioBtns, wrap, btn);
  return container;
}

function createRadioBtns() {
  const bodyRadioBtn = el(
    "div.mb-4.js-radio-btns",
    "Choose the difficulty level"
  );

  const firstInner = el("div.form-check.form-check-inline");
  const firstInput = el("input.form-check-input", {
    type: "radio",
    name: "inlineRadioOptions",
    id: "first-btn",
  });
  const firstLabel = el("label.form-check-label", { for: "first-btn" }, "Easy");

  const secondInner = el("div.form-check.form-check-inline");
  const secondInput = el("input.form-check-input", {
    type: "radio",
    name: "inlineRadioOptions",
    id: "second-btn",
  });
  const secondLabel = el(
    "label.form-check-label",
    { for: "second-btn" },
    "Medium"
  );

  const thirdInner = el("div.form-check.form-check-inline");
  const thirdInput = el("input.form-check-input", {
    type: "radio",
    name: "inlineRadioOptions",
    id: "third-btn",
  });
  const thirdLabel = el(
    "label.form-check-label",
    { for: "second-btn" },
    "Hard"
  );

  setChildren(firstInner, [firstInput, firstLabel]);
  setChildren(secondInner, [secondInput, secondLabel]);
  setChildren(thirdInner, [thirdInput, thirdLabel]);

  setChildren(bodyRadioBtn, [firstInner, secondInner, thirdInner]);

  return bodyRadioBtn;
}
