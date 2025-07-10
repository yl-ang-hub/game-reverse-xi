function setUpBoard(size) {
  /**
   * Initialise a new board
   * @return array representing the board
   * Assume 0 is black, 1 is white, and null is empty
   */
  let board = [];
  mid1 = size / 2 - 1;
  mid2 = size / 2;
  for (let y = 0; y < size; y++) {
    board[y] = [];
    for (let x = 0; x < size; x++) {
      board[y][x] = null;
      if ((y === mid1 && x === mid1) || (y === mid2 && x === mid2)) {
        board[y][x] = 0;
      } else if ((y === mid1) & (x === mid2) || (y === mid2 && x === mid1)) {
        board[y][x] = 1;
      }
    }
  }
  // Temporary code for debug; note [posY][posX]
  board[5][6] = 0;
  board[5][5] = board[6][5] = board[3][2] = 0;
  board[5][2] = board[4][3] = board[4][1] = 0;
  board[2][2] = board[6][2] = board[4][0] = 1;

  // TODO: Display board on screen
  updateBoardDisplay(board);
  return [board, 0];
}

function resetGame(board) {
  /**
   * Resets the game and return a new board
   * @return array representing the board
   */
  const size = board.length;
  delete board;
  return setUpBoard(size);
}

function updateBoardDisplay(board) {
  const size = board.length;

  const oldBoard = document.querySelectorAll(".row");
  oldBoard.forEach((row) => row.remove());

  // Create board HTML elements
  row = document.createElement("div");
  row.setAttribute("class", "row");
  dt = document.createElement("div");
  dt.setAttribute("class", "dt");
  for (let i = 0; i < size; i++) {
    const newNode = dt.cloneNode(true);
    newNode.setAttribute("x", i);
    row.appendChild(newNode);
  }
  game = document.querySelector(".game");
  for (let i = 0; i < size; i++) {
    const newNode = row.cloneNode(true);
    newNode.setAttribute("y", i);
    newNodeChildren = newNode.querySelectorAll(".dt");
    newNodeChildren.forEach((nodeChild) => nodeChild.setAttribute("y", i));
    game.appendChild(newNode);
  }

  // Update elements with data
  boardElements = document.querySelectorAll(".row");
  boardElements.forEach((row, y) => {
    let eachRow = row.querySelectorAll(".dt");
    eachRow.forEach((data, x) => {
      if (board[y][x] === null) {
        data.innerText = "_";
      } else if (board[y][x] === 0) {
        data.innerText = 0;
      } else if (board[y][x] === 1) {
        data.innerText = 1;
      }
    });
  });
}

function changePlayer(currPlayer) {
  if (currPlayer === 1) {
    currPlayer = 0;
  } else {
    currPlayer = 1;
  }
  currPlayerDisplay = document.querySelector("h2");
  if (currPlayer === 0) {
    currPlayerDisplay.innerText = "Current Player: Computer (0)";
  } else {
    currPlayerDisplay.innerText = "Current Player: User (1)";
  }
  return currPlayer;
}
