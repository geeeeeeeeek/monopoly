"use strict";

class AudioManager {
    constructor() {
        const audioList = [{
            key: "background",
            loop: true
        }];

        this.audioPlayers = {};
        for (let audio of audioList) {
            this.audioPlayers[audio.key] = new Audio(`/static/sound/${audio.key}.mp3`);
            if (audio.key) this.audioPlayers[audio.key].loop = true;
        }
    }

    play(audio) {
        this.audioPlayers[audio].play();
    }

    mute(audio, doMute) {
        this.audioPlayers[audio] = doMute ? 0.0 : 1.0;
    }
}