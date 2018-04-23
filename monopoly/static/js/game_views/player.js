"use strict";

class Player {

    constructor(options) {
        const {index, modelUrl, scene, initPos, initTileId} = options;

        this.scene = scene;
        this.index = index;

        this.modelUrl = modelUrl;
        this.initPos = initPos;
        this.tileId = initTileId;
    }

    load() {
        return new Promise((resolve => {
            new THREE.ObjectLoader().load(
                this.modelUrl,

                (obj) => {
                    // Add the loaded object to the scene
                    this.model = obj;
                    this.model.position.set(this.initPos[0], Player.ELEVATION[this.index], this.initPos[2]);
                    this.model.scale.set(...Player.SCALES[this.index]);
                    this.scene.add(this.model);
                },

                // onProgress callback
                (xhr) => {
                    if (xhr.loaded === xhr.total) {
                        console.log(this.modelUrl + " loaded!");
                        resolve();
                    }
                },

                // onError callback
                (err) => {
                    console.error(err);
                });
        }))
    }

    advanceTo(newTileId, newPos) {
        this.model.position.set(newPos[0], Player.ELEVATION[this.index], newPos[2]);
        this.tileId = newTileId;
    }

    getTileId() {
        return this.tileId;
    }
}

Player.SCALES = [
    [0.04, 0.04, 0.04],
    [1.5, 1.5, 1.5],
    [0.03, 0.03, 0.03],
    [0.03, 0.03, 0.03]
];

Player.ELEVATION = [2.5, 2.0, 0, 0];