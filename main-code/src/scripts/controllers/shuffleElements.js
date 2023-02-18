import { randomSwap } from "../view/utils/swapingElem";
import setPositionMatrix from "../view/components/setPositionElem";

export default function mixElements(matrix, blankNumber, items, shuffled) {
  const gameField = document.querySelector(".game-field");
  let mixCount = 0;

  const radioBtnsField = document.querySelector(".js-radio-btns");

  //количество перемешиваний
  radioBtnsField.addEventListener("click", (e) => {
    const btn = e.target.closest("input");
    if (btn == null) return;
    switch (btn.id) {
      case "first-btn":
        mixCount = 10;
        break;
      case "second-btn":
        mixCount = 25;
        break;
      case "third-btn":
        mixCount = 50;
        break;

      default:
        break;
    }
  });

  let timer;
  const shuffleClass = "gameShuffle";

  document.getElementById("js-button").addEventListener("click", () => {
    if (shuffled || mixCount == 0) return;
    let shuffleCount = 0;
    clearInterval(timer);
    gameField.classList.add(shuffleClass);
    shuffled = true;

    if (shuffleCount === 0) {
      timer = setInterval(() => {
        randomSwap(matrix, blankNumber);
        setPositionMatrix(matrix, items);

        shuffleCount += 1;

        if (shuffleCount >= mixCount) {
          clearInterval(timer);
          gameField.classList.remove(shuffleClass);
          shuffled = false;
        }
      }, 150);
    }
  });
}
