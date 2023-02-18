export function findValidCoords({ blankCoords, matrix, blockedCoords }) {
  const validCoords = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (isValidForSwap({ x, y }, blankCoords)) {
        if (!blockedCoords || !(blockedCoords.x == x && blockedCoords.y == y))
          validCoords.push({ x, y });
      }
    }
  }
  return validCoords;
}

export function isValidForSwap(coords1, coords2) {
  const difX = Math.abs(coords1.x - coords2.x);
  const difY = Math.abs(coords1.y - coords2.y);

  return (
    (difX === 1 || difY === 1) &&
    (coords1.x === coords2.x || coords1.y === coords2.y)
  );
}
