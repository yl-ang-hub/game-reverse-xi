/* -------------------------------------- Constants -------------------------------------- */
/* -------------------------------------- Variables -------------------------------------- */
/* ------------------------------ Cached Reference Elements ------------------------------ */
/* -------------------------------------- Functions -------------------------------------- */
/* ----------------------------------- Event Listeners ----------------------------------- */

function setUpBoard(size) {
  /**
   * @description Initialise a new board and update display.
   */

  // Assume 0 is black, 1 is white, and null is empty
  // Coordinates for board is board[posY][posX]

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
  currPlayer = 0;
}

function runGame(y, x) {
  /**
   * @description Invokes functions to check on legality of moves, flip seeds, update display, change player, check for end game, and randomly flip seeds (crazy mode only) for each of the player's turn.
   */
  if (board[y][x] !== null) {
    const message = "Please choose an empty square.";
    updateMessageDisplay(message);
    return;
  }
  const [isLegalMove, capturedSeeds] = checkMove(y, x, currPlayer, true);
  if (!isLegalMove) {
    updateMessageDisplay("", isLegalMove);
    return;
  }

  placeAndFlipSeeds(y, x, capturedSeeds);
  updateSeedCountDisplay(countSeeds());
  turnCount++;

  const [endGame, skipNextPlayer] = checkEndGame();
  if (endGame) {
    endGameSequence();
    return;
  } else if (!endGame && !skipNextPlayer) {
    changePlayer();
    animateSeedCounter();
  } else if (!endGame && skipNextPlayer) {
    let skippedName = currPlayer ? p1Name : p2Name;
    updateMessageDisplay(
      `${skippedName}'s turn is skipped as they do not have any legal move left. `
    );
  }

  if (currPlayer) {
    disableBoardInteraction();
    setTimeout(runComputer, 500);
  } else {
    enableBoardInteraction();
  }

  if (turnCount % 10 === 0 && gameMode === "Crazy") {
    disableBoardInteraction();
    animateSeedCounter(false);
    clearPlayerDisplay();
    updateMessageDisplay(
      "Crazy mode: a random seed from both players will be flipped!"
    );

    setTimeout(() => {
      const [p1SeedToFlip, p2SeedToFlip] = randomlyFlipSeeds();
      if (p1SeedToFlip !== undefined) {
        board[p1SeedToFlip[0]][p1SeedToFlip[1]] = 1;
        highlightRandSquareToFlip(p1SeedToFlip[0], p1SeedToFlip[1]);
        setTimeout(() => updateBoardDisplay([p1SeedToFlip], 1), 3000);
      }
      if (p2SeedToFlip !== undefined) {
        board[p2SeedToFlip[0]][p2SeedToFlip[1]] = 0;
        highlightRandSquareToFlip(p2SeedToFlip[0], p2SeedToFlip[1]);
        setTimeout(() => updateBoardDisplay([p2SeedToFlip], 0), 3000);
      }
      setTimeout(() => {
        updateMessageDisplay("");
        enableBoardInteraction();
        animateSeedCounter();
        updatePlayerDisplay();
      }, 3500);
    }, 2000);
  }
}

