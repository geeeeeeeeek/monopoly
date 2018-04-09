"use strict";


class GameView {
    constructor() {
        this.initComponents();
    }

    initComponents() {
        this.isChatShown = false;
        this.$chatSwitch = document.getElementById("chat-switch");
        this.$chatCard = document.getElementById("chat-card");
        this.$usersContainer = document.getElementById("users-container");

        // this.$chatSwitch.addEventListener("click", () => {
        //     this.isChatShown = !this.isChatShown;
        //     if (this.isChatShown) {
        //         this.$chatCard.classList.remove("hidden");
        //     } else {
        //         this.$chatCard.classList.add("hidden");
        //     }
        // });

        // this.initBoard();
    }

    initBoard() {
        new GameController({
            // The DOM element in which the drawing will happen.
            containerEl: document.getElementById('game-container'),

            // The base URL from where the BoardController will load its data.
            assetsUrl: '/static/3d_assets/'
        });
    }

    initGame() {
        // Init players
        this.initPlayers(players);

        // Init cash amount
        this.changeCashAmount(amount)
    }

    /*
    * Display players on the top
    * players: [{
    *   name: string, //"user full name"
    *   avatar: string // "user avatar url"
    * }]
    * */
    initPlayers(players) {
        this.players = players;
        for (let i = 0; i < players.length; i++) {
            this.$usersContainer.innerHTML += `
                <div class="user-group">
                    <img class="user-avatar" src="${players[i].avatar}">
                    <img class="user-role" src="/static/images/player_${i}.png">
                </div>`;
        }
    }


    /*
    * Change the cash balance
    * amount: int
    * */
    changeCashAmount(amount) {
        // TODO
    }

    changePlayer() {
        // roll dice
        // TODO
    }

    performAction() {
        // show modal
        // TODO
    }

    /*
    * Display a pop-up modal
    * message: a snippet of text or HTML
    * buttons: [{
    *   text: string, // "button text"
    *   callback: function
    * }]
    * */
    showModal(message, buttons) {

    }

    /*
    * Hide the modal
    * */
    hideModal() {
        // TODO
    }
}

window.onload = () => {
    new GameView();
};
