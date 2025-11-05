const canvas = document.getElementById('gameOfLifeCanvas');
const ctx = canvas.getContext('2d');

// define parameters
const CELL_SIZE = 40; // px
const UPDATE_FREQ = 1; // seconds

// declare the game board
var board;

/**
 * Handles canvas resize events (which occur when the webpage is resized).
 */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;

    // recreate the game of life board
    const NUM_COLUMNS = canvas.width / CELL_SIZE;
    const NUM_ROWS = canvas.height / CELL_SIZE;
    if (typeof board == 'undefined') {
        initBoard(NUM_COLUMNS, NUM_ROWS);
    } else {
        resizeBoard(NUM_COLUMNS, NUM_ROWS);
    }
    renderBoard();
}

/**
 * Initialises the board array with a starting seed.
 * @param {Number} columns The number of columns in the board
 * @param {Number} rows The number of rows in the board
 */
function initBoard(columns, rows) {
    // board has not been initialised, need to create it
    board = [];
    for (let y = 0; y < rows; y++) {
        board[y] = [];
        for (let x = 0; x < columns; x++) {
            board[y][x] = 0; // dead
        }
    }

    // create starting pattern
    let seed = [
        [1,1,1,0,1],
        [1,0,0,0,0],
        [0,0,0,1,1],
        [0,1,1,0,1],
        [1,0,1,0,1]
    ]
    // tile the pattern across the entire canvas
    const TILE_X = Math.round(canvas.width / CELL_SIZE / 16)
    const TILE_Y = Math.round(canvas.height / CELL_SIZE / 16)
    for (let ty = 0; ty < TILE_Y; ty++) {
        for (let tx = 0; tx < TILE_X; tx++) {
            let startX = Math.round((columns / (TILE_X + 1)) * (tx+1)) - seed[0].length;
            let startY = Math.round((rows / (TILE_Y + 1)) * (ty+1)) - seed.length;
            for (let y = 0; y < seed.length; y++) {
                for (let x = 0; x < seed[y].length; x++) {
                    board[startY + y][startX + x] = seed[y][x];
                }
            }
        }
    }
}

/**
 * Resizes the board, keeping the existing board state.
 * @param {Number} columns The number of columns in the new board
 * @param {Number} rows The number of rows in the new board
 */
function resizeBoard(columns, rows) {
    let newBoard = []
    for (let y = 0; y < rows; y++) {
        newBoard[y] = []
        for (let x = 0; x < columns; x++) {
            if (y < board.length && x < board[y].length) {
                newBoard[y][x] = board[y][x];
            } else {
                newBoard[y][x] = 0; // dead
            }
        }
    }

    board = newBoard
}

/**
 * Updates and renders game of life board.
 */
function step() {
    updateBoard();
    renderBoard();
}

/**
 * Updates the game of life board state.
 */
function updateBoard() {
    // create a copy of the previous board state
    let newBoard = [];
    for (let y = 0; y < board.length; y++) {
        newBoard[y] = board[y].slice();
    }

    // iterate through the previous board state and update `newBoard`
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            let aliveNeighbours = getAliveNeighbours(x, y);
            if (board[y][x] == 1 && aliveNeighbours < 2) {
                newBoard[y][x] = 0; // dies
            } else if (board[y][x] == 1 && (aliveNeighbours == 2 || aliveNeighbours == 3)) {
                // this is actually redundant
                newBoard[y][x] = 1;
            } else if (board[y][x] == 1 && aliveNeighbours > 3) { 
                newBoard[y][x] = 0; // dies
            } else if (board[y][x] == 0 && aliveNeighbours == 3) { 
                newBoard[y][x] = 1; // reproduction
            }
        }
    }

    board = newBoard
}

/**
 * Helper function of updateBoard.
 * Calculates the number of alive neighbours for a given cell in `board`.
 * @param {Number} cellX The x-value of the cell.
 * @param {Number} cellY The y-value of the cell.
 * @returns {Number} The number of alive neighbours.
 */
function getAliveNeighbours(cellX, cellY) {
    let aliveNeighbours = 0;
    for (const dx of [-1, 0, 1]) {
        for (const dy of [-1, 0, 1]) {
            let x = cellX + dx;
            let y = cellY + dy;

            // range checking
            if (y > 0 && y < board.length && x > 0 && x < board[y].length) {
                // don't allow dx==dy==0
                if (!(dx == 0 && dy == 0)) {
                    // check whether cell is alive
                    if (board[y][x] == 1) {
                        aliveNeighbours++;
                    }
                }
            }
        }
    }

    return aliveNeighbours;
}

/**
 * Renders game of life board on canvas.
 */
function renderBoard() {
    // check if board has been initialised
    if (typeof board !== 'undefined') {
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red"; // TODO: change!

        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                if (board[y][x] == 1) {
                    ctx.fillRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
    }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);
setTimeout(() => setInterval(step, UPDATE_FREQ * 1000), 1000);