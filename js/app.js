/* -------------------------------------- Constants -------------------------------------- */

/* -------------------------------------- Variables -------------------------------------- */
let board, boardLength, currPlayer, gameMode, gameDifficulty;
let isPrevMoveLegal;
let p1Name,
  p2Name = "Computer";

/* ------------------------------ Cached Reference Elements ------------------------------ */
const nav = document.querySelector("#nav");
const newGameBtn = document.querySelector("#new-game-btn");
const rulesBtn = document.querySelector("#rules-btn");
const newGameDialog = document.querySelector("#new-game-dialog");
const closeNewGameDialog = document.querySelector("#close-game-dialog");
const rulesDialog = document.querySelector("#rules-dialog");
const closeRulesBtn = document.querySelector("#close-rules-dialog");
const newGameForm = document.getElementById("new-game-form");
const restartGameBtn = document.querySelector("#restart-game");

const introPage = document.querySelector("#intro");
const landingPage = document.querySelector("#landing-page");
const mainInfo = document.querySelector("#main-info");
const mainGameWindow = document.querySelector("#main");
const startBtn = document.querySelector("#start-btn");

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
  /**
   * @description Get the new game settings from user, re-initialised all variables and invoked functions to reset all the displays on screen.
   */
  resetGame();
  p1Name = name;
  gameMode = mode;
  gameDifficulty = difficulty;

  mainInfo.innerText = `${gameMode} Mode (${gameDifficulty})`;

  landingPage.classList.add("d-none");
  mainInfo.classList.remove("d-none");
  mainGameWindow.classList.remove("d-none");

  if (parseInt(size) === 10) game.style.width = "540px";
  if (parseInt(size) === 12) game.style.width = "640px";

  setUpBoard(size);
  generateBoardDisplay();
  enableBoardInteraction();
  updatePlayerDisplay();
  updateMessageDisplay("It's your turn!");
  updateSeedCountDisplay(countSeeds());
  animateSeedCounter();
}

function resetGame() {
  /**
   * @description Resets the game, and clear the variables
   * @return {<Array<Array<number>>>} representing the board
   */
  board = [];
  turnCount = 0;
  disableBoardInteraction();
}

function generateBoardDisplay() {
  /**
   * @description Clear and re-generate the board display on screen
   */
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

  // Update elements with data
  const boardElements = document.querySelectorAll("#board-row");
  boardElements.forEach((row, y) => {
    let eachRow = row.querySelectorAll("#sqr");
    eachRow.forEach((data, x) => {
      const seedNode = data.querySelector("div");
      if (board[y][x] === null) {
        seedNode.setAttribute("class", "row no-seed");
      } else if (board[y][x] === 0) {
        seedNode.setAttribute("class", "row black-seed");
      } else if (board[y][x] === 1) {
        seedNode.setAttribute("class", "row white-seed");
      }
    });
  });
}

function updateBoardDisplay(capturedSeeds, player) {
  /**
   * @description Flip the captured seeds on screen
   */
  const changeToColor = player ? "row white-seed" : "row black-seed";
  const boardSeeds = document.querySelectorAll("#seed");
  capturedSeeds.forEach(([seedY, seedX]) => {
    boardSeeds.forEach((seed) => {
      const y = seed.getAttribute("y"),
        x = seed.getAttribute("x");
      if (y == seedY && x == seedX) {
        seed.setAttribute("class", changeToColor);
      }
    });
  });
}

function highlightRandSquareToFlip(posY, posX) {
  /**
   * @description In crazy mode, highlight the squares where the randomly selected seeds will be flipped
   */
  const boardSqr = document.querySelectorAll("#sqr");
  boardSqr.forEach((sqr) => {
    const y = sqr.getAttribute("y"),
      x = sqr.getAttribute("x");
    if (y == posY && x == posX) {
      sqr.classList.remove("border-dark");
      sqr.classList.add("border-danger");
      sqr.classList.add("border-2");
      setTimeout(() => {
        sqr.classList.add("border-dark");
        sqr.classList.remove("border-danger");
        sqr.classList.remove("border-2");
      }, 3000);
    }
  });
}

