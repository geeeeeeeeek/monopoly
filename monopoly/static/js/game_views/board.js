"use strict";

class Board {

    constructor() {
        this.initBoard();
    }

    initBoard() {
        this.board = [];
        for (let row = 0; row < Board.SIZE; row++) {
            let boardRow = [];
            for (let col = 0; col < Board.SIZE; col++) {
                boardRow.push({
                    players: [false, false, false, false],
                    propertyManager: null
                })
            }
            this.board.push(boardRow);
        }
    }

    updateTileInfo(tileId, tileInfo) {
        const pos = Board.tileIdToPos(tileId);
        const {type, action, playerIndex, options} = tileInfo;
        switch (type) {
            case BoardController.MODEL_PLAYER:
                this.board[pos[0]][pos[1]].players[playerIndex] = (action === "add");
                break;
            case BoardController.MODEL_PROPERTY:
                this.board[pos[0]][pos[1]].propertyManager = new PropertyManager(options);
                break;
        }
    }

    getTileInfo(tileId) {
        const pos = Board.tileIdToPos(tileId);
        return this.board[pos[0]][pos[1]];
    }

    static tileIdToPos(tileId) {
        if (tileId < 10) {
            return [10, 10 - tileId];
        } else if (tileId < 20) {
            return [20 - tileId, 0];
        } else if (tileId < 30) {
            return [0, tileId - 20];
        } else {
            return [tileId - 30, 10];
        }
    }

    static posToTileId(row, col) {
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

    static tileIdToSide(tileId) {
        if (tileId < 10) {
            return Board.SIDE_BOTTOM;
        } else if (tileId < 20) {
            return Board.SIDE_LEFT;
        } else if (tileId < 30) {
            return Board.SIDE_TOP;
        } else {
            return Board.SIDE_RIGHT;
        }
    }
}

Board.SIZE = 11;

Board.SIDE_TOP = 2;
Board.SIDE_LEFT = 1;
Board.SIDE_RIGHT = 3;
Board.SIDE_BOTTOM = 0;