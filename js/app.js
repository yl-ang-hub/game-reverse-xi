/* -------------------------------------- Constants -------------------------------------- */

/* -------------------------------------- Variables -------------------------------------- */
let board, boardLength, currPlayer, isPrevMoveLegal;
let formElements;
let p1Name;

/* ------------------------------ Cached Reference Elements ------------------------------ */
const nav = document.querySelector("#nav");
const newGameDialog = document.querySelector("#new-game-dialog");
const closeNewGameDialog = document.querySelector("#close-game-dialog");
const rulesDialog = document.querySelector("#rules-dialog");
const closeRulesBtn = document.querySelector("#close-rules-dialog");
const newGameForm = document.getElementById("new-game-form");

const landingPage = document.querySelector("#landing-page");
const mainGameWindow = document.querySelector("#main");

const game = document.querySelector("#game");
const currPlayerDisplay = document.querySelector("h2");
const messageBox = document.querySelector("#messagebox");
const whitePlayerDisplay = document.querySelector("#white-move-msg");
const blackPlayerDisplay = document.querySelector("#black-move-msg");

// const resetButton = document.querySelector("#reset");

/* -------------------------------------- Functions -------------------------------------- */

function init(name, size, mode, difficulty) {
  p1Name = name;
  console.log(p1Name);
  setUpBoard(size);
  // TODO: Do something with mode
  // TODO: Trigger computer player based on difficulty chose

  landingPage.classList.add("d-lg-none");
  mainGameWindow.classList.remove("d-lg-none");
}

function setUpBoard(size) {
  /**
   * Initialise a new board
   * @return array representing the board (likely required for game reset)
   * Assume 0 is black, 1 is white, and null is empty
   * Coordinates for board is board[posY][posX]
   */
  console.log(`setUpBoard is running`);
  boardLength = size;
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

  currPlayer = 0;
  updateBoardDisplay();
  updatePlayerDisplay();
  updateMessageDisplay("It's your turn!");
}

function resetGame() {
  /**
   * Resets the game and return a new board
   * @return array representing the board
   */
  board = [];
  return setUpBoard(boardLength);
}

function updateBoardDisplay() {
  const oldBoard = document.querySelectorAll("#board-row");
  oldBoard.forEach((row) => row.remove());

  // Create board HTML elements - Create a row with 8 sqr
  row = document.createElement("div");
  row.setAttribute("class", "row");
  row.setAttribute("id", "board-row");
  dt = document.createElement("div");
  dt.setAttribute("class", "col solid-black board-square");
  dt.setAttribute("id", "dt");
  seed = document.createElement("div");
  seed.setAttribute("class", "row no-seed");
  seed.setAttribute("id", "seed");
  dt.appendChild(seed);
  for (let i = 0; i < boardLength; i++) {
    const newSqrNode = dt.cloneNode(true);
    newSqrNode.setAttribute("x", i);
    newSqrNode.querySelector("#seed").setAttribute("x", i);
    row.appendChild(newSqrNode);
    // console.log(newSqrNode);
    // console.log("Row with 8 sqr is generating");
  }

  // Create board HTML elements - Duplicate to 8 rows
  for (let i = 0; i < boardLength; i++) {
    const newNode = row.cloneNode(true);
    newNode.setAttribute("y", i);
    newNode
      .querySelectorAll("#dt")
      .forEach((nodeChild) => nodeChild.setAttribute("y", i));
    newNode
      .querySelectorAll("#seed")
      .forEach((seedNode) => seedNode.setAttribute("y", i));
    game.appendChild(newNode);
  }
  // console.log(game);

  // Update elements with data
  boardElements = document.querySelectorAll("#board-row");
  boardElements.forEach((row, y) => {
    let eachRow = row.querySelectorAll("#dt");
    eachRow.forEach((data, x) => {
      const seedNode = data.querySelector("div");
      if (board[y][x] === null) {
        // console.log(`${data}: Running null attachment to display`);
        seedNode.setAttribute("class", "row no-seed");
      } else if (board[y][x] === 0) {
        // console.log(`${data}: Running 0 attachment to display`);
        seedNode.setAttribute("class", "row black-seed");
      } else if (board[y][x] === 1) {
        // console.log(`${data}: Running 1 attachment to display`);
        seedNode.setAttribute("class", "row white-seed");
      }
    });
  });
}

function updateMessageDisplay(message = "", isLegalMove) {
  // Message for illegal move
  if (
    isLegalMove === false &&
    (isPrevMoveLegal === "" || isPrevMoveLegal === false)
  ) {
    message = "Your selected move is also not allowed. Try another square!";
  } else if (isLegalMove === false) {
    message = "Sorry, your move is illegal. Try again.";
  }
  isPrevMoveLegal = isLegalMove;

  // TODO: Message for legal move & change of player

  // Update message on screen
  messageBox.innerText = message;
}

function updatePlayerDisplay() {
  if (currPlayer) {
    blackPlayerDisplay.innerText = "";
    whitePlayerDisplay.innerText = "White's turn!";
  } else {
    whitePlayerDisplay.innerText = "";
    blackPlayerDisplay.innerText = "Black's turn!";
  }
}

/* ----------------------------------- Event Listeners ----------------------------------- */
newGameForm.addEventListener("submit", (event) => {
  const input = [];
  fields = newGameForm.elements;
  for (field of fields) {
    if (field.name && field.type !== "submit") {
      input.push(field.value);
    }
  }
  init(...input);
  event.preventDefault();
});

game.addEventListener("click", (event) => {
  // console.log(`board click is logged`);
  const x = parseInt(event.target.getAttribute("x"));
  const y = parseInt(event.target.getAttribute("y"));
  placeSeed(y, x);
});

nav.addEventListener("click", (event) => {
  if (event.target.innerText === "New Game") {
    newGameDialog.showModal();
  } else if (event.target.innerText === "Rules") {
    rulesDialog.showModal();
  }
});

closeNewGameDialog.addEventListener("click", (event) => {
  newGameDialog.close();
});

closeRulesBtn.addEventListener("click", (event) => {
  rulesDialog.close();
  // console.log(closeRulesBtn, rulesDialog);
});

// resetButton.addEventListener("click", (target) => {
//   [board, currPlayer] = resetGame(board);
// });

/* ---------------------------------------- Game ----------------------------------------- */
