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
            this.boardController.drawPlayers(2);
            // this.movePlayer(0, 10);
        });
    }

    movePlayer(playerIndex, newTileId) {
        this.boardController.movePlayer(playerIndex, newTileId);
    }
}
