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
                obj.position.set(...initPos);
                obj.scale.set(...Player.SCALES[this.index]);
                this.scene.add(obj);
            },

            // onProgress callback
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
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
    [0.03, 0.03, 0.03],
    [0.03, 0.03, 0.03],
    [0.03, 0.03, 0.03]
];