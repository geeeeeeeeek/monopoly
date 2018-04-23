"use strict";


class GameView {
    constructor() {
        this.initComponents();
        this.audioManager = new AudioManager();
    }

    initComponents() {
        this.userName = document.getElementById("username").value;
        this.hostName = document.getElementById("hostname").value;

        this.$chatMessageContainer = document.getElementById("chat-messages");
        this.$chatMessageToSend = document.getElementById("chat-message-input");

        this.$chatMessageToSend.addEventListener("keydown", e => {
            const key = e.which || e.keyCode;
            // Detect Enter pressed
            if (key === 13) this.sendMessage();
        });

        this.diceMessage = document.getElementById("dice-message").innerHTML;

        this.$usersContainer = document.getElementById("users-container");

        this.$modalCard = document.getElementById("modal-card");
        this.$modalCardContent = document.querySelector("#modal-card .card-content-container");
        this.$modalAvatar = document.getElementById("modal-user-avatar");
        this.$modalMessage = document.getElementById("modal-message-container");
        this.$modalButtons = document.getElementById("modal-buttons-container");
        this.$modalTitle = document.getElementById("modal-title");
        this.$modalSubTitle = document.getElementById("modal-subtitle");

        this.showModal(null, "Welcome to Monopoly", "", "Loading game resources...", []);
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

        window.addEventListener("resize", () => {
            this.gameController.resizeBoard();
        }, false);
    }

    initWebSocket() {
        this.socket = new WebSocket(`ws://${window.location.host}/game/${this.hostName}`);

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleStatusChange(message);
        };