function updateSeedCountDisplay(seedsCounter) {
  blackSeedCount.innerText = seedsCounter["black"];
  whiteSeedCount.innerText = seedsCounter["white"];
}

function animateSeedCounter(animate = true) {
  /**
   * @description Animate seed counter to show who is current player
   * @param {boolean} animate - Set to false if both players are not playing (for crazy mode)
   */
  if (!animate) {
    blackSeedCounter.setAttribute("style", "background-color: #757575ff");
    whiteSeedCounter.setAttribute("style", "background-color: #757575ff");
    return;
  }
  if (currPlayer) {
    whiteSeedCounter.setAttribute("style", "background-color: #7d2b2b");
    blackSeedCounter.setAttribute("style", "background-color: #757575ff");
  } else {
    blackSeedCounter.setAttribute("style", "background-color: #7d2b2b");
    whiteSeedCounter.setAttribute("style", "background-color: #757575ff");
  }
}

function updateMessageDisplay(message = "", isLegalMove) {
  /**
   * @description Update the message display on screen and handle message generation for illegal moves.
   */
  if (
    isLegalMove === false &&
    (isPrevMoveLegal === "" || isPrevMoveLegal === false)
  ) {
    message = "Your selected move is also not allowed. Try another square!";
  } else if (isLegalMove === false) {
    message = "Sorry, your move is illegal. Try again.";
  }
  isPrevMoveLegal = isLegalMove;
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

function clearPlayerDisplay() {
  blackPlayerDisplay.innerText = "";
  whitePlayerDisplay.innerText = "";
}

function endGameSequence() {
  /**
   * @description Handles the message display for endgame, invokes function to determine the winner and disable player interaction with the board
   */
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
  updateMessageDisplay(message);
  animateSeedCounter(false);
  disableBoardInteraction();
}

function eventPlaceSeed(event) {
  /**
   * @description Callback function to take player's move and invokes function to assess move and run the game
   */
  const x = parseInt(event.target.getAttribute("x"));
  const y = parseInt(event.target.getAttribute("y"));
  runGame(y, x);
}

/* ----------------------------------- Event Listeners ----------------------------------- */
newGameForm.addEventListener("submit", (event) => {
  const input = [];
  fields = newGameForm.elements;
  for (field of fields) {
    if (field.name && field.type !== "submit" && field.type !== "radio") {
      input.push(field.value);
    } else if (field.name && field.type === "radio" && field.checked) {
      input.push(field.value);
    }
  }
  newGameBtn.classList.remove("d-none");
  init(...input);
  event.preventDefault();
});

newGameBtn.addEventListener("click", (event) => {
  newGameDialog.showModal();
});

rulesBtn.addEventListener("click", (event) => {
  rulesDialog.showModal();
});

closeNewGameDialog.addEventListener("click", () => {
  newGameDialog.close();
});

closeRulesBtn.addEventListener("click", () => {
  rulesDialog.close();
});

restartGameBtn.addEventListener("click", () => {
  newGameDialog.close();
  landingPage.classList.remove("d-none");
  newGameBtn.classList.add("d-none");
  mainInfo.classList.add("d-none");
  mainGameWindow.classList.add("d-none");
});

startBtn.addEventListener("click", (event) => {
  introPage.classList.add("d-none");
  landingPage.classList.remove("d-none");
  rulesBtn.classList.remove("d-none");
  event.preventDefault();
});

function enableBoardInteraction() {
  /**
   * @description Enables player to place seed on the board
   */
  game.addEventListener("click", eventPlaceSeed);
}

function disableBoardInteraction() {
  /**
   * Disable player's interaction with board
   */
  game.removeEventListener("click", eventPlaceSeed);
}

/* ---------------------------------------- Game ----------------------------------------- */
