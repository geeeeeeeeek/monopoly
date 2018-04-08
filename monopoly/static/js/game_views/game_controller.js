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
            this.boardController.drawPlayers(4);
            // setTimeout(() => {
            //     this.movePlayer(0, 3);
            //     this.movePlayer(1, 9);
            //     this.movePlayer(2, 14);
            //     this.movePlayer(3, 28);
            // }, 10000);
            this.addProperty(PropertyManager.PROPERTY_HOUSE, 3);
            // this.addProperty(PropertyManager.PROPERTY_HOUSE, 3);
            // this.addProperty(PropertyManager.PROPERTY_HOUSE, 3);
            //
            // this.addProperty(PropertyManager.PROPERTY_HOUSE, 26);
            // this.addProperty(PropertyManager.PROPERTY_HOUSE, 26);
            //
            // this.addProperty(PropertyManager.PROPERTY_HOUSE, 13);
            // this.addProperty(PropertyManager.PROPERTY_HOUSE, 13);
            //
            // this.addProperty(PropertyManager.PROPERTY_HOTEL, 6);
            this.addProperty(PropertyManager.PROPERTY_HOTEL, 8);
            // this.addProperty(PropertyManager.PROPERTY_HOTEL, 37);
            // this.addProperty(PropertyManager.PROPERTY_HOTEL, 31);
        });
    }

    movePlayer(playerIndex, newTileId) {
        // TODO: change viewport
        this.boardController.movePlayer(playerIndex, newTileId);
    }

    addProperty(type, tileId) {
        this.boardController.addProperty(type, tileId);
    }
}
