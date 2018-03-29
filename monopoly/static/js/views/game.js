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
    }
}

window.onload = () => {
    new GameView();
};