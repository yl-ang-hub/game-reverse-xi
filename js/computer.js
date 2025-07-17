/* -------------------------------------- Constants -------------------------------------- */
/* -------------------------------------- Variables -------------------------------------- */
/* ------------------------------ Cached Reference Elements ------------------------------ */
/* -------------------------------------- Functions -------------------------------------- */
function runComputer() {
  /**
   * @description Invokes functions for computer to make a move and place seed on the board
   */
  let [y, x] = getCalculatedMove();
  runGame(y, x);
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
        legalMoves.push([parseInt(y), parseInt(x)]);
      }
    }
  }
  if (gameDifficulty === "Easy") {
    return compLogicEasy(legalMoves);
  } else if (gameDifficulty === "Intermediate") {
    return compLogicIntermediate(legalMoves);
  } else if (gameDifficulty === "Hard") {
    return compLogicHard(legalMoves);
  }
}

function compLogicEasy(legalMoves) {
  /**
   * @return {(number|Array)} Coordinates [y,x] of the selected move.
   * @description Computer logic to select a move for a game difficulty of EASY.
   */
  const randMove = Math.floor(Math.random() * legalMoves.length);
  return [legalMoves[randMove][0], legalMoves[randMove][1]];
}

function compLogicIntermediate(legalMoves) {
  /**
   * @return {(number|Array)} Coordinates [y,x] of the selected move.
   * @description Computer logic to select a move for a game difficulty of INTERMEDIATE.
   */
  const valueOfMoves = [];
  for (move of legalMoves) {
    const totalSeedsCaptured = compIsBraining(move[0], move[1]);
    valueOfMoves.push(totalSeedsCaptured);
  }
  let indexOfMaxSeeds = 0;
  for (let i = 1; i < valueOfMoves.length; i++) {
    if (valueOfMoves[i] > valueOfMoves[indexOfMaxSeeds]) {
      indexOfMaxSeeds = i;
    }
  }
  return [legalMoves[indexOfMaxSeeds][0], legalMoves[indexOfMaxSeeds][1]];
}

function compLogicHard(legalMoves) {
  /**
   * @return {(number|Array)} Coordinates [y,x] of the selected move.
   * @description Computer logic to select a move for a game difficulty of INTERMEDIATE.
   */
  const valueOfMoves = [];
  for (move of legalMoves) {
    const totalSeedsCaptured = compIsBraining(move[0], move[1]);
    valueOfMoves.push(totalSeedsCaptured);
  }
  for (let i = 0; i < legalMoves.length; i++) {
    // 10x multiplier for corners
    // 0.1x multiplier for squares surrounding corners
    // 3x multipler for borders
    if (
      (legalMoves[i][0] === 0 && legalMoves[i][1] === 0) ||
      (legalMoves[i][0] === 0 && legalMoves[i][1] === boardLength - 1) ||
      (legalMoves[i][0] === boardLength - 1 && legalMoves[i][1] === 0) ||
      (legalMoves[i][0] === boardLength - 1 &&
        legalMoves[i][1] === boardLength - 1)
    ) {
      valueOfMoves[i] *= 10;
    } else if (
      (legalMoves[i][0] === 0 &&
        (legalMoves[i][1] === 1 || legalMoves[i][1] === boardLength - 2)) ||
      (legalMoves[i][0] === 1 &&
        (legalMoves[i][1] === 0 ||
          legalMoves[i][1] === 1 ||
          legalMoves[i][1] === boardLength - 2 ||
          legalMoves[i][1] === boardLength - 1)) ||
      (legalMoves[i][0] === boardLength - 2 &&
        (legalMoves[i][1] === 0 ||
          legalMoves[i][1] === 1 ||
          legalMoves[i][1] === boardLength - 2 ||
          legalMoves[i][1] === boardLength - 1)) ||
      (legalMoves[i][0] === boardLength - 1 &&
        (legalMoves[i][1] === 1 || legalMoves[i][1] === boardLength - 2))
    ) {
      valueOfMoves[i] = Math.floor(valueOfMoves[i] * 0.1);
    } else if (
      legalMoves[i][0] === 0 ||
      legalMoves[i][0] === boardLength - 1 ||
      legalMoves[i][1] === 0 ||
      legalMoves[i][1] === boardLength - 1
    ) {
      valueOfMoves[i] *= 3;
    }
  }
  let indexOfMaxSeeds = 0;
  for (let i = 1; i < valueOfMoves.length; i++) {
    if (valueOfMoves[i] > valueOfMoves[indexOfMaxSeeds]) {
      indexOfMaxSeeds = i;
    }
  }
  return [legalMoves[indexOfMaxSeeds][0], legalMoves[indexOfMaxSeeds][1]];
}

function compIsBraining(y, x) {
  /**
   * @description Wrapper for recursive function to get the number of seeds captured.
   * @return {<Array<boolean, Array>>}: Returns true if there are legal move(s) and
   * an Array of the coordinates of seeds that will be captured by the player
   */
  const moveY = y,
    moveX = x,
    opponent = currPlayer ? 0 : 1;
  let capturedSeeds = 0,
    capturedSeedsInOneDirection = 0,
    direction = 1;

  function recursiveCompCheckMove(direction, y, x) {
    /**
     * @description Recursively search for opponent seeds that will be captured
     */
    switch (direction) {
      case 1: // Up
        y--;
        break;
      case 2: // diagonally right up
        x++, y--;
        break;
      case 3: // right
        x++;
        break;
      case 4: // diagonally right down
        x++, y++;
        break;
      case 5: // down
        y++;
        break;
      case 6: // diagonally left down
        x--, y++;
        break;
      case 7: // left
        x--;
        break;
      case 8: // diagonally left up
        x--, y--;
        break;
    }
    if (direction === 9) {
      return;
    }
    if (y === -1 || x === -1 || y === boardLength || x === boardLength) {
      capturedSeedsInOneDirection = 0;
      return recursiveCompCheckMove(direction + 1, moveY, moveX);
    }
    if (board[y][x] === null) {
      capturedSeedsInOneDirection = 0;
      return recursiveCompCheckMove(direction + 1, moveY, moveX);
    } else if (board[y][x] === opponent) {
      capturedSeedsInOneDirection++;
      return recursiveCompCheckMove(direction, y, x);
    } else if (board[y][x] === currPlayer && capturedSeedsInOneDirection > 0) {
      capturedSeeds += capturedSeedsInOneDirection;
      capturedSeedsInOneDirection = 0;
      return recursiveCompCheckMove(direction + 1, moveY, moveX);
    } else if (
      board[y][x] === currPlayer &&
      capturedSeedsInOneDirection === 0
    ) {
      return recursiveCompCheckMove(direction + 1, moveY, moveX);
    }
  }
  recursiveCompCheckMove(direction, y, x);
  return capturedSeeds;
}
/* ----------------------------------- Event Listeners ----------------------------------- */