function checkMove(
  y,
  x,
  playerForChecking = currPlayer,
  getAllCapturedSeeds = false
) {
  /**
   * @description Wrapper for recursive function to check if move is legal and get the seeds captured.
   * @return {boolean} Returns true if there are legal move(s) for the player
   * @return {<Array<boolean, Array>>}: Returns true if there are legal move(s) and
   * an Array of the coordinates of seeds that will be captured by the player
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
     * @description Recursively check for legal move and the opponent's seeds that will be captured
     */

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
      return;
    }
    if (y === -1 || x === -1 || y === boardLength || x === boardLength) {
      capturedSeedsInOneDirection = [];
      return recursiveCheckMove(direction + 1, moveY, moveX);
    }
    if (board[y][x] === null) {
      capturedSeedsInOneDirection = [];
      return recursiveCheckMove(direction + 1, moveY, moveX);
    } else if (board[y][x] === opponentToCheck) {
      capturedSeedsInOneDirection.push([y, x]);
      return recursiveCheckMove(direction, y, x);
    } else if (
      board[y][x] === playerForChecking &&
      capturedSeedsInOneDirection.length !== 0
    ) {
      for (coord of capturedSeedsInOneDirection) {
        capturedSeeds.push(coord);
      }
      capturedSeedsInOneDirection = [];
      return recursiveCheckMove(direction + 1, moveY, moveX);
    } else if (
      board[y][x] === playerForChecking &&
      capturedSeedsInOneDirection.length === 0
    ) {
      return recursiveCheckMove(direction + 1, moveY, moveX);
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

function placeAndFlipSeeds(y, x, capturedSeeds) {
  /**
   * @description Updates the board of the captured seeds and invokes the function to display on screen
   */
  board[y][x] = currPlayer;
  for (let [posY, posX] of capturedSeeds) {
    board[posY][posX] = currPlayer;
  }
  capturedSeeds.unshift([y, x]);
  updateBoardDisplay(capturedSeeds, currPlayer);
}

function countSeeds() {
  /**
   * @description Count the seeds for each player
   * @return {Array<number>} of seeds for black and white player
   */
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
  /**
   * @description Updates the current player, and invokes the function to display a message and current player on screen
   */
  currPlayer ? (currPlayer = 0) : (currPlayer = 1);
  if (currPlayer) {
    updateMessageDisplay("Computer is playing.");
  } else {
    updateMessageDisplay("It's your turn!");
  }
  updatePlayerDisplay();
}

function checkEndGame() {
  /**
   * @return {Array<boolean>} Array of two booleans specifying if it is end game and if
   * current player's turn should be skipped
   * @description Checks for end game of either filled board or skip next player
   */
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
  if (emptySquares.length === 0) {
    return [true, false];
  }

  let hasLegalMove = false;
  emptySquares.forEach((coord) => {
    if (checkMove(coord[0], coord[1], opponent, false)) {
      hasLegalMove = true;
    }
  });
  if (hasLegalMove) {
    return [false, false];
  }
  emptySquares.forEach((coord) => {
    if (checkMove(coord[0], coord[1], currPlayer, false)) {
      hasLegalMove = true;
    }
  });
  if (hasLegalMove) {
    return [false, true];
  }
  return [true, false];
}

function randomlyFlipSeeds() {
  /**
   * @description Get all seeds on the board for both players and randomly return a selected seed for each player
   * @return {Array<Array<number>>} Provides an array of coordinates [y, x] of the selected seed for both black and white players
   */
  const p1Seeds = [],
    p2Seeds = [];
  let p1SeedToFlip = undefined,
    p2SeedToFlip = undefined;
  for (const [y, row] of board.entries()) {
    for (const [x, square] of row.entries()) {
      if (square === 0) {
        p1Seeds.push([parseInt(y), parseInt(x)]);
      } else if (square === 1) {
        p2Seeds.push([parseInt(y), parseInt(x)]);
      }
    }
  }
  if (p1Seeds.length > 4) {
    const randSeedInd = Math.ceil(Math.random() * (p1Seeds.length - 1));
    p1SeedToFlip = p1Seeds[randSeedInd];
  }
  if (p2Seeds.length > 4) {
    const randSeedInd = Math.ceil(Math.random() * (p2Seeds.length - 1));
    p2SeedToFlip = p2Seeds[randSeedInd];
  }
  if (p1Seeds.length <= 4 && p2Seeds.length <= 4) {
    updateMessageDisplay(
      "Crazy mode: As both players have less than 5 seeds each, no seeds will be flipped"
    );
  } else if (p1Seeds.length <= 4) {
    updateMessageDisplay(
      `Crazy mode: a random seed from both players will be flipped!\nAs ${p1Name} has less than 5 seeds, none of ${p1Name}'s seeds will be flipped`
    );
  } else if (p2Seeds.length <= 4) {
    updateMessageDisplay(
      `Crazy mode: a random seed from both players will be flipped!\nAs ${p2Name} has less than 5 seeds, none of ${p2Name}'s seeds will be flipped`
    );
  }
  return [p1SeedToFlip, p2SeedToFlip];
}
