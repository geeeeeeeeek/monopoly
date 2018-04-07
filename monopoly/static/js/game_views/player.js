"use strict";

class Player {

    constructor(options) {
        const {index, modelUrl, scene, initPos, initTileId} = options;

        this.scene = scene;
        this.index = index;
        this.initModel(modelUrl, initPos, initTileId);
    }

    initModel(modelUrl, initPos, initTileId) {
        this.tileId = initTileId;
        let loader = new THREE.ObjectLoader();
        loader.load(
            modelUrl,

            (obj) => {
                // Add the loaded object to the scene
                this.model = obj;
                this.model.position.set(initPos[0], Player.ELEVATION[this.index], initPos[2]);
                this.model.scale.set(...Player.SCALES[this.index]);
                this.scene.add(this.model);
            },

            // onProgress callback
            (xhr) => {
                if (xhr.loaded === xhr.total) {
                    console.log(modelUrl + " loaded!")
                }
            },

            // onError callback
            (err) => {
                console.error(err);
            });
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
    [0.03, 0.03, 0.03],
    [1.5, 1.5, 1.5],
    [0.04, 0.04, 0.04],
    [0.03, 0.03, 0.03]
];

Player.ELEVATION = [0, 2.0, 2.5, 0];