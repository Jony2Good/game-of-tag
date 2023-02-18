import { el, setChildren } from "redom";

export default function createModal() {
  const container = el("div", { id: "modal-container" });
  const modalBg = el("div.modal-background");

  const modalBody = el("div.modal-content.js-modal");
  const title = el(
    "div.modal-header.justify-content-center.mb-4",
    el("h5.modal-title.text-danger", "Congratulations, you are the winner!")
  );
  const imgInner = el("div.modal-body.img-fluid.modal-img.mb-4");

  const modalBtn = el(
    "div.modal-footer.d-flex.justify-content-center",
    el(
      "button.btn.btn-secondary",
      { id: "btn-remove", type: "button" },
      "Try again?"
    )
  );

  setChildren(modalBody, [title, imgInner, modalBtn]);
  setChildren(modalBg, modalBody);
  setChildren(container, modalBg);

  return container;
}
