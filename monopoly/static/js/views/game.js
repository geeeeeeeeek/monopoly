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

        // this.initGameBoard();
        this.initGame();
    }

    initGameBoard() {
        new GameController({
            // The DOM element in which the drawing will happen.
            containerEl: document.getElementById('game-container'),

            // The base URL from where the BoardController will load its data.
            assetsUrl: '/static/3d_assets/'
        });
    }

    initGame() {
        this.initPlayers([
            {
                avatar: "/static/images/favicon.png"
            }, {
                avatar: "/static/images/favicon.png"
            }, {
                avatar: "/static/images/favicon.png"
            }, {
                avatar: "/static/images/favicon.png"
            }
        ])
    }

    initPlayers(users) {
        for (let i = 0; i < users.length; i++) {
            this.$usersContainer.innerHTML += `
                <div class="user-group">
                    <img class="user-avatar" src="${users[i].avatar}">
                    <img class="user-role" src="/static/images/player_${i}.png">
                </div>`;
        }
    }
}

window.onload = () => {
    new GameView();
};
