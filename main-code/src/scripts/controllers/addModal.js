export default function addmodal() {
  setTimeout(() => {
    document.getElementById("modal-container").classList.add("four");
    document.body.classList.add("modal-active");
  }, 500);

  document.getElementById("btn-remove").addEventListener("click", () => {
    document.getElementById("modal-container").classList.remove("four");
    document.body.classList.remove("modal-active");
  });
}
