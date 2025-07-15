/* -------------------------------------- Constants -------------------------------------- */
/* -------------------------------------- Variables -------------------------------------- */
/* ------------------------------ Cached Reference Elements ------------------------------ */
/* -------------------------------------- Functions -------------------------------------- */
/* ----------------------------------- Event Listeners ----------------------------------- */

function setUpBoard(size) {
  /**
   * Initialise a new board and update display.
   */

  // Assume 0 is black, 1 is white, and null is empty
  // Coordinates for board is board[posY][posX]

  // console.log(`setUpBoard is running`);
  boardLength = parseInt(size);
  board = [];
  mid1 = boardLength / 2 - 1;
  mid2 = boardLength / 2;
  for (let y = 0; y < boardLength; y++) {
    board[y] = [];
    for (let x = 0; x < boardLength; x++) {
      board[y][x] = null;
      if ((y === mid1 && x === mid1) || (y === mid2 && x === mid2)) {
        board[y][x] = 0;
      } else if ((y === mid1) & (x === mid2) || (y === mid2 && x === mid1)) {
        board[y][x] = 1;
      }
    }
  }
  // Temporary code for debug; note [posY][posX]
  // board = [
  //   [null, null, null, null, null, null, null, null, null, null],
  //   [null, null, null, null, null, null, null, null, null, null],
  //   [null, null, 1, null, null, null, null, null, null, null],
  //   [null, null, 0, null, null, null, null, null, null, null],
  //   [1, 0, null, 0, 0, 1, null, null, null, null],
  //   [null, null, 0, null, 1, 0, 0, null, null, null],
  //   [null, null, 1, null, null, null, null, null, null, null],
  //   [null, null, null, null, null, null, null, null, null, null],
  // ];

  // TODO: Flip this board in multiple directions to test end-game code
  // Temporary code for debug; no further moves for both sides.
  // board = [
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 1, 0],
  //   [0, 0, 0, 0, 0, 1, null, null],
  //   [0, 0, 0, 0, 0, 0, null, null],
  //   [0, 0, 0, 0, 0, 0, null, 1],
  //   [0, 0, 0, 0, 0, 0, 0, null],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  // ];
  // TODO: Get a few more board layouts to test end game

  currPlayer = 0;
}

function placeSeed(y, x) {
  /**
   * Invokes functions to check on legality of moves, flip seeds, update display,
   * change player and check for end game for each of the player's turn.
   */
  if (board[y][x] !== null) {
    const message = "Please choose an empty square.";
    updateMessageDisplay(message);
    return;
  }
  const [isLegalMove, capturedSeeds] = checkMove(y, x, currPlayer, true);

  let endGame = false;
  if (isLegalMove) {
    console.log(`${currPlayer} places seed at [${y}, ${x}]`);
    board[y][x] = currPlayer;
    flipSeeds(capturedSeeds);
    updateSeedCounterDisplay(countSeeds());
    endGame = checkEndGame();
    if (!endGame) {
      changePlayer();
    }
  } else {
    updateMessageDisplay("", isLegalMove);
  }

  if (endGame) {
    endGameDisplay();
  }

  if (currPlayer) {
    console.log(`Computer sequence is running and currPlayer is ${currPlayer}`);
    runComputer();
  }
}

function checkMove(
  y,
  x,
  playerForChecking = currPlayer,
  getAllCapturedSeeds = false
) {
  /**
   * Wrapper for recursive function
   * @return hasLegalMove: boolean
   * @return [hasLegalMove, capturedSeeds]
   */
  const moveY = y,
    moveX = x,
    opponentToCheck = playerForChecking ? 0 : 1;
  let capturedSeeds = [],
    capturedSeedsInOneDirection = [],
    isLegalMove = false,
    direction = 1;

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
        capturedSeeds.push(coord);
        // console.log(`capturedSeeds is ${capturedSeeds}`);
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
  if (capturedSeeds.length > 0) {
    isLegalMove = true;
  }
  if (!getAllCapturedSeeds) {
    return isLegalMove;
  } else {
    return [isLegalMove, capturedSeeds];
  }
}

function flipSeeds(capturedSeeds) {
  for (let [posY, posX] of capturedSeeds) {
    board[posY][posX] = currPlayer;
  }
  updateBoardDisplay();
}

function countSeeds() {
  const seedsCounter = { black: 0, white: 0 };
  for (row of board) {
    for (square of row) {
      if (square === 0) {
        seedsCounter.black++;
      } else if (square === 1) {
        seedsCounter.white++;
      }
    }
  }
  return seedsCounter;
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
  let opponent = 1;
  if (currPlayer) {
    opponent = 0;
  }
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
    if (checkMove(coord[0], coord[1], currPlayer, false)) {
      console.log(`found legal move`);
      hasLegalMove = true;
    }
  });
  if (hasLegalMove) {
    return false;
  }
  emptySquares.forEach((coord) => {
    if (checkMove(coord[0], coord[1], opponent, false)) {
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
