/* -------------------------------------- Constants -------------------------------------- */
/* -------------------------------------- Variables -------------------------------------- */
/* ------------------------------ Cached Reference Elements ------------------------------ */
/* -------------------------------------- Functions -------------------------------------- */
/* ----------------------------------- Event Listeners ----------------------------------- */

function placeSeed(y, x, currPlayer) {
  /**
   * Return [board, currPlayer]
   */
  if (!board[y][x] === null) {
    // TODO - code this
    console.log("illegal move");
    return board;
  }
  // else if (!hasAvailableMove(board)) {
  //   console.log(`No eligible move left for ${currPlayer}`);
  //   changePlayer();
  //   return board;
  // }

  const [isLegalMove, seedsToFlip] = checkMove(
    1,
    y,
    x,
    currPlayer,
    board,
    true
  );

  // TODO: remove isLegalMove if checkMove not to be used for checking availableMoves
  if (isLegalMove) {
    board[y][x] = currPlayer;
    board = flipSeeds(seedsToFlip, currPlayer, board);
    currPlayer = changePlayer(currPlayer);
  } else {
    updateMessageDisplay("", isLegalMove);
  }
  // Note that check already been done beforehand to ensure player def have legal moves
  return [board, currPlayer];
}

function checkMove(direction, y, x, self, board, getAllCapturedSeeds = false) {
  /**
   * Wrapper for recursive function
   */
  const moveY = y,
    moveX = x,
    opponent = self ? 0 : 1;
  let seedsToFlip = [],
    capturedSeedsInOneDirection = [],
    isLegalMove = false;

  function recursiveCheckMove(direction, y, x) {
    /**
     * Updates capturedSeeds
     */
    console.log(`moveY and moveX is ${moveY} and ${moveX}`);
    console.log(
      `Running in direction ${direction} at y-x of ${y}-${x} and self is ${self}`
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
      // check if x or y hits 7
    }
    if (direction === 9) {
      console.log("breaking as direction >= 9");
      return;
    }
    if (y === boardLength || x === boardLength) {
      console.log("breaking as y or x >= boardlength");
      direction++;
      recursiveCheckMove(direction, moveY, moveX);
      return;
    }

    console.log(`running recursion for board at ${y}-${x}`);
    console.log(board[y][x]);
    if (board[y][x] === null) {
      capturedSeedsInOneDirection = [];
      direction++;
      recursiveCheckMove(direction, moveY, moveX);
    } else if (board[y][x] === opponent) {
      console.log(`opponent logic running`);
      capturedSeedsInOneDirection.push([y, x]);
      console.log(`capturedSeedInOneDirection: ${capturedSeedsInOneDirection}`);
      recursiveCheckMove(direction, y, x);
    } else if (
      board[y][x] === self &&
      capturedSeedsInOneDirection.length !== 0
    ) {
      console.log(`Found self logic running`);
      for (coord of capturedSeedsInOneDirection) {
        seedsToFlip.push(coord);
        console.log(`seedsToFlip is ${seedsToFlip}`);
      }
      if (!getAllCapturedSeeds) {
        isLegalMove = true;
        return;
      }
      capturedSeedsInOneDirection = [];
      console.log(
        `cleared capturedSeedsInOneDirection > ${capturedSeedsInOneDirection}`
      );
      direction++;
      recursiveCheckMove(direction, moveY, moveX);
    } else if (
      board[y][x] === self &&
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
  return [isLegalMove, seedsToFlip];
}

function flipSeeds(seedsToFlip, currPlayer, board) {
  for (let [posY, posX] of seedsToFlip) {
    board[posY][posX] = currPlayer;
  }
  updateBoardDisplay(board);
  return board;
}

function changePlayer(currPlayer) {
  if (currPlayer === 1) {
    currPlayer = 0;
    currPlayerDisplay.innerText = "Current Player: User (0)";
  } else {
    currPlayer = 1;
    currPlayerDisplay.innerText = "Current Player: Computer (1)";
  }
  return currPlayer;
}