        this.audioManager.play("background");
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
            "cancel_decision": this.handleCancel,
            "game_end": this.handleGameEnd,
            "chat": this.handleChat,
        };

        messageHandlers[message.action].bind(this)(message);
    }

    /*
    * Init game status, called after ws.connect
    * players: @see initPlayers
    * amount: @see changeCashAmount
    * */
    initGame(players, amount, posChange) {
        // Init players
        this.initPlayers(players, posChange);

        // Init cash amount
        this.changeCashAmount(amount);
    }

    /*
    * Display players on the top
    * players: [{
    *   fullName: string, // user full name
    *   userName: string, // username
    *   avatar: string // user avatar url
    * }]
    * */
    initPlayers(players, initPos) {
        this.players = players;
        this.currentPlayer = null;

        for (let i = 0; i < players.length; i++) {
            if (this.userName === players[i].userName) this.myPlayerIndex = i;
            this.$usersContainer.innerHTML += `
                <div id="user-group-${i}" class="user-group" style="background: ${GameView.PLAYERS_COLORS[i]}">
                    <a href="/monopoly/profile/${players[i].userName}" target="_blank">
                        <img class="user-avatar" src="${players[i].avatar}">
                    </a>
                    <span class="user-cash">
                        <div class="monopoly-cash">M</div>
                        <div class="user-cash-num">1500</div>
                    </span>
                    <img class="user-role" src="/static/images/player_${i}.png">
                </div>`;
        }

        this.gameLoadingPromise = this.gameController.addPlayer(players.length, initPos);
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
        let title = (this.currentPlayer === this.myPlayerIndex) ? "Your Turn!" : "";

        // role dice
        const button = (nextPlayer !== this.myPlayerIndex) ? [] :
            [{
                text: "Roll",
                callback: () => {
                    document.getElementById("roll").checked = true;
                    document.querySelector("#modal-buttons-container button").disabled = true;
                    document.querySelector("#modal-buttons-container button").innerText = "Hold on...";

                    this.audioManager.play("dice");

                    onDiceRolled();
                }
            }];
        this.showModal(nextPlayer, title, "", this.diceMessage, button);
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
    showModal(playerIndex, title, subTitle, message, buttons, displayTime) {
        return new Promise(resolve => {
            if (playerIndex === null) {
                this.$modalAvatar.src = GameView.DEFAULT_AVATAR;
            } else {
                this.$modalAvatar.src = `/static/images/player_${playerIndex}.png`;
                this.$modalAvatar.style.background = GameView.PLAYERS_COLORS[playerIndex];
            }

            if (playerIndex === this.myPlayerIndex) {
                this.$modalAvatar.classList.add("active");
            } else {
                this.$modalAvatar.classList.remove("active");
            }

            this.$modalMessage.innerHTML = message;
            this.$modalButtons.innerHTML = "";

            this.$modalTitle.innerText = title;
            this.$modalSubTitle.innerText = subTitle;

            for (let i in buttons) {
                let button = document.createElement("button");
                button.classList.add("large-button");
                button.id = `modal-button-${i}`;
                button.innerText = buttons[i].text;

                button.addEventListener("click", () => {
                    buttons[i].callback();
                    resolve();
                });

                button.addEventListener("mouseover", () => {
                    this.audioManager.play("hover");
                });

                this.$modalButtons.appendChild(button);
            }

            this.$modalCard.classList.remove("hidden");
            this.$modalCard.classList.remove("modal-hidden");

            // hide modal after a period of time if displayTime is set
            if (displayTime !== undefined && displayTime > 0) {
                setTimeout(async () => {
                    await this.hideModal(true);
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
    hideModal(delayAfter) {
        return new Promise((resolve => {
            this.$modalCard.classList.add("modal-hidden");
            if (delayAfter === true) {
                setTimeout(() => {
                    resolve();
                }, 500);
            } else {
                resolve();
            }
        }))
    }

    async handleInit(message) {
        let players = message.players;
        let changeCash = message.changeCash;
        let nextPlayer = message.nextPlayer;
        let posChange = message.posChange;
        let eventMsg = message.decision;
        let title = message.title;
        let landname = message.landname;
        let owners = message.owners;
        let houses = message.houses;
        this.initGame(players, changeCash, posChange);

        await this.gameLoadingPromise;
        await this.hideModal(true);

        for (let i = 0; i < owners.length; i++) {
            if (owners[i] !== null) {
                this.gameController.addProperty(PropertyManager.PROPERTY_OWNER_MARK, i, owners[i]);
            }
        }

        for (let i = 0; i < houses.length; i++) {
            if (houses[i] === 4) {
                this.gameController.addProperty(PropertyManager.PROPERTY_HOTEL, i);
            }
            else {
                for (let building_num = 0; building_num < houses[i]; building_num++) {
                    this.gameController.addProperty(PropertyManager.PROPERTY_HOUSE, i);
                }
            }
        }


        if (message.waitDecision === "false") {
            this.changePlayer(nextPlayer, this.onDiceRolled.bind(this));
        } else {
            const buttons = (this.myPlayerIndex === nextPlayer) ? [{
                text: "Yes",
                callback: this.confirmDecision.bind(this)
            }, {
                text: "No",
                callback: this.cancelDecision.bind(this)
            }] : [];
            eventMsg = this.players[nextPlayer].userName + " " + eventMsg;
            this.showModal(nextPlayer, title, landname, eventMsg, buttons);
        }
    }


    async handleRollRes(message) {
        let currPlayer = message.curr_player;
        let nextPlayer = message.next_player;
        let steps = message.steps;
        let newPos = message.new_pos;
        let eventMsg = message.result;
        let title = message.title;
        let landname = message.landname;
        let rollResMsg = this.players[currPlayer].userName + " gets a roll result " + steps.toString();

        await this.showModal(currPlayer, "🎲🎲", "", rollResMsg, [], 2);

        await this.gameController.movePlayer(currPlayer, newPos);

        this.audioManager.play("move");

        if (message.bypass_start === "true") {
            let eventMsg = this.players[currPlayer].userName + " has passed the start point, reward 200.";
            if (message.is_cash_change !== "true") {
                let cash = message.curr_cash;
                this.changeCashAmount(cash);
            }
            await this.showModal(currPlayer, "Get Reward", "Start point", eventMsg, [], 2);
        }

        if (message.is_option === "true") {
            const buttons = (this.myPlayerIndex === currPlayer) ? [{
                text: "Yes",
                callback: this.confirmDecision.bind(this)
            }, {
                text: "No",
                callback: this.cancelDecision.bind(this)
            }] : [];

            this.showModal(currPlayer, title, landname, this.players[currPlayer].userName + eventMsg, buttons);
        } else {
            if (message.is_cash_change === "true") {
                await this.showModal(currPlayer, title, landname, this.players[currPlayer].userName + eventMsg, [], 3);
                let cash = message.curr_cash;
                this.changeCashAmount(cash);
                this.changePlayer(nextPlayer, this.onDiceRolled.bind(this));
            } else if (message.new_event === "true") {
                await this.showModal(currPlayer, title, landname, this.players[currPlayer].userName + eventMsg, [], 3);
                this.changePlayer(nextPlayer, this.onDiceRolled.bind(this));
            } else {
                this.changePlayer(nextPlayer, this.onDiceRolled.bind(this));
            }
        }

    }

    handleBuyLand(message) {
        const {curr_player, curr_cash, tile_id} = message;
        this.changeCashAmount(curr_cash);
        this.gameController.addProperty(PropertyManager.PROPERTY_OWNER_MARK, tile_id, curr_player);
        let next_player = message.next_player;
        this.changePlayer(next_player, this.onDiceRolled.bind(this));
    }

    handleConstruct(message) {
        let curr_cash = message.curr_cash;
        let tile_id = message.tile_id;
        this.changeCashAmount(curr_cash);
        if (message.build_type === "house") {
            this.gameController.addProperty(PropertyManager.PROPERTY_HOUSE, tile_id);
        } else {
            this.gameController.addProperty(PropertyManager.PROPERTY_HOTEL, tile_id);
        }
        this.changePlayer(message.next_player, this.onDiceRolled.bind(this));

        this.audioManager.play("build");
    }

    handleCancel(message) {
        let next_player = message.next_player;
        this.changePlayer(next_player, this.onDiceRolled.bind(this));
    }

    async handleGameEnd(message) {
        let loser = message.loser;
        let all_asset = message.all_asset;
        let msg = (loser === this.myPlayerIndex) ? "You loss! You have run out of cash. " : "You win! ";
        for (let i = 0; i < all_asset.length; i++) {
            msg = msg + this.players[i].userName + " has asset: " + all_asset[i] + ". ";
        }
        await this.showModal(this.myPlayerIndex, "Game Over", "game result", msg, [], 10000);
    }

    handleChat(message) {
        let sender = message.sender;
        let content = message.content;
        this.addChatMessage(sender, content);
    }

    async confirmDecision() {
        this.socket.send(JSON.stringify({
            action: "confirm_decision",
            hostname: this.hostName,
        }));

        this.audioManager.play("cash");
        await this.hideModal(true);
    }

    async cancelDecision() {
        this.socket.send(JSON.stringify({
            action: "cancel_decision",
            hostname: this.hostName,
        }));
        await this.hideModal(true);
    }

    /*
    * Add a chat message
    * playerIndex: int
    * message: string
    * */
    addChatMessage(playerIndex, message) {
        let messageElement = document.createElement("div");
        messageElement.classList.add("chat-message");
        messageElement.innerHTML = `
            <img class="chat-message-avatar" src="/static/images/player_${playerIndex}.png">
            <span class="chat-message-content">${message}</span>`;
        this.$chatMessageContainer.appendChild(messageElement);
    }

    sendMessage() {
        const message = this.$chatMessageToSend.value;
        this.socket.send(JSON.stringify({
            action: "chat",
            from: this.myPlayerIndex,
            content: message,
        }));
        this.$chatMessageToSend.value = "";
    }

    /*
    * ScoreList should be sorted
    * [{
    *   playerIndex: int,
    *   score: int
    * }]
    * */
    showScoreboard(scoreList) {
        let scoreboardTemplate = `<div id="scoreboard">`;
        for (let index in scoreList) {
            scoreboardTemplate += `
                <div class="scoreboard-row">
                    <span class="scoreboard-ranking">${index}</span>
                    <img class="chat-message-avatar" src="${this.players[scoreList[index].playerIndex].avatar}">
                    <span class="scoreboard-username">${this.players[scoreList[index].playerIndex].fullName}</span>
                    <div class="monopoly-cash">M</div>
                    <span class="scoreboard-score">${scoreList[index].score}</span>
                </div>`;
        }
        scoreboardTemplate += "</div>";
        this.$modalCardContent.classList.add("scoreboard-bg");
        this.showModal(null, "Scoreboard", "Good Game!", scoreboardTemplate, []);
    }
}

window.onload = () => {
    new GameView();
};

GameView.DEFAULT_AVATAR = "/static/images/favicon.png";

GameView.PLAYERS_COLORS = ["#FFD54F", "#90CAF9", "#E0E0E0", "#B39DDB"];