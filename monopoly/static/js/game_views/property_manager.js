"use strict";

class PropertyManager {

    constructor(options) {
        const {loadedHotelJson, loadedHouseJson, scene} = options;

        this.scene = scene;
        this.loadedHotelJson = loadedHotelJson;
        this.loadedHouseJson = loadedHouseJson;
        this.models = [];
    }

    buildHouse(pos) {
        let loader = new THREE.ObjectLoader();
        let model = loader.parse(this.loadedHouseJson);
        model.position.set(pos[0], PropertyManager.ELEVATION[PropertyManager.PROPERTY_HOUSE], pos[2]);
        model.scale.set(...PropertyManager.SCALES[PropertyManager.PROPERTY_HOUSE]);
        this.scene.add(model);

        this.models.push(model);
    }

    buildHotel(pos, tileId) {
        // Remove all houses first
        for (let model of this.models) {
            this.scene.remove(model);
        }

        const side = Board.tileIdToSide(tileId);
        let x = pos[0], y=PropertyManager.ELEVATION[PropertyManager.PROPERTY_HOTEL], z = pos[2];
        switch (side) {
            case Board.SIDE_TOP:
                z += PropertyManager.HOTEL_MARGIN;
                break;
            case Board.SIDE_BOTTOM:
                z -= PropertyManager.HOTEL_MARGIN;
                break;
            case Board.SIDE_LEFT:
                x += PropertyManager.HOTEL_MARGIN;
                break;
            case Board.SIDE_RIGHT:
                x -= PropertyManager.HOTEL_MARGIN;
                break;
        }

        let loader = new THREE.ObjectLoader();
        let model = loader.parse(this.loadedHotelJson);
        model.position.set(x, y, z);
        model.scale.set(...PropertyManager.SCALES[PropertyManager.PROPERTY_HOTEL]);
        this.scene.add(model);

        this.models = [model];
    }

    getPropertyCount() {
        return this.models.length;
    }
}

PropertyManager.SCALES = [
    [0.02, 0.02, 0.02],
    [0.003, 0.003, 0.003]
];

PropertyManager.ELEVATION = [0.31, 0.0];

PropertyManager.PROPERTY_HOUSE = 0;
PropertyManager.PROPERTY_HOTEL = 1;
PropertyManager.HOTEL_MARGIN = 0.4;