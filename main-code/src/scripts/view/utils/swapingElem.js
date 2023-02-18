import { findValidCoords } from "./chekForValidCoords";
import findCoordBtn from "./findBtnCoordinates";
import chekingPositionForWin from "./checkWinPosition";
import addmodal from "../../controllers/addModal";
let blockedCoords = null;

export function randomSwap(matrix, blankNumber) {
  //matrix - двумерный массив в данном случае
  //blankCoord - позиция пустого квадрата относительно других блоков
  const blankCoords = findCoordBtn(blankNumber, matrix);

  const validCoords = findValidCoords({ blankCoords, matrix, blockedCoords });

  const finalCoords =
    validCoords[Math.floor(Math.random() * validCoords.length)];

  swap(blankCoords, finalCoords, matrix);
  blockedCoords = blankCoords;
}

export function swap(coordsOne, coordsTwo, matrix) {
  const coordsOneNum = matrix[coordsOne.y][coordsOne.x];
  matrix[coordsOne.y][coordsOne.x] = matrix[coordsTwo.y][coordsTwo.x];
  matrix[coordsTwo.y][coordsTwo.x] = coordsOneNum;

  //всплывающее окно в случае победы
  if (chekingPositionForWin(matrix)) {
    addmodal();
  }
}
