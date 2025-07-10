let [board, currPlayer] = setUpBoard(10);

allCells = document.querySelector("#game");
allCells.addEventListener("click", (event) => {
  if (event.target.getAttribute("class") === "dt") {
    const x = parseInt(event.target.getAttribute("x"));
    const y = parseInt(event.target.getAttribute("y"));
    [board, currPlayer] = placeSeed(y, x, currPlayer);
  }
});
// updateBoardDisplay(board);

// checkEligibleMoves(2, 0, (self = 1), (opponent = 0), board);
resetButton = document.querySelector("button");
resetButton.addEventListener("click", (target) => {
  [board, currPlayer] = resetGame(board);
});
