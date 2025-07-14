/* -------------------------------------- Constants -------------------------------------- */
/* -------------------------------------- Variables -------------------------------------- */
/* ------------------------------ Cached Reference Elements ------------------------------ */
/* -------------------------------------- Functions -------------------------------------- */
/* ----------------------------------- Event Listeners ----------------------------------- */

function placeSeed(y, x) {
  /**
   * @return [board, currPlayer]
   */
  if (board[y][x] !== null) {
    const message = "Please choose an empty square.";
    updateMessageDisplay(message);
    return;
  }
  // Note that check already been done beforehand to ensure player def have legal moves

  const [isLegalMove, seedsToFlip] = checkMove(1, y, x, currPlayer, true);

  console.log(`seed placed at [${y}, ${x}]`);
  let endGame = false;
  if (isLegalMove) {
    board[y][x] = currPlayer;
    flipSeeds(seedsToFlip);
    endGame = checkEndGame();
    if (!endGame) {
      changePlayer();
    }
  } else {
    updateMessageDisplay("", isLegalMove);
  }

  if (endGame) {
    // TODO: Code end game
    endGameDisplay();
  }
}

function checkMove(
  direction,
  y,
  x,
  playerForChecking = currPlayer,
  getAllCapturedSeeds = false
) {
  /**
   * Wrapper for recursive function
   * @return hasLegalMove: boolean
   * @return [hasLegalMove, seedsToFlip]
   */
  const moveY = y,
    moveX = x,
    opponentToCheck = playerForChecking ? 0 : 1;
  let seedsToFlip = [],
    capturedSeedsInOneDirection = [],
    isLegalMove = false;

  function recursiveCheckMove(direction, y, x) {
    /**
     * Updates capturedSeeds
     */
    // console.log(`moveY and moveX is ${moveY} and ${moveX}`);
    // console.log(
    //   `Running in direction ${direction} at y-x of ${y}-${x} and current player is ${playerForChecking}`
    // );
    if (!getAllCapturedSeeds && isLegalMove) {
      return;
    }
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
      // check if x or y hits 7
    }
    if (direction === 9) {
      // console.log("breaking as direction >= 9");
      return;
    }
    if (y === -1 || x === -1 || y === boardLength || x === boardLength) {
      // console.log("breaking as y or x >= boardlength");
      capturedSeedsInOneDirection = [];
      direction++;
      recursiveCheckMove(direction, moveY, moveX);
      return;
    }
    // console.log(`Updated y and x is ${y}, ${x}`);
    // console.log(`boardlength is ${boardLength}`);
    // console.log(`running recursion for board at ${y}-${x}`);
    // console.log(board[y][x]);
    if (board[y][x] === null) {
      capturedSeedsInOneDirection = [];
      direction++;
      recursiveCheckMove(direction, moveY, moveX);
    } else if (board[y][x] === opponentToCheck) {
      // console.log(`opponentToCheck logic running`);
      capturedSeedsInOneDirection.push([y, x]);
      // console.log(`capturedSeedInOneDirection: ${capturedSeedsInOneDirection}`);
      recursiveCheckMove(direction, y, x);
    } else if (
      board[y][x] === playerForChecking &&
      capturedSeedsInOneDirection.length !== 0
    ) {
      // console.log(`Found self logic running`);
      for (coord of capturedSeedsInOneDirection) {
        seedsToFlip.push(coord);
        // console.log(`seedsToFlip is ${seedsToFlip}`);
      }
      capturedSeedsInOneDirection = [];
      direction++;
      recursiveCheckMove(direction, moveY, moveX);
    } else if (
      board[y][x] === playerForChecking &&
      capturedSeedsInOneDirection.length === 0
    ) {
      direction++;
      recursiveCheckMove(direction, moveY, moveX);
    }
  }
  recursiveCheckMove(direction, y, x);
  if (seedsToFlip.length > 0) {
    isLegalMove = true;
  }
  if (!getAllCapturedSeeds) {
    return isLegalMove;
  } else {
    return [isLegalMove, seedsToFlip];
  }
}

function flipSeeds(seedsToFlip) {
  for (let [posY, posX] of seedsToFlip) {
    board[posY][posX] = currPlayer;
  }
  updateBoardDisplay();
}

function changePlayer() {
  currPlayer ? (currPlayer = 0) : (currPlayer = 1);
  if (currPlayer) {
    updateMessageDisplay("Computer is playing.");
  } else {
    updateMessageDisplay("It's your turn!");
  }
  updatePlayerDisplay();
}

function checkEndGame() {
  const emptySquares = [];
  const opponent = 1;
  if (currPlayer) {
    opponent = 0;
  }
  console.log(opponent);
  for (const [y, row] of board.entries()) {
    for (const [x, square] of row.entries()) {
      if (square === null) {
        emptySquares.push([y, x]);
      }
    }
  }

  // console.log(emptySquares);
  let hasLegalMove = false;
  emptySquares.forEach((coord) => {
    // console.log(`running checkMove() for`, coord[0], coord[1]);
    if (checkMove(1, coord[0], coord[1], currPlayer, false)) {
      console.log(`found legal move`);
      hasLegalMove = true;
    }
  });
  if (hasLegalMove) {
    return false;
  }
  emptySquares.forEach((coord) => {
    if (checkMove(1, coord[0], coord[1], opponent, false)) {
      console.log(`found legal move`);
      hasLegalMove = true;
    }
  });
  if (hasLegalMove) {
    return false;
  }
  return true;
}

// TODO: Code checkEndGame()
//   - message="How about clicking on the top left button to start a new game?"
