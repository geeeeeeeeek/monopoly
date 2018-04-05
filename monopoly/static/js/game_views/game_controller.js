"use strict";

class GameController {

    constructor(options) {
        this.colorTurn = GameController.WHITE;

        this.board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];

        this.boardController = new Board_controller({
            containerEl: options.containerEl,
            assetsUrl: options.assetsUrl,
            callbacks: {
                pieceCanDrop: null,
                pieceDropped: null
            }
        });

        this.boardController.drawBoard(() => this.onBoardReady());
    }

    onBoardReady() {
        // setup the board pieces
        var row, col, piece;
        //
        for (row = 0; row < this.board.length; row++) {
            for (col = 0; col < this.board[row].length; col++) {
                if (row < 3 && (row + col) % 2) { // black piece
                    piece = {
                        color: GameController.BLACK,
                        pos: [row, col]
                    };
                } else if (row > 4 && (row + col) % 2) { // white piece
                    piece = {
                        color: GameController.WHITE,
                        pos: [row, col]
                    };
                } else { // empty square
                    piece = 0;
                }

                this.board[row][col] = piece;

                if (piece) {
                    this.boardController.addPiece(piece);
                }
            }
        }
    }
}

GameController.WHITE = 1;
GameController.BLACK = 1;
