"use strict";

class BoardController {

    constructor(options) {
        this.containerEl = options.containerEl;
        this.assetsUrl = options.assetsUrl;

        this.board = new Board();
    }

    drawBoard(callback) {
        this.initEngine();
        this.initLights();
        this.initMaterials();

        this.initObjects(() => {
            this.onAnimationFrame();

            callback();
        });
    }

    addPiece(piece) {
        let loader = new THREE.ObjectLoader();
        loader.load(
            "models/json/example.json",

            (obj) => {
                // Add the loaded object to the scene
                this.scene.add(obj);
            },

            // onProgress callback
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },

            // onError callback
            (err) => {
                console.error('An error happened');
            });


        //
        // let pieceMesh = new THREE.Mesh(this.pieceGeometry);
        // let pieceObjGroup = new THREE.Object3D();
        //
        // pieceObjGroup.color = GameController.WHITE;
        // pieceMesh.material = this.materials.whitePieceMaterial;
        //
        // // create shadow plane
        // let shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(BoardController.SQUARE_SIZE, BoardController.SQUARE_SIZE, 1, 1), this.materials.pieceShadowPlane);
        // shadowPlane.rotation.x = -90 * Math.PI / 180;
        //
        // pieceObjGroup.add(pieceMesh);
        // pieceObjGroup.add(shadowPlane);
        //
        pieceObjGroup.position = this.boardToWorld(piece.pos);

        // this.board[piece.pos[0]][piece.pos[1]] = pieceObjGroup;

