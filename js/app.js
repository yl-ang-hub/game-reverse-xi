/* -------------------------------------- Constants -------------------------------------- */
/* -------------------------------------- Variables -------------------------------------- */
let [board, currPlayer] = setUpBoard(10);
// const resetButton = document.querySelector("#reset");

/* ------------------------------ Cached Reference Elements ------------------------------ */
/* -------------------------------------- Functions -------------------------------------- */
/* ----------------------------------- Event Listeners ----------------------------------- */
game.addEventListener("click", (event) => {
  if (event.target.getAttribute("class") === "dt") {
    const x = parseInt(event.target.getAttribute("x"));
    const y = parseInt(event.target.getAttribute("y"));
    [board, currPlayer] = placeSeed(y, x, currPlayer);
  }
});
// updateBoardDisplay(board);

// resetButton.addEventListener("click", (target) => {
//   [board, currPlayer] = resetGame(board);
// });
