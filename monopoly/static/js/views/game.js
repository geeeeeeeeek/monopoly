"use strict";


class GameView {
    constructor() {
        this.initComponents();
    }

    initComponents() {
        this.isChatShown = false;
        this.$chatSwitch = document.getElementById("chat-switch");
        this.$chatCard = document.getElementById("chat-card");

        this.$chatSwitch.addEventListener("click", () => {
            this.isChatShown = !this.isChatShown;
            if (this.isChatShown) {
                this.$chatCard.classList.remove("hidden");
            } else {
                this.$chatCard.classList.add("hidden");
            }
        });

        this.initGameBoard();
    }

    initGameBoard() {
        new GameController({
            // The DOM element in which the drawing will happen.
            containerEl: document.getElementById('game-container'),

            // The base URL from where the Board_controller will load its data.
            assetsUrl: '/static/3d_assets/'
        });
    }
}

window.onload = () => {
    new GameView();
};
