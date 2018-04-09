"use strict";


class GameView {
    constructor() {
        this.initComponents();
    }

    initComponents() {
        this.userName = document.getElementById("username").value;
        this.hostName = document.getElementById("hostname").value;

        this.isChatShown = false;
        this.$chatSwitch = document.getElementById("chat-switch");
        this.$chatCard = document.getElementById("chat-card");

        this.diceMessage = document.getElementById("dice-message").innerHTML;
        this.$usersContainer = document.getElementById("users-container");

        this.$cashCardAmount = document.querySelector("#cash-card .card-content-container");
        this.$modalCard = document.getElementById("modal-card");
        this.$modalAvatar = document.getElementById("modal-user-avatar");
        this.$modalMessage = document.getElementById("modal-message-container");
        this.$modalButtons = document.getElementById("modal-buttons-container");

        // this.$chatSwitch.addEventListener("click", () => {
        //     this.isChatShown = !this.isChatShown;
        //     if (this.isChatShown) {
        //         this.$chatCard.classList.remove("hidden");
        //     } else {
        //         this.$chatCard.classList.add("hidden");
        //     }
        // });
        
        this.initBoard();
    }

    initBoard() {
        new GameController({
            // The DOM element in which the drawing will happen.
            containerEl: document.getElementById("game-container"),

            // The base URL from where the BoardController will load its data.
            assetsUrl: "/static/3d_assets",

            onBoardPainted: this.initWebSocket
        });
    }

    initWebSocket() {
        this.socket = new WebSocket(`ws://${window.location.host}/game/${this.hostName}`);

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleStatusChange(message);
        }
    }
    /*
    * Init game status, called after ws.connect
    * players: @see initPlayers
    * amount: @see changeCashAmount
    * */
    initGame(players, amount) {
        // Init players
        this.initPlayers(players);

        // Init cash amount
        this.changeCashAmount(amount)
    }

    /*
    * Display players on the top
    * players: [{
    *   fullName: string, // user full name
    *   userName: string, // username
    *   avatar: string // user avatar url
    * }]
    * */
    initPlayers(players) {
        this.players = players;
        for (let i = 0; i < players.length; i++) {
            if (this.userName === players[i].userName) this.myPlayerIndex = i;
            this.$usersContainer.innerHTML += `
                <div id="user-group-${i}" class="user-group">
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
        this.$cashCardAmount.innerHTML = amount;
    }

    /*
    * Change player
    * currentPlayer: int,
    * nextPlayer: int,
    * onDiceRolled: function
    * */
    changePlayer(currentPlayer, nextPlayer, onDiceRolled) {
        // update user indicator
        let $currentUserGroup = document.getElementById(`user-group-${currentPlayer}`);
        let $nextUserGroup = document.getElementById(`user-group-${nextPlayer}`);

        $currentUserGroup.classList.remove("active");
        $nextUserGroup.classList.add("active");

        // role dice
        const button = (nextPlayer !== this.myPlayerIndex) ? [] :
            [{
                text: "Roll",
                callback: () => {
                    document.getElementById("roll").checked = true;
                    document.querySelector("#modal-buttons-container button").disabled = true;
                    document.querySelector("#modal-buttons-container button").innerText = "Hold on...";
                    onDiceRolled();
                }
            }];
        this.showModal(nextPlayer, this.diceMessage, button);
    }

    /*
    * Display a pop-up modal
    * message: a snippet of text or HTML
    * playerIndex: int,
    * buttons: [{
    *   text: string, // "button text"
    *   callback: function
    * }]
    * */
    showModal(playerIndex, message, buttons) {
        this.$modalAvatar.src = this.players[playerIndex].avatar;

        if (playerIndex === this.myPlayerIndex) {
            this.$modalAvatar.classList.add("active");
        } else {
            this.$modalAvatar.classList.remove("active");
        }

        this.$modalMessage.innerHTML = message;
        this.$modalButtons.innerHTML = "";

        for (let i in buttons) {
            this.$modalButtons.innerHTML += `
               <button class="large-button" id="modal-button-${i}">${buttons[i].text}</button>
            `;

            document.getElementById(`modal-button-${i}`).addEventListener("click", buttons[i].callback.bind(this))
        }

        this.$modalCard.classList.remove("hidden");
    }

    /*
    * Hide the modal
    * */
    hideModal() {
        this.$modalCard.classList.add("hidden");
    }
}

window.onload = () => {
    new GameView();
};

class TestGameView {
    static stubPlayers() {
        return [
            {
                fullname: "Zhongyi Tong",
                userName: "ztong",
                avatar: "/static/images/favicon.png"
            }, {
                fullname: "Robot",
                userName: "robot",
                avatar: ""
            }
        ]
    }
}