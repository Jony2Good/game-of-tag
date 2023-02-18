import findCoordBtn from "../view/utils/findBtnCoordinates";
import { isValidForSwap } from "../view/utils/chekForValidCoords";
import { swap } from "../view/utils/swapingElem";
import setPositionMatrix from "../view/components/setPositionElem";

export default function changeItemsPositions(
  container,
  matrix,
  blankNumber,
  items,
  shuffled
) {
  container.addEventListener("click", (e) => {
    if (shuffled) return;
    const btn = e.target.closest("button");
    if (!btn) return;

    const buttonNumber = Number(btn.dataset.matrixId);

    const buttonCoords = findCoordBtn(buttonNumber, matrix);
    const blankCoords = findCoordBtn(blankNumber, matrix);
    const isValid = isValidForSwap(buttonCoords, blankCoords);

    if (isValid) {
      swap(buttonCoords, blankCoords, matrix);
      setPositionMatrix(matrix, items);
    }
  });
  makeArrowClick(matrix, blankNumber, items, shuffled);
}

//перемещение кубиков с помощью клавиатуры
function makeArrowClick(matrix, blankNumber, items, shuffled) {
  window.addEventListener("keydown", (e) => {
    if (shuffled) return;
    if (!e.key.includes("Arrow")) return;
    const blankCoords = findCoordBtn(blankNumber, matrix);
    const btnCoords = {
      x: blankCoords.x,
      y: blankCoords.y,
    };
    const direction = e.key.split("Arrow")[1].toLowerCase();
    const maxIndexMatrix = matrix.length;

    switch (direction) {
      case "up":
        btnCoords.y += 1;
        break;
      case "down":
        btnCoords.y -= 1;
        break;
      case "left":
        btnCoords.x += 1;
        break;
      case "right":
        btnCoords.x -= 1;
        break;

      default:
        break;
    }
    if (
      btnCoords.y >= maxIndexMatrix ||
      btnCoords.y < 0 ||
      btnCoords.x >= maxIndexMatrix ||
      btnCoords.x < 0
    )
      return;

    swap(blankCoords, btnCoords, matrix);
    setPositionMatrix(matrix, items);
  });
}
