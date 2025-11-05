const canvas = document.getElementById('gameOfLifeCanvas');
const ctx = canvas.getContext('2d');

// define parameters
const CELL_SIZE = 40; // px
const UPDATE_FREQ = 3; // seconds
const DEAD_COLOUR = [18, 63, 90];
const ALIVE_COLOUR = [35, 93, 114];
const FPS = 30; // rate at which to update colour gradients

// declare the game board
var board;
var prevBoard; // used for colour gradients

// for timing gradient transitions
var lastT = 0;

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
}

/**
 * Initialises the board array with a starting seed.
 * @param {Number} columns The number of columns in the board
 * @param {Number} rows The number of rows in the board
 */
function initBoard(columns, rows) {
    // board has not been initialised, need to create it
    board = [];
    prevBoard = [];
    for (let y = 0; y < rows; y++) {
        board[y] = [];
        prevBoard[y] = [];
        for (let x = 0; x < columns; x++) {
            board[y][x] = Math.round(Math.random());
            prevBoard[y][x] = 0;
        }
    }
}

/**
 * Resizes the board, keeping the existing board state.
 * @param {Number} columns The number of columns in the new board
 * @param {Number} rows The number of rows in the new board
 */
function resizeBoard(columns, rows) {
    let newBoard = [];
    let newPrevBoard = [];
    for (let y = 0; y < rows; y++) {
        newBoard[y] = [];
        newPrevBoard[y] = [];
        for (let x = 0; x < columns; x++) {
            if (y < board.length && x < board[y].length) {
                newBoard[y][x] = board[y][x];
                newPrevBoard[y][x] = prevBoard[y][x];
            } else {
                newBoard[y][x] = Math.round(Math.random());
                newPrevBoard[y][x] = 0; // dead
            }
        }
    }

    board = newBoard;
    prevBoard = newPrevBoard;
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

    // save previous board state
    let tempPrevBoard = [];
    for (let y = 0; y < board.length; y++) {
        tempPrevBoard[y] = board[y].slice();
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

    board = newBoard;
    prevBoard = tempPrevBoard;
}

/**
 * Helper function for updateBoard.
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
    const padding = 2; // padding around tiles (px)

    // get the current time of the rendering step and calculate completion extent
    const d = new Date();
    const t = d.getTime() % (UPDATE_FREQ * 1000);
    const progress = Math.min(t / (UPDATE_FREQ * 1000), 1);
    
    // check whether update is needed
    if (t < lastT) {
        updateBoard();
    }
    lastT = t;

    // check if board has been initialised
    if (typeof board !== 'undefined') {
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // draw background
        ctx.fillStyle = "rgb(" + DEAD_COLOUR[0] + ", " + DEAD_COLOUR[1] + ", " + DEAD_COLOUR[2] + ")";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                if (prevBoard[y][x] == 1 || board[y][x] == 1) { // optimisation - prevent drawing unnecessary cells
                    // define fill style
                    if (board[y][x] != prevBoard[y][x]) {
                        // get difference between colours
                        // multiply by temporal difference in cell state; invert difference if transitioning from alive to dead
                        let gradientColour = ALIVE_COLOUR.map(
                            (element, index) => (element - DEAD_COLOUR[index]) * (board[y][x] - prevBoard[y][x])
                        );

                        // interpolate between colours
                        baseColour = prevBoard[y][x] == 1 ? ALIVE_COLOUR : DEAD_COLOUR;
                        gradientColour = gradientColour.map((element, index) => element * progress + baseColour[index]);

                        // set fill style
                        ctx.fillStyle = "rgb(" + gradientColour[0] + ", " + gradientColour[1] + ", " + gradientColour[2] + ")";
                    } else {
                        ctx.fillStyle = "rgb(" + ALIVE_COLOUR[0] + ", " + ALIVE_COLOUR[1] + ", " + ALIVE_COLOUR[2] + ")";
                    }

                    ctx.beginPath();
                    ctx.roundRect(x*CELL_SIZE - padding, y*CELL_SIZE - padding, CELL_SIZE - 2*padding, CELL_SIZE - 2*padding, 8);
                    ctx.fill();
                }
            }
        }
    }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);
setInterval(renderBoard, 1000 / FPS);