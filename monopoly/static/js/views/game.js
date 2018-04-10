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
        this.gameController = new GameController({
            // The DOM element in which the drawing will happen.
            containerEl: document.getElementById("game-container"),

            // The base URL from where the BoardController will load its data.
            assetsUrl: "/static/3d_assets",

            onBoardPainted: this.initWebSocket.bind(this)
        });
    }

    initWebSocket() {
        this.socket = new WebSocket(`ws://${window.location.host}/game/${this.hostName}`);

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleStatusChange(message);
        }
    }

    onDiceRolled() {
        this.socket.send(JSON.stringify({
            action: "roll"
        }));
    }

    handleStatusChange(message) {

        if (message.action === "init") {
            this.handle_init(message);
        }
        else if (message.action === "roll_res") {
            this.handle_roll_res(message);
        }
        else if (message.action === "buy_land") {
            this.handle_buy_land(message);
        }
        else if (message.action === "construct") {
            this.handle_construct(message);
        }
        else if (message.action === "cancel_decision") {
            this.handle_cancel(message);
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
        this.currentPlayer = null;

        for (let i = 0; i < players.length; i++) {
            if (this.userName === players[i].userName) this.myPlayerIndex = i;
            this.$usersContainer.innerHTML += `
                <div id="user-group-${i}" class="user-group">
                    <img class="user-avatar" src="${players[i].avatar}">
                    <span class="user-cash">
                        <div class="monopoly-cash">M</div>
                        <div class="user-cash-num">1500</div>
                    </span>
                    <img class="user-role" src="/static/images/player_${i}.png">
                </div>`;
        }

        this.gameController.addPlayer(players.length);
    }

    /*
    * Change the cash balance
    * amounts: [int]
    * */
    changeCashAmount(amounts) {
        for (let i in amounts) {
            const $cashAmount = document.querySelector(`#user-group-${i} .user-cash-num`);
            $cashAmount.innerText = amounts[i];
        }
    }

    /*
    * Change player
    * nextPlayer: int,
    * onDiceRolled: function
    * */
    changePlayer(nextPlayer, onDiceRolled) {
        // update user indicator
        if (this.currentPlayer !== null) {
            let $currentUserGroup = document.getElementById(`user-group-${this.currentPlayer}`);
            $currentUserGroup.classList.remove("active");
        }

        let $nextUserGroup = document.getElementById(`user-group-${nextPlayer}`);
        $nextUserGroup.classList.add("active");

        this.currentPlayer = nextPlayer;

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

            document.getElementById(`modal-button-${i}`).addEventListener("click", buttons[i].callback)
        }

        this.$modalCard.classList.remove("hidden");
    }

    /*
    * Hide the modal
    * */
    hideModal() {
        this.$modalCard.classList.add("hidden");
    }

    handle_init(message) {
        // debugger;
        let players = message.players;
        let changeCash = message.changeCash;
        let nextPlayer = message.nextPlayer;
        this.initGame(players, changeCash);
        this.changePlayer(nextPlayer, this.onDiceRolled.bind(this));
    }

    handle_roll_res(message) {
        let currPlayer = message.curr_player;
        let nextPlayer = message.next_player;
        let steps = message.steps;
        let newPos = message.new_pos;
        let eventMsg = message.result;
        let rollResMsg = this.players[currPlayer].userName + " gets a roll result " + steps.toString();
        this.showModal(currPlayer, rollResMsg, []);
        setTimeout(() => {
            this.hideModal();
            this.gameController.movePlayer(currPlayer, newPos);
            if (message.is_option === "true") {
                // debugger;
                let buttons = [];
                if (this.myPlayerIndex === currPlayer) {
                    buttons.push({
                        text: "confirm",
                        callback: this.confirm_decision.bind(this)
                    });
                    buttons.push({
                        text: "cancel",
                        callback: this.cancel_decision.bind(this)
                    });
                }
                this.showModal(currPlayer, eventMsg, buttons);
            }
            else {
                if (message.is_cash_change === "true") {
                    this.showModal(currPlayer, eventMsg, []);
                    setTimeout(() => {
                        this.hideModal();
                        let cash = message.curr_cash;
                        this.changeCashAmount(cash);
                    }, 2000);
                }
                else if (message.new_event === "true") {
                    this.showModal(currPlayer, eventMsg, []);
                    setTimeout(() => {
                        this.hideModal();
                        this.changePlayer(nextPlayer, this.onDiceRolled.bind(this));
                    }, 2000);
                }
            }
        }, 2000);

    }

    handle_buy_land(message) {
        const {curr_player, curr_cash, tile_id} = message;

        this.changeCashAmount(curr_cash);
        // TODO: one player get the land

        let next_player = message.next_player;
        this.changePlayer(next_player, this.onDiceRolled.bind(this));
    }

    handle_construct(message) {
        let curr_cash = message.curr_cash;
        let tile_id = message.tile_id;
        this.changeCashAmount(curr_cash);
        if (message.build_type === 0) {
            this.gameController.addProperty(PropertyManager.PROPERTY_HOUSE, tile_id);
        } else {
            this.gameController.addProperty(PropertyManager.PROPERTY_HOTEL, tile_id);
        }
        this.changePlayer(message.next_player, this.onDiceRolled.bind(this));
    }

    handle_cancel(message) {
        let next_player = message.next_player;
        this.changePlayer(next_player, this.onDiceRolled.bind(this));
    }

    confirm_decision() {
        this.socket.send(JSON.stringify({
            action: "confirm_decision",
            hostname: this.hostName,
        }));
        this.hideModal();
    }

    cancel_decision() {
        this.socket.send(JSON.stringify({
            action: "cancel_decision",
            hostname: this.hostName,
        }));
        this.hideModal();
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