"use strict";

class AudioManager {
    constructor() {
        const audioList = [{
            key: "background",
            loop: true,
            volume: 0.6
        }, {
            key: "hover",
            loop: false,
            volume: 1.0
        }, {
            key: "dice",
            loop: false,
            volume: 1.0
        }, {
            key: "move",
            loop: false,
            volume: 1.0
        }, {
            key: "build",
            loop: false,
            volume: 1.0
        }, {
            key: "cash",
            loop: false,
            volume: 1.0
        }];

        this.audioPlayers = {};
        for (let audio of audioList) {
            this.audioPlayers[audio.key] = new Audio(`/static/sound/${audio.key}.mp3`);
            if (audio.loop) this.audioPlayers[audio.key].loop = true;
            if (audio.volume) this.audioPlayers[audio.key].volume = audio.volume;
        }

        this.playing = true;
    }

    play(audio) {
        if (!this.playing) return;
        this.audioPlayers[audio].play();
    }

    mute() {
        this.playing = !this.playing;
        this.audioPlayers["background"].volume = 0.6 * this.playing;
    }
}