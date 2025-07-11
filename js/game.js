/* -------------------------------------- Constants -------------------------------------- */

/* -------------------------------------- Variables -------------------------------------- */
let boardLength;
/* ------------------------------ Cached Reference Elements ------------------------------ */
const game = document.querySelector("#game");
const currPlayerDisplay = document.querySelector("h2");

/* -------------------------------------- Functions -------------------------------------- */

function setUpBoard(size) {
  /**
   * Initialise a new board
   * @return array representing the board
   * Assume 0 is black, 1 is white, and null is empty
   */
  console.log(`setUpBoard is running`);
  boardLength = size;
  let board = [];
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
  board[5][6] = 0;
  board[5][5] = board[6][5] = board[3][2] = 0;
  board[5][2] = board[4][3] = board[4][1] = 0;
  board[2][2] = board[6][2] = board[4][0] = 1;

  // TODO: Display board on screen
  // updateBoardDisplay(board);
  return [board, 0];
}

function resetGame(board) {
  /**
   * Resets the game and return a new board
   * @return array representing the board
   */
  delete board;
  return setUpBoard(boardLength);
}

function updateBoardDisplay(board) {
  const oldBoard = document.querySelectorAll(".row");
  oldBoard.forEach((row) => row.remove());

  // Create board HTML elements - Create a row with 8 sqr
  row = document.createElement("div");
  row.setAttribute("class", "row");
  row.setAttribute("id", "board-row");
  dt = document.createElement("div");
  dt.setAttribute("id", "dt");
  for (let i = 0; i < boardLength; i++) {
    const newSqrNode = dt.cloneNode(true);
    newSqrNode.setAttribute("x", i);
    row.appendChild(newSqrNode);
    console.log("Row with 8 sqr is generating");
  }

  // Create board HTML elements - Duplicate to 8 rows
  for (let i = 0; i < boardLength; i++) {
    const newNode = row.cloneNode(true);
    newNode.setAttribute("y", i);
    newNodeChildren = newNode.querySelectorAll(".dt");
    newNodeChildren.forEach((nodeChild) => nodeChild.setAttribute("y", i));
    game.appendChild(newNode);
  }
  console.log(game);

  // Update elements with data
  boardElements = document.querySelectorAll("#board-row");
  boardElements.forEach((row, y) => {
    let eachRow = row.querySelectorAll(".dt");
    eachRow.forEach((data, x) => {
      if (board[y][x] === null) {
        console.log(`${data}: Running null attachment to display`);
        data.innerText = "_";
      } else if (board[y][x] === 0) {
        console.log(`${data}: Running 0 attachment to display`);
        data.innerText = 0;
      } else if (board[y][x] === 1) {
        console.log(`${data}: Running 1 attachment to display`);
        data.innerText = 1;
      }
    });
  });
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
