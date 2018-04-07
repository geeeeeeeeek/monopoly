"use strict";

class GameController {

    constructor(options) {
        this.initGame(options);
    }

    initGame(options) {
        const {containerEl, assetsUrl} = options;
        this.boardController = new BoardController({
            containerEl: containerEl,
            assetsUrl: assetsUrl
        });

        this.boardController.drawBoard(() => {
            // this.boardController.addPiece({
            //     pos: [0, 0]
            // })
        });
    }
}

GameController.WHITE = 1;
GameController.BLACK = 1;
