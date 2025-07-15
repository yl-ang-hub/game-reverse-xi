/* -------------------------------------- Constants -------------------------------------- */
/* -------------------------------------- Variables -------------------------------------- */
/* ------------------------------ Cached Reference Elements ------------------------------ */
/* -------------------------------------- Functions -------------------------------------- */
function runComputer() {
  /**
   * @description Invokes computer to make a move and place seed on the board
   */
  let [y, x] = getCalculatedMove();
  console.log(`Computer decided on a calculated move: ${y}, ${x}`);
  placeSeed(y, x);
}

function getCalculatedMove() {
  /**
   * @return {(number|Array)} Coordinates [y,x] of computer's selected move.
   * @description Invokes game logic functions based game difficulty.
   */
  const legalMoves = [];
  for (const [y, row] of board.entries()) {
    for (const [x, square] of row.entries()) {
      if (square === null && checkMove(y, x, currPlayer, false)) {
        legalMoves.push([y, x]);
      }
    }
  }
  if (gameDifficulty === "Easy") {
    return compLogicEasy(legalMoves);
  } else {
    console.log(`Error: difficulty level not yet coded`);
  }
}

function compLogicEasy(legalMoves) {
  /**
   * @return {(number|Array)} Coordinates [y,x] of the selected move.
   * @description Computer logic to select a move for a game difficulty of EASY.
   */
  legalMoves.forEach((coord) => console.log(coord));
  const randMove = Math.floor(Math.random() * legalMoves.length);
  return [legalMoves[randMove][0], legalMoves[randMove][1]];
}

function compLogicIntermediate(legalMoves) {
  /**
   * @return {(number|Array)} Coordinates [y,x] of the selected move.
   * @description Computer logic to select a move for a game difficulty of INTERMEDIATE.
   */
}

/* ----------------------------------- Event Listeners ----------------------------------- */
