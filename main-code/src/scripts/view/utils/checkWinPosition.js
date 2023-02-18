export default function chekingPositionForWin(matrix) {
  const winFlatArr = new Array(16).fill(0).map((_item, i) => i + 1);
  //сравниваем с первоначальным массивом
  const flatMatrix = matrix.flat(); // поднятие массива на один уровен без вложений
  for (let i = 0; i < winFlatArr.length; i++) {
    if (flatMatrix[i] !== winFlatArr[i]) {
      return false;
    }
  }
  return true;
}
