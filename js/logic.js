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

  const [isLegalMove, seedsToFlip] = checkMove(1, y, x, true);

  // TODO: remove isLegalMove if checkMove not to be used for checking availableMoves
  if (isLegalMove) {
    board[y][x] = currPlayer;
    board = flipSeeds(seedsToFlip, currPlayer, board);
    changePlayer();
  } else {
    updateMessageDisplay("", isLegalMove);
  }
  return;
}

function checkMove(direction, y, x, getAllCapturedSeeds = false) {
  /**
   * Wrapper for recursive function
   */
  const moveY = y,
    moveX = x,
    opponent = currPlayer ? 0 : 1;
  let seedsToFlip = [],
    capturedSeedsInOneDirection = [],
    isLegalMove = false;

  function recursiveCheckMove(direction, y, x) {
    /**
     * Updates capturedSeeds
     */
    console.log(`moveY and moveX is ${moveY} and ${moveX}`);
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
      // check if x or y hits 7
    }
    if (direction === 9) {
      console.log("breaking as direction >= 9");
      return;
    }
    if (y === -1 || x === -1 || y === boardLength || x === boardLength) {
      console.log("breaking as y or x >= boardlength");
      capturedSeedsInOneDirection = [];
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
      board[y][x] === currPlayer &&
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
      board[y][x] === currPlayer &&
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

function changePlayer() {
  currPlayer ? (currPlayer = 0) : (currPlayer = 1);
  if (currPlayer) {
    updateMessageDisplay("Computer is playing.");
  } else {
    updateMessageDisplay("It's your turn!");
  }
  updatePlayerDisplay(currPlayer);
}
