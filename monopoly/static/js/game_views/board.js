"use strict";

class Board {

    constructor() {
        this.initBoard();
    }

    initBoard() {
        this.board = [];
        for (let row = 0; row < Board.SIZE; row++) {
            row = [];
            for (let col = 0; col < Board.SIZE; col++) {
                row.push({
                    player: null,
                    owner: null,
                    properties: []
                })
            }
            this.board.push(row);
        }
    }

    static indexToLoc(index) {
        if (index < 10) {
            return [10, 10 - index];
        } else if (index < 20) {
            return [20 - index, 0];
        } else if (index < 30) {
            return [0, index - 20];
        } else {
            return [index - 30, 10];
        }
    }

    static locToIndex(row, col) {
        if (row === 0) {
            return 20 + col;
        } else if (row === 10) {
            return 10 - col;
        } else if (col === 0) {
            return 20 - row;
        } else if (col === 10) {
            return 30 + row;
        } else {
            return -1;
        }
    }
}

Board.SIZE = 11;