function checkEligibleMoves(currY, currX, self, board, checkMove = false) {
  /**
   * @return [isEligible: boolean, seedsToFlip: arrayOf[posY, posX]
   */
  // Loop all possible directions
  //   check any eligible move for selected direction
  //   break if there is an eligible move and checkMove is set to true
  let seedsToFlip = [];
  let isEligible = false;
  let temp = [];
  let foundSelf = false;
  let foundOpponent = false;
  let opponent = 1;
  if (self) {
    opponent = 0;
  }

  // Repeat this function below for each direction
  const addAndResetCounters = () => {
    if (foundOpponent && foundSelf && checkMove) {
      return [true, temp];
    } else if (foundOpponent && foundSelf) {
      foundSelf = foundOpponent = false;
      temp.forEach((coord) => seedsToFlip.push(coord));
    }
    temp = [];
  };

  // Direction: UP
  for (y = currY - 1; y >= 0; y--) {
    curr = board[y][currX];
    if (curr === opponent) {
      temp.push([y, currX]);
      foundOpponent = true;
    } else if (curr === self) {
      foundSelf = true;
      break;
    } else if (curr === null) {
      break;
    }
  }
  addAndResetCounters();

  // Direction: RIGHT
  for (x = currX + 1; x <= board.length; x++) {
    curr = board[currY][x];
    if (curr === opponent) {
      temp.push([currY, x]);
      foundOpponent = true;
    } else if (curr === self) {
      foundSelf = true;
      break;
    } else if (curr === null) {
      break;
    }
  }
  addAndResetCounters();

  // Direction: DOWN
  for (y = currY + 1; y <= board.length; y++) {
    curr = board[y][currX];
    if (curr === opponent) {
      temp.push([y, currX]);
      foundOpponent = true;
    } else if (curr === self) {
      foundSelf = true;
      break;
    } else if (curr === null) {
      break;
    }
  }
  addAndResetCounters();

  // Direction: LEFT
  for (x = currX - 1; x >= 0; x--) {
    curr = board[currY][x];
    if (curr === opponent) {
      temp.push([currY, x]);
      foundOpponent = true;
    } else if (curr === self) {
      foundSelf = true;
      break;
    } else if (curr === null) {
      break;
    }
  }
  addAndResetCounters();

  // TODO: Direction: DIAGONAL TOP LEFT

  console.log(temp);
  console.log(seedsToFlip);

  seedsToFlip ? (isEligible = true) : (isEligible = false);
  console.log(isEligible);
  console.log(seedsToFlip);
  return [isEligible, seedsToFlip];
}

function hasAvailableMove(board) {
  /**
   * @return boolean
   */
  // Loop all possible free spaces to put seed
  //   checkEligibleMove(pos, board, checkMove = true) for selected direction
  //   if yes, return true
}

function flipSeeds(seedsToFlip, currPlayer, board) {
  for (let [posY, posX] of seedsToFlip) {
    board[posY][posX] = currPlayer;
  }
  updateBoardDisplay(board);
  return board;
}

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

  board[y][x] = currPlayer;
  const [isEligible, seedsToFlip] = checkEligibleMoves(y, x, currPlayer, board);
  if (isEligible) {
    board = flipSeeds(seedsToFlip, currPlayer, board);
  }
  currPlayer = changePlayer(currPlayer);
  return [board, currPlayer];
}
