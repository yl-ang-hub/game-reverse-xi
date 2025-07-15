/* -------------------------------------- Constants -------------------------------------- */
/* -------------------------------------- Variables -------------------------------------- */
/* ------------------------------ Cached Reference Elements ------------------------------ */
/* -------------------------------------- Functions -------------------------------------- */
function runComputer() {
  /**
   * @description Invokes functions for computer to make a move and place seed on the board
   */
  let [y, x] = getCalculatedMove();
  console.log(`Computer decided on a calculated move: ${y}, ${x}`);
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
  } else {
    console.log(`Error: difficulty level not yet coded`);
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
  console.log(`List of legal moves: ${legalMoves}`);
  console.log(`Value of moves: ${valueOfMoves}`);
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
  console.log(`List of legal moves: ${legalMoves}`);
  console.log(`Value of moves: ${valueOfMoves}`);
  for (let i = 0; i < legalMoves.length; i++) {
    // 10x multiplier for corners
    // 0.1x multiplier for squares surrounding corners
    // 3x multipler for borders
    console.log(
      `Running multiplier func on ${legalMoves[i][0]}, ${legalMoves[i][1]}`
    );
    if (
      (legalMoves[i][0] === 0 && legalMoves[i][1] === 0) ||
      (legalMoves[i][0] === 0 && legalMoves[i][1] === boardLength - 1) ||
      (legalMoves[i][0] === boardLength - 1 && legalMoves[i][1] === 0) ||
      (legalMoves[i][0] === boardLength - 1 &&
        legalMoves[i][1] === boardLength - 1)
    ) {
      console.log(
        `detected a corner, original val of move is ${valueOfMoves[i]}`
      );
      valueOfMoves[i] *= 10;
      console.log(`corner: multiplied val of move is ${valueOfMoves[i]}`);
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
      console.log(
        `detected a square surrounding a corner, original val of move is ${valueOfMoves[i]}`
      );
      valueOfMoves[i] = Math.floor(valueOfMoves[i] * 0.1);
      console.log(
        `square of corner: multiplied val of move is ${valueOfMoves[i]}`
      );
    } else if (
      legalMoves[i][0] === 0 ||
      legalMoves[i][0] === boardLength - 1 ||
      legalMoves[i][1] === 0 ||
      legalMoves[i][1] === boardLength - 1
    ) {
      console.log(
        `detected a border, original val of move is ${valueOfMoves[i]}`
      );
      valueOfMoves[i] *= 3;
      console.log(`border: multiplied val of move is ${valueOfMoves[i]}`);
    }
  }
  console.log(`List of legal moves: ${legalMoves}`);
  console.log(`Value of moves after multiplier effect: ${valueOfMoves}`);
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
   * Wrapper for recursive function
   * @return {boolean} Returns true if there are legal move(s) for the player
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
     * @description Recursively search for opponent seeds to capture
     */
    // console.log(`moveY and moveX is ${moveY} and ${moveX}`);
    console.log(
      `Running in direction ${direction} at y-x of ${y}-${x} and current player is ${currPlayer}`
    );
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
      console.log("breaking as direction >= 9");
      return;
    }
    if (y === -1 || x === -1 || y === boardLength || x === boardLength) {
      console.log("breaking as y or x >= boardlength");
      capturedSeedsInOneDirection = 0;
      direction++;
      recursiveCompCheckMove(direction, moveY, moveX);
      return;
    }
    // console.log(`Updated y and x is ${y}, ${x}`);
    // console.log(`boardlength is ${boardLength}`);
    // console.log(`running recursion for board at ${y}-${x}`);
    // console.log(board[y][x]);
    if (board[y][x] === null) {
      capturedSeedsInOneDirection = 0;
      direction++;
      recursiveCompCheckMove(direction, moveY, moveX);
    } else if (board[y][x] === opponent) {
      // console.log(`opponentToCheck logic running`);
      capturedSeedsInOneDirection++;
      // console.log(`capturedSeedInOneDirection: ${capturedSeedsInOneDirection}`);
      recursiveCompCheckMove(direction, y, x);
    } else if (board[y][x] === currPlayer && capturedSeedsInOneDirection > 0) {
      // console.log(`Found self logic running`);
      capturedSeeds += capturedSeedsInOneDirection;
      capturedSeedsInOneDirection = 0;
      direction++;
      recursiveCompCheckMove(direction, moveY, moveX);
    } else if (
      board[y][x] === currPlayer &&
      capturedSeedsInOneDirection === 0
    ) {
      direction++;
      recursiveCompCheckMove(direction, moveY, moveX);
    }
  }
  recursiveCompCheckMove(direction, y, x);
  return capturedSeeds;
}
/* ----------------------------------- Event Listeners ----------------------------------- */
