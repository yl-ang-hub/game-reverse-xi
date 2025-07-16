/* -------------------------------------- Constants -------------------------------------- */

/* -------------------------------------- Variables -------------------------------------- */
let board, boardLength, currPlayer, gameMode, gameDifficulty;
let isPrevMoveLegal;
let p1Name,
  p2Name = "Computer";

/* ------------------------------ Cached Reference Elements ------------------------------ */
const nav = document.querySelector("#nav");
const newGameDialog = document.querySelector("#new-game-dialog");
const closeNewGameDialog = document.querySelector("#close-game-dialog");
const rulesDialog = document.querySelector("#rules-dialog");
const closeRulesBtn = document.querySelector("#close-rules-dialog");
const newGameForm = document.getElementById("new-game-form");
const newGameBtn = document.querySelector("#restart-game");

const landingPage = document.querySelector("#landing-page");
const mainInfo = document.querySelector("#main-info");
const mainGameWindow = document.querySelector("#main");

const blackSeedCounter = document.querySelector("#black-seed-counter");
const whiteSeedCounter = document.querySelector("#white-seed-counter");
const blackSeedCount = document.querySelector("#black-seed-count");
const whiteSeedCount = document.querySelector("#white-seed-count");

const game = document.querySelector("#game");
const currPlayerDisplay = document.querySelector("h2");
const messageBox = document.querySelector("#messagebox");
const whitePlayerDisplay = document.querySelector("#white-move-msg");
const blackPlayerDisplay = document.querySelector("#black-move-msg");

/* -------------------------------------- Functions -------------------------------------- */

function init(name, size, mode, difficulty) {
  p1Name = name;
  gameMode = mode;
  gameDifficulty = difficulty;
  // TODO: Do something with mode

  mainInfo.innerText = `${gameMode} Mode (${gameDifficulty})`;

  landingPage.classList.add("d-lg-none");
  mainInfo.classList.remove("d-lg-none");
  mainGameWindow.classList.remove("d-lg-none");

  setUpBoard(size);
  updateBoardDisplay();
  enableBoardInteraction();
  updatePlayerDisplay();
  updateMessageDisplay("It's your turn!");
  updateSeedCountDisplay(countSeeds());
  animateSeedCounter();
}

function resetGame() {
  /**
   * Resets the game and return a new board
   * @return array representing the board
   */
  board = [];
  disableBoardInteraction();
  updateMessageDisplay("");
  updatePlayerDisplay("");
  updateSeedCountDisplay({ black: 0, white: 0 });
}

function updateBoardDisplay() {
  const oldBoard = document.querySelectorAll("#board-row");
  oldBoard.forEach((row) => row.remove());

  // Create board HTML elements - Create a row with 8 sqr
  row = document.createElement("div");
  row.setAttribute("class", "row");
  row.setAttribute("id", "board-row");
  sqr = document.createElement("div");
  sqr.setAttribute("class", "ratio ratio-1x1 border border-dark board-square");
  sqr.setAttribute("id", "sqr");
  seed = document.createElement("div");
  seed.setAttribute("class", "row no-seed");
  seed.setAttribute("id", "seed");
  sqr.appendChild(seed);
  for (let i = 0; i < boardLength; i++) {
    const newSqrNode = sqr.cloneNode(true);
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
      .querySelectorAll("#sqr")
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
    let eachRow = row.querySelectorAll("#sqr");
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

function updateSeedCountDisplay(seedsCounter) {
  blackSeedCount.innerText = seedsCounter["black"];
  whiteSeedCount.innerText = seedsCounter["white"];
}

function animateSeedCounter() {
  // TODO: Toggle background between red and grey
  if (currPlayer) {
    whiteSeedCounter.setAttribute("style", "background-color: #7d2b2b");
    blackSeedCounter.setAttribute("style", "background-color: #757575ff");
  } else {
    blackSeedCounter.setAttribute("style", "background-color: #7d2b2b");
    whiteSeedCounter.setAttribute("style", "background-color: #757575ff");
  }
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

  // Update message on screen
  messageBox.innerHTML = message;
}

function updatePlayerDisplay() {
  if (currPlayer) {
    blackPlayerDisplay.innerText = "";
    whitePlayerDisplay.innerText = `${p2Name}'s turn!`;
  } else {
    whitePlayerDisplay.innerText = "";
    blackPlayerDisplay.innerText = `${p1Name}'s turn!`;
  }
}

function endGameSequence() {
  const seedsCounter = countSeeds();
  let message = "";
  if (seedsCounter["black"] === seedsCounter["white"]) {
    message = "The game has ended. You tied!";
  } else if (seedsCounter["black"] > seedsCounter["white"]) {
    message = `The game has ended. <span class="fw-bold text-primary">${p1Name}</span> won!`;
  } else {
    message = `The game has ended. <span class="fw-bold text-primary">${p2Name}</span> won!`;
  }
  message +=
    '<p> Click on "New Game" on the top left corner to play another game!';
  disableBoardInteraction();
  updateMessageDisplay(message);
}

function eventPlaceSeed(event) {
  const x = parseInt(event.target.getAttribute("x"));
  const y = parseInt(event.target.getAttribute("y"));
  runGame(y, x);
}

/* ----------------------------------- Event Listeners ----------------------------------- */
newGameForm.addEventListener("submit", (event) => {
  const input = [];
  fields = newGameForm.elements;
  for (field of fields) {
    console.log(field.checked);
    if (field.name && field.type !== "submit" && field.type !== "radio") {
      input.push(field.value);
    } else if (field.name && field.type === "radio" && field.checked) {
      input.push(field.value);
    }
  }
  init(...input);
  event.preventDefault();
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

newGameBtn.addEventListener("click", (target) => {
  newGameDialog.close();
  landingPage.classList.remove("d-lg-none");
  mainInfo.classList.add("d-lg-none");
  mainGameWindow.classList.add("d-lg-none");
});

function enableBoardInteraction() {
  game.addEventListener("click", eventPlaceSeed);
}

function disableBoardInteraction() {
  game.removeEventListener("click", eventPlaceSeed);
}

/* ---------------------------------------- Game ----------------------------------------- */