        this.scene.add(pieceObjGroup);
    }


    initEngine() {
        let viewWidth = this.containerEl.offsetWidth;
        let viewHeight = this.containerEl.offsetHeight;

        // instantiate the WebGL this.renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(viewWidth, viewHeight);

        // create the this.scene
        this.scene = new THREE.Scene();

        // create this.camera
        this.camera = new THREE.PerspectiveCamera(25, viewWidth / viewHeight, 1, 1000);
        this.camera.position.set(BoardController.SQUARE_SIZE * Board.SIZE / 2, 100, 160);
        this.cameraController = new THREE.OrbitControls(this.camera, this.containerEl);
        this.cameraController.center = new THREE.Vector3(BoardController.SQUARE_SIZE * Board.SIZE / 2, -6, BoardController.SQUARE_SIZE * Board.SIZE / 2);
        //
        this.scene.add(this.camera);

        this.containerEl.appendChild(this.renderer.domElement);
    }

    initLights() {
        this.lights = {};

        // top light
        this.lights.topLight = new THREE.PointLight();
        this.lights.topLight.position.set(BoardController.SQUARE_SIZE * Board.SIZE / 2, 150, BoardController.SQUARE_SIZE * Board.SIZE / 2);
        this.lights.topLight.intensity = 0.4;

        // white's side light
        this.lights.whiteSideLight = new THREE.SpotLight();
        this.lights.whiteSideLight.position.set(BoardController.SQUARE_SIZE * Board.SIZE / 2, 100, BoardController.SQUARE_SIZE * Board.SIZE / 2 - 300);
        this.lights.whiteSideLight.intensity = 1;
        this.lights.whiteSideLight.shadow.camera.Fov = 55;

        // black's side light
        this.lights.blackSideLight = new THREE.SpotLight();
        this.lights.blackSideLight.position.set(BoardController.SQUARE_SIZE * Board.SIZE / 2, 100, BoardController.SQUARE_SIZE * Board.SIZE / 2 + 300);
        this.lights.blackSideLight.intensity = 1;
        this.lights.blackSideLight.shadow.camera.Fov = 55;

        // light that will follow the this.camera position
        this.lights.movingLight = new THREE.PointLight(0xf9edc9);
        this.lights.movingLight.position.set(0, 20, 0);
        this.lights.movingLight.intensity = 0.5;
        this.lights.movingLight.distance = 500;

        // add the this.lights in the this.scene
        this.scene.add(this.lights.topLight);
        this.scene.add(this.lights.whiteSideLight);
        this.scene.add(this.lights.blackSideLight);
        this.scene.add(this.lights.movingLight);
    }

    initMaterials() {
        this.materials = {};

        // board material
        this.materials.boardMaterial = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load(this.assetsUrl + 'board_texture.jpg')
        });

        // ground material
        this.materials.groundMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            map: new THREE.TextureLoader().load(this.assetsUrl + 'ground.png')
        });

        // dark square material
        this.materials.darkSquareMaterial = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load(this.assetsUrl + 'square_dark_texture.jpg')
        });
        //
        // light square material
        this.materials.lightsquareMaterial = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load(this.assetsUrl + 'square_light_texture.jpg')
        });

        // white piece material
        this.materials.whitePieceMaterial = new THREE.MeshPhongMaterial({
            color: 0xe9e4bd,
            shininess: 20
        });

        // black piece material
        this.materials.blackPieceMaterial = new THREE.MeshPhongMaterial({
            color: 0x9f2200,
            shininess: 20
        });

        // pieces shadow plane material
        this.materials.pieceShadowPlane = new THREE.MeshBasicMaterial({
            transparent: true,
            map: new THREE.TextureLoader().load(this.assetsUrl + 'piece_shadow.png')
        });

        const defaultTileMaterial = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load(`${this.assetsUrl}/tiles/-1.png`)
        });

        // tile material
        this.materials.tileMaterial = [];
        for (let row = 0; row < Board.SIZE; row++) {
            let rowMaterial = [];
            for (let col = 0; col < Board.SIZE; col++) {
                const tileModelIndex = Board.locToIndex(row, col);
                const tileMaterial = (tileModelIndex === -1) ? defaultTileMaterial : new THREE.MeshLambertMaterial({
                    map: new THREE.TextureLoader().load(`${this.assetsUrl}/tiles/${tileModelIndex}.png`)
                });
                rowMaterial.push(tileMaterial);
            }
            this.materials.tileMaterial.push(rowMaterial);
        }
    }

    initObjects(callback) {
        let loader = new THREE.JSONLoader();
        let totalObjectsToLoad = 2; // board + the piece
        let loadedObjects = 0; // count the loaded pieces

        // checks if all the objects have been loaded
        function checkLoad() {
            loadedObjects++;

            if (loadedObjects === totalObjectsToLoad && callback) {
                callback();
            }
        }

        // load board
        loader.load(this.assetsUrl + 'board.js', (geom) => {
            this.boardModel = new THREE.Mesh(geom, this.materials.boardMaterial);
            this.boardModel.position.y = -0.02;

            this.scene.add(this.boardModel);

            checkLoad();
        });

        // load piece
        loader.load(this.assetsUrl + 'piece.js', (geometry) => {
            this.pieceGeometry = geometry;

            checkLoad();
        });

        // add ground
        this.groundModel = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), this.materials.groundMaterial);
        this.groundModel.position.set(BoardController.SQUARE_SIZE * Board.SIZE / 2, -1.52, BoardController.SQUARE_SIZE * Board.SIZE / 2);
        this.groundModel.rotation.x = -90 * Math.PI / 180;
        //
        this.scene.add(this.groundModel);

        for (let row = 0; row < Board.SIZE; row++) {
            for (let col = 0; col < Board.SIZE; col++) {
                let square = new THREE.Mesh(new THREE.PlaneGeometry(BoardController.SQUARE_SIZE, BoardController.SQUARE_SIZE, 1, 1), this.materials.tileMaterial[row][col]);

                square.position.x = col * BoardController.SQUARE_SIZE + BoardController.SQUARE_SIZE / 2;
                square.position.z = row * BoardController.SQUARE_SIZE + BoardController.SQUARE_SIZE / 2;
                square.position.y = -0.01;

                square.rotation.x = -90 * Math.PI / 180;

                this.scene.add(square);
            }
        }

        //this.scene.add(new THREE.AxisHelper(200));
    }

    onAnimationFrame() {
        requestAnimationFrame(() => this.onAnimationFrame());

        this.cameraController.update();

        // update moving light position
        this.lights.movingLight.position.x = this.camera.position.x;
        this.lights.movingLight.position.z = this.camera.position.z;

        this.renderer.render(this.scene, this.camera);
    }

    boardToWorld(pos) {
        let x = (1 + pos[1]) * BoardController.SQUARE_SIZE - BoardController.SQUARE_SIZE / 2;
        let z = (1 + pos[0]) * BoardController.SQUARE_SIZE - BoardController.SQUARE_SIZE / 2;

        return new THREE.Vector3(x, 0, z);
    }
}

BoardController.SQUARE_SIZE = 7.273;