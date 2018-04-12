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
        //         this.$chatCard.classList.remove("modal-hidden");
        //     } else {
        //         this.$chatCard.classList.add("modal-hidden");
        //     }
        // });

        this.showModal(null, "Loading game resources...", []);
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
        const notifyServer = () => {
            this.socket.send(JSON.stringify({
                action: "roll"
            }));
        };
        setTimeout(notifyServer, 2000);
    }

    handleStatusChange(message) {
        const messageHandlers = {
            "init": this.handleInit,
            "roll_res": this.handleRollRes,
            "buy_land": this.handleBuyLand,
            "construct": this.handleConstruct,
            "cancel_decision": this.handleCancel
        };

        messageHandlers[message.action].bind(this)(message);
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

        this.gameLoadingPromise = this.gameController.addPlayer(players.length);
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
    * }],
    * displayTime: int // seconds to display
    * */
    showModal(playerIndex, message, buttons, displayTime) {
        return new Promise(resolve => {
            if (playerIndex === null) {
                this.$modalAvatar.src = GameView.DEFAULT_AVATAR;
            } else {
                this.$modalAvatar.src = this.players[playerIndex].avatar;
            }

            if (playerIndex === this.myPlayerIndex) {
                this.$modalAvatar.classList.add("active");
            } else {
                this.$modalAvatar.classList.remove("active");
            }

            this.$modalMessage.innerHTML = message;
            this.$modalButtons.innerHTML = "";

            for (let i in buttons) {
                let button = document.createElement("button");
                button.classList.add("large-button");
                button.id = `modal-button-${i}`;
                button.innerText = buttons[i].text;

                button.addEventListener("click", () => {
                    buttons[i].callback();
                    resolve();
                });
                this.$modalButtons.appendChild(button);
            }

            this.$modalCard.classList.remove("hidden");
            this.$modalCard.classList.remove("modal-hidden");

            // hide modal after a period of time if displayTime is set
            if (displayTime !== undefined && displayTime > 0) {
                setTimeout(() => {
                    this.hideModal();
                    resolve();
                }, displayTime * 1000);
            } else {
                resolve();
            }
        });
    }

    /*
    * Hide the modal
    * */
    hideModal() {
        this.$modalCard.classList.add("modal-hidden");
    }

    async handleInit(message) {
        let players = message.players;
        let changeCash = message.changeCash;
        let nextPlayer = message.nextPlayer;
        this.initGame(players, changeCash);

        this.gameLoadingPromise.then(() => {
            this.hideModal();

            this.changePlayer(nextPlayer, this.onDiceRolled.bind(this));
        });
    }

    async handleRollRes(message) {
        let currPlayer = message.curr_player;
        let nextPlayer = message.next_player;
        let steps = message.steps;
        let newPos = message.new_pos;
        let eventMsg = message.result;
        let rollResMsg = this.players[currPlayer].userName + " gets a roll result " + steps.toString();

        await this.showModal(currPlayer, rollResMsg, [], 2);

        this.gameController.movePlayer(currPlayer, newPos);

        if (message.is_option === "true") {
            const buttons = (this.myPlayerIndex === currPlayer) ? [{
                text: "Yes",
                callback: this.confirmDecision.bind(this)
            }, {
                text: "No",
                callback: this.cancelDecision.bind(this)
            }] : [];
            this.showModal(currPlayer, eventMsg, buttons);
        } else {
            if (message.is_cash_change === "true") {
                await this.showModal(currPlayer, eventMsg, [], 2);
                let cash = message.curr_cash;
                this.changeCashAmount(cash);
            } else if (message.new_event === "true") {
                await this.showModal(currPlayer, eventMsg, [], 2);
                this.changePlayer(nextPlayer, this.onDiceRolled.bind(this));
            }
        }

    }

    handleBuyLand(message) {
        const {curr_player, curr_cash, tile_id} = message;

        this.changeCashAmount(curr_cash);
        // TODO: one player get the land

        let next_player = message.next_player;
        this.changePlayer(next_player, this.onDiceRolled.bind(this));
    }

    handleConstruct(message) {
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

    handleCancel(message) {
        let next_player = message.next_player;
        this.changePlayer(next_player, this.onDiceRolled.bind(this));
    }

    confirmDecision() {
        this.socket.send(JSON.stringify({
            action: "confirmDecision",
            hostname: this.hostName,
        }));
        this.hideModal();
    }

    cancelDecision() {
        this.socket.send(JSON.stringify({
            action: "cancelDecision",
            hostname: this.hostName,
        }));
        this.hideModal();
    }
}

window.onload = () => {
    new GameView();
};

GameView.DEFAULT_AVATAR = "/static/images/favicon.png";
