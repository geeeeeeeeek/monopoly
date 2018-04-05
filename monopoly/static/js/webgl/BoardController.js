"use strict";

class BoardController {

    constructor(options) {
        this.containerEl = options.containerEl || null;

        this.assetsUrl = options.assetsUrl || '';

        this.renderer = null;

        this.projector = null;

        this.scene = null;

        this.camera = null;

        this.cameraController = null;

        this.lights = {};

        this.materials = {};

        this.pieceGeometry = null;

        this.boardModel = null;

        this.groundModel = null;

        this.squareSize = 10;

        this.board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];

        this.selectedPiece = null;

        this.callbacks = options.callbacks || {};
    }

    /**
     * Draws the this.board.
     */
    drawBoard(callback) {
        this.initEngine();
        this.initLights();
        this.initMaterials();

        this.initObjects( ()=> {
            this.onAnimationFrame();

            callback();
        });

        this.initListeners();
    }

    addPiece(piece) {
        var pieceMesh = new THREE.Mesh(this.pieceGeometry);
        var pieceObjGroup = new THREE.Object3D();
        //
        if (piece.color === GameController.WHITE) {
            pieceObjGroup.color = GameController.WHITE;
            pieceMesh.material = this.materials.whitePieceMaterial;
        } else {
            pieceObjGroup.color = GameController.BLACK;
            pieceMesh.material = this.materials.blackPieceMaterial;
        }

        // create shadow plane
        var shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(this.squareSize, this.squareSize, 1, 1), this.materials.pieceShadowPlane);
        shadowPlane.rotation.x = -90 * Math.PI / 180;

        pieceObjGroup.add(pieceMesh);
        pieceObjGroup.add(shadowPlane);

        pieceObjGroup.position = this.boardToWorld(piece.pos);

        this.board[piece.pos[0]][piece.pos[1]] = pieceObjGroup;

        this.scene.add(pieceObjGroup);
    }

    removePiece(row, col) {
        if (this.board[row][col]) {
            this.scene.remove(this.board[row][col]);
        }

        this.board[row][col] = 0;
    }

    movePiece(from, to) {
        var piece = this.board[from[0]][from[1]];
        var capturedPiece = this.board[to[0]][to[1]];
        var toWorldPos = this.boardToWorld(to);

        // update internal this.board
        this.board[from[0]][from[1]] = 0;
        delete this.board[to[0]][to[1]];
        this.board[to[0]][to[1]] = piece;

        // capture piece
        if (capturedPiece !== 0) {
            this.scene.remove(capturedPiece);
        }

        // move piece
        piece.position.x = toWorldPos.x;
        piece.position.z = toWorldPos.z;

        piece.children[0].position.y = 0;
    }


    initEngine() {
        var viewWidth = this.containerEl.offsetWidth;
        var viewHeight = this.containerEl.offsetHeight;

        // instantiate the WebGL this.renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(viewWidth, viewHeight);

        this.projector = new THREE.Projector();

        // create the this.scene
        this.scene = new THREE.Scene();

        // create this.camera
        this.camera = new THREE.PerspectiveCamera(35, viewWidth / viewHeight, 1, 1000);
        this.camera.position.set(this.squareSize * 4, 120, 150);
        this.cameraController = new THREE.OrbitControls(this.camera, this.containerEl);
        this.cameraController.center = new THREE.Vector3(this.squareSize * 4, 0, this.squareSize * 4);
        //
        this.scene.add(this.camera);

        this.containerEl.appendChild(this.renderer.domElement);
    }

    /**
     * Initialize the this.lights.
     */
    initLights() {
        // top light
        this.lights.topLight = new THREE.PointLight();
        this.lights.topLight.position.set(this.squareSize * 4, 150, this.squareSize * 4);
        this.lights.topLight.intensity = 0.4;

        // white's side light
        this.lights.whiteSideLight = new THREE.SpotLight();
        this.lights.whiteSideLight.position.set(this.squareSize * 4, 100, this.squareSize * 4 + 200);
        this.lights.whiteSideLight.intensity = 0.8;
        this.lights.whiteSideLight.shadowCameraFov = 55;

        // black's side light
        this.lights.blackSideLight = new THREE.SpotLight();
        this.lights.blackSideLight.position.set(this.squareSize * 4, 100, this.squareSize * 4 - 200);
        this.lights.blackSideLight.intensity = 0.8;
        this.lights.blackSideLight.shadowCameraFov = 55;

        // light that will follow the this.camera position
        this.lights.movingLight = new THREE.PointLight(0xf9edc9);
        this.lights.movingLight.position.set(0, 10, 0);
        this.lights.movingLight.intensity = 0.5;
        this.lights.movingLight.distance = 500;

        // add the this.lights in the this.scene
        this.scene.add(this.lights.topLight);
        this.scene.add(this.lights.whiteSideLight);
        this.scene.add(this.lights.blackSideLight);
        this.scene.add(this.lights.movingLight);
    }

    /**
     * Initialize the this.materials.
     */
    initMaterials() {
        // this.board material
        this.materials.boardMaterial = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture(this.assetsUrl + 'board_texture.jpg')
        });

        // ground material
        this.materials.groundMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            map: THREE.ImageUtils.loadTexture(this.assetsUrl + 'ground.png')
        });

        // dark square material
        this.materials.darkSquareMaterial = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture(this.assetsUrl + 'square_dark_texture.jpg')
        });
        //
        // light square material
        this.materials.lightsquareMaterial = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture(this.assetsUrl + 'square_light_texture.jpg')
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
            map: THREE.ImageUtils.loadTexture(this.assetsUrl + 'piece_shadow.png')
        });
    }

    /**
     * Initialize the objects.
     * @param {Object} callback Function to call when the objects have been loaded.
     */
    initObjects(callback) {
        var loader = new THREE.JSONLoader();
        var totalObjectsToLoad = 2; // this.board + the piece
        var loadedObjects = 0; // count the loaded pieces

        // checks if all the objects have been loaded
        function checkLoad() {
            loadedObjects++;

            if (loadedObjects === totalObjectsToLoad && callback) {
                callback();
            }
        }

        // load this.board
        loader.load(this.assetsUrl + 'board.js',  (geom) =>{
            this.boardModel = new THREE.Mesh(geom, this.materials.boardMaterial);
            this.boardModel.position.y = -0.02;

            this.scene.add(this.boardModel);

            checkLoad();
        });

        // load piece
        loader.load(this.assetsUrl + 'piece.js',  (geometry) =>{
            this.pieceGeometry = geometry;

            checkLoad();
        });

        // add ground
        this.groundModel = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), this.materials.groundMaterial);
        this.groundModel.position.set(this.squareSize * 4, -1.52, this.squareSize * 4);
        this.groundModel.rotation.x = -90 * Math.PI / 180;
        //
        this.scene.add(this.groundModel);

        // create the this.board squares
        var squareMaterial;
        //
        for (var row = 0; row < 8; row++) {
            for (var col = 0; col < 8; col++) {
                if ((row + col) % 2 === 0) { // light square
                    squareMaterial = this.materials.lightsquareMaterial;
                } else { // dark square
                    squareMaterial = this.materials.darkSquareMaterial;
                }

                var square = new THREE.Mesh(new THREE.PlaneGeometry(this.squareSize, this.squareSize, 1, 1), squareMaterial);

                square.position.x = col * this.squareSize + this.squareSize / 2;
                square.position.z = row * this.squareSize + this.squareSize / 2;
                square.position.y = -0.01;

                square.rotation.x = -90 * Math.PI / 180;

                this.scene.add(square);
            }
        }

        //this.scene.add(new THREE.AxisHelper(200));
    }

    /**
     * Initialize listeners.
     */
    initListeners() {
        var domElement = this.renderer.domElement;

        domElement.addEventListener('mousedown', this.onMouseDown, false);
        domElement.addEventListener('mouseup', this.onMouseUp, false);
    }

    /**
     * The render loop.
     */
    onAnimationFrame() {
        requestAnimationFrame(() => this.onAnimationFrame());

        this.cameraController.update();

        // update moving light position
        this.lights.movingLight.position.x = this.camera.position.x;
        this.lights.movingLight.position.z = this.camera.position.z;

        this.renderer.render(this.scene, this.camera);
    }

    /**
     * On mouse down.
     * @param {MouseEvent} event
     */
    onMouseDown(event) {
        var mouse3D = this.getMouse3D(event);

        if (this.isMouseOnBoard(mouse3D)) {
            if (this.isPieceOnMousePosition(mouse3D)) {
                this.selectPiece(mouse3D);
                this.renderer.domElement.addEventListener('mousemove', this.onMouseMove, false);
            }

            this.cameraController.userRotate = false;
        }
    }

    onMouseUp(event) {
        this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove, false);

        var mouse3D = this.getMouse3D(event);

        if (this.isMouseOnBoard(mouse3D) && this.selectedPiece) {
            var toBoardPos = this.worldToBoard(mouse3D);

            if (toBoardPos[0] === this.selectedPiece.boardPos[0] && toBoardPos[1] === this.selectedPiece.boardPos[1]) {
                this.deselectPiece();
            } else {
                if (this.callbacks.pieceCanDrop && this.callbacks.pieceCanDrop(this.selectedPiece.boardPos, toBoardPos, this.selectedPiece.obj.color)) {
                    this.movePiece(this.selectedPiece.boardPos, toBoardPos);

                    if (this.callbacks.pieceDropped) {
                        this.callbacks.pieceDropped(this.selectedPiece.boardPos, toBoardPos, this.selectedPiece.obj.color);
                    }

                    this.selectedPiece = null;
                } else {
                    this.deselectPiece();
                }
            }
        } else {
            this.deselectPiece();
        }

        this.cameraController.userRotate = true;
    }

    onMouseMove(event) {
        var mouse3D = this.getMouse3D(event);

        // drag selected piece
        if (this.selectedPiece) {
            this.selectedPiece.obj.position.x = mouse3D.x;
            this.selectedPiece.obj.position.z = mouse3D.z;

            // lift piece
            this.selectedPiece.obj.children[0].position.y = 0.75;
        }
    }

    boardToWorld(pos) {
        var x = (1 + pos[1]) * this.squareSize - this.squareSize / 2;
        var z = (1 + pos[0]) * this.squareSize - this.squareSize / 2;

        return new THREE.Vector3(x, 0, z);
    }

    worldToBoard(pos) {
        var i = 8 - Math.ceil((this.squareSize * 8 - pos.z) / this.squareSize);
        var j = Math.ceil(pos.x / this.squareSize) - 1;

        if (i > 7 || i < 0 || j > 7 || j < 0 || isNaN(i) || isNaN(j)) {
            return false;
        }

        return [i, j];
    }

    getMouse3D(mouseEvent) {
        var x, y;
        //
        if (mouseEvent.offsetX !== undefined) {
            x = mouseEvent.offsetX;
            y = mouseEvent.offsetY;
        } else {
            x = mouseEvent.layerX;
            y = mouseEvent.layerY;
        }

        var pos = new THREE.Vector3(0, 0, 0);
        var pMouse = new THREE.Vector3(
            (x / this.renderer.domElement.width) * 2 - 1,
            -(y / this.renderer.domElement.height) * 2 + 1,
            1
        );
        //
        this.projector.unprojectVector(pMouse, this.camera);

        var cam = this.camera.position;
        var m = pMouse.y / (pMouse.y - cam.y);

        pos.x = pMouse.x + (cam.x - pMouse.x) * m;
        pos.z = pMouse.z + (cam.z - pMouse.z) * m;

        return pos;
    }

    isMouseOnBoard(pos) {
        if (pos.x >= 0 && pos.x <= this.squareSize * 8 &&
            pos.z >= 0 && pos.z <= this.squareSize * 8) {
            return true;
        } else {
            return false;
        }
    }

    isPieceOnMousePosition(pos) {
        var boardPos = this.worldToBoard(pos);

        if (boardPos && this.board[boardPos[0]][boardPos[1]] !== 0) {
            return true;
        }

        return false;
    }

    selectPiece(pos) {
        var boardPos = this.worldToBoard(pos);

        // check for piece presence
        if (this.board[boardPos[0]][boardPos[1]] === 0) {
            this.selectedPiece = null;
            return false;
        }

        this.selectedPiece = {};
        this.selectedPiece.boardPos = boardPos;
        this.selectedPiece.obj = this.board[boardPos[0]][boardPos[1]];
        this.selectedPiece.origPos = this.selectedPiece.obj.position.clone();

        return true;
    }

    deselectPiece() {
        if (!this.selectedPiece) {
            return;
        }

        this.selectedPiece.obj.position = this.selectedPiece.origPos;
        this.selectedPiece.obj.children[0].position.y = 0;

        this.selectedPiece = null;
    }
}
