"use strict";

class Player {

    constructor(options) {
        const {index, modelUrl, scene, initPos} = options;

        this.scene = scene;
        this.index = index;
        this.initModel(modelUrl, initPos);
    }

    initModel(modelUrl, initPos) {
        let loader = new THREE.ObjectLoader();
        loader.load(
            modelUrl,

            (obj) => {
                // Add the loaded object to the scene
                obj.position.set(initPos[0], Player.ELEVATION[this.index], initPos[2]);
                obj.scale.set(...Player.SCALES[this.index]);
                this.scene.add(obj);
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

    advanceTo() {
        //TODO
    }
}

Player.SCALES = [
    [0.03, 0.03, 0.03],
    [0.02, 0.02, 0.02],
    [0.04, 0.04, 0.04],
    [0.03, 0.03, 0.03]
];

Player.ELEVATION = [0, 1.1, 2.5, 0];