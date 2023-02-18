import getMatrix from "../view/components/createMatrix";
import setPositionMatrix from "../view/components/setPositionElem";
import changeItemsPositions from "./changeItemPos";
import mixElements from "./shuffleElements";

export function createGameItems() {
  //основной контейнер с элементами
  const containerNode = document.getElementById("main-block");
  //список элементов
  const items = Array.from(containerNode.querySelectorAll(".items"));

  const countItems = 16;
  if (items.length !== 16)
    throw new Error(`Need
${countItems} HTML elements!`);

  //к последнему элементу применяется стиль
  items[countItems - 1].style.display = "none";

  //присваивается всем элементам дата атрибут
  let arrItems = items.map((item) => Number(item.dataset.matrixId));

  // создается матрица из элементов
  let matrix = getMatrix(arrItems);

  //выстраивается сетка элементов
  setPositionMatrix(matrix, items);

  const blankNumber = 16;
  let shuffled = false;

  changeItemsPositions(containerNode, matrix, blankNumber, items, shuffled);
  mixElements(matrix, blankNumber, items, shuffled);
}
