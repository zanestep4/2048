"use strict";

var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // Sets div id to the tile number
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}

function toggleView() {
    let gameView = qs("#game-view");
    let gameOver = qs("#game-over");

    gameView.classList.toggle("hidden");
    gameOver.classList.toggle("hidden");
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return
    }

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("t2");
            found = true;
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; // Clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("t"+num.toString());
        } else {
            tile.classList.add("t8192")
        }
    }
}

let toggleViewCalled = false;

document.addEventListener("keyup", (e) => {
    if (!toggleViewCalled) {
        let moved = false;
        if (e.code == "ArrowLeft") {
            moved = slideLeft();
        } else if (e.code == "ArrowRight") {
            moved = slideRight();
        } else if (e.code == "ArrowUp") {
            moved = slideUp();
        } else if (e.code == "ArrowDown") {
            moved = slideDown();
        }

        if (moved) {
            setTwo();
        } else {
            if (!movesAvailable()) {
                toggleView();
                toggleViewCalled = true;
                
            }
        }

        document.getElementById("score").innerText = score;
        }
});

function movesAvailable() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
            if (c !== columns - 1 && board[r][c] === board[r][c + 1]) {
                return true;
            }
            if (r !== rows - 1 && board[r][c] === board[r + 1][c]) {
                return true;
            }
        }
    }
    return false;
}

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    // get rid of zeros
    row = filterZero(row);

    // slide
    for (let i = 0; i < row.length-1; i++) {
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);

    // add back zeros
    while (row.length < columns) {
        row.push(0);
    }

    return row;
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = row.slice();
        row = slide(row);
        board[r] = row;

        // Check if the row changed after sliding
        if (!arraysEqual(row, originalRow)) {
            moved = true;
        }

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = row.slice();
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        // Check if the row changed after sliding
        if (!arraysEqual(row, originalRow)) {
            moved = true;
        }

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalRow = row.slice();
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];

        // Check if the row changed after sliding
        if (!arraysEqual(row, originalRow)) {
            moved = true;
        }

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalRow = row.slice();
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];

        // Check if the row changed after sliding
        if (!arraysEqual(row, originalRow)) {
            moved = true;
        }

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

/////////////////////////////////////////////////////////////////////
// Helper functions
function qs(selector) {
    return document.querySelector(selector);
}

