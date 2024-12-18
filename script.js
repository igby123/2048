const board = document.getElementById("board");
const size = 4;
let grid = Array(size).fill().map(() => Array(size).fill(0));

// Initialize the game
function initializeGame() {
    addNewTile();
    addNewTile();
    renderBoard();
}

// Add a new random tile (2 or 4)
function addNewTile() {
    let emptyTiles = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === 0) emptyTiles.push([r, c]);
        }
    }
    if (emptyTiles.length > 0) {
        const [r, c] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Render the game board
function renderBoard() {
    board.innerHTML = "";
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            if (grid[r][c] > 0) {
                tile.textContent = grid[r][c];
                tile.setAttribute("data-value", grid[r][c]);
            }
            board.appendChild(tile);
        }
    }
}

// Move and merge tiles
function move(direction) {
    let moved = false;

    for (let i = 0; i < size; i++) {
        let row = grid[i];
        if (direction === "up" || direction === "down") row = grid.map(r => r[i]);
        if (direction === "down" || direction === "right") row.reverse();

        let newRow = row.filter(val => val !== 0);
        for (let j = 0; j < newRow.length - 1; j++) {
            if (newRow[j] === newRow[j + 1]) {
                newRow[j] *= 2;
                newRow.splice(j + 1, 1);
                newRow.push(0);
            }
        }
        while (newRow.length < size) newRow.push(0);

        if (direction === "down" || direction === "right") newRow.reverse();
        if (direction === "up" || direction === "down") {
            for (let j = 0; j < size; j++) {
                if (grid[j][i] !== newRow[j]) moved = true;
                grid[j][i] = newRow[j];
            }
        } else {
            if (grid[i].toString() !== newRow.toString()) moved = true;
            grid[i] = newRow;
        }
    }
    if (moved) {
        addNewTile();
        renderBoard();
        if (isGameOver()) alert("Game Over! Refresh to play again.");
    }
}

// Check if game is over
function isGameOver() {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === 0) return false;
            if (c < size - 1 && grid[r][c] === grid[r][c + 1]) return false;
            if (r < size - 1 && grid[r][c] === grid[r + 1][c]) return false;
        }
    }
    return true;
}

// Listen for arrow key presses
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") move("up");
    else if (e.key === "ArrowDown") move("down");
    else if (e.key === "ArrowLeft") move("left");
    else if (e.key === "ArrowRight") move("right");
});

// Start the game
initializeGame();
