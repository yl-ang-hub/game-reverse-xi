/* -------------------------------------- Constants -------------------------------------- */
/* -------------------------------------- Variables -------------------------------------- */
let [board, currPlayer] = setUpBoard(10);
// const resetButton = document.querySelector("#reset");

/* ------------------------------ Cached Reference Elements ------------------------------ */
const nav = document.querySelector("#title");
const newGameMenu = document.querySelector("#new-game-menu");

/* -------------------------------------- Functions -------------------------------------- */
/* ----------------------------------- Event Listeners ----------------------------------- */
game.addEventListener("click", (event) => {
  if (event.target.getAttribute("id") === "dt") {
    console.log(`board click is logged`);
    const x = parseInt(event.target.getAttribute("x"));
    const y = parseInt(event.target.getAttribute("y"));
    [board, currPlayer] = placeSeed(y, x, currPlayer);
  }
});
// updateBoardDisplay(board);

nav.addEventListener("click", (event) => {
  console.log(`event is running`);
  if (event.target.innerText === "New Game") {
    console.log(newGameMenu.style.display);
    newGameMenu.style.display === "block"
      ? (newGameMenu.style.display = "none")
      : (newGameMenu.style.display = "block");
  }
});

// resetButton.addEventListener("click", (target) => {
//   [board, currPlayer] = resetGame(board);
// });
