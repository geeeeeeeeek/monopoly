CHECKERS.BoardController = function (options) {
    'use strict';
    
    options = options || {};

    /**********************************************************************************************/
    /* Private properties *************************************************************************/

    /**
     * Store the instance of 'this' object.
     * @type CHECKERS.BoardController
     */
    var instance = this;

    /**
     * The DOM Element in which the drawing will happen.
     * @type HTMLDivElement
     */
    var containerEl = options.containerEl || null;
    
    /** @type String */
    var assetsUrl = options.assetsUrl || '';
    
    /** @type THREE.WebGLRenderer */
    var renderer;

    /** @type THREE.Projector */
    var projector;

    /** @type THREE.Scene */
    var scene;
    
    /** @type THREE.PerspectiveCamera */
    var camera;
    
    /** @type THREE.OrbitControls */
    var cameraController;
    
	/** @type Object */
	var lights = {};
	    
	/** @type Object */
	var materials = {};
	
	/** @type THREE.Geometry */
	var pieceGeometry = null;
	
	/** @type THREE.Mesh */
	var boardModel;
	
	/** @type THREE.Mesh */
	var groundModel;
	
	/**
	 * The board square size.
	 * @type Number
	 * @constant
	 */
	var squareSize = 10;
	
	/**
     * The board representation.
     * @type Array
     */
    var board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    /** @type Object */
    var selectedPiece = null;

    /** @type Object */
    var callbacks = options.callbacks || {};
    
    
    /**********************************************************************************************/
    /* Public methods *****************************************************************************/
    
    /**
     * Draws the board.
     */
    this.drawBoard = function (callback) {
        initEngine();
        initLights();
        initMaterials();
        
        initObjects(function () {
            onAnimationFrame();
            
            callback();
        });

        initListeners();
    };
    
    /**
     * Adds a piece to the board.
     * @param {Object} piece The piece properties.
     */
    this.addPiece = function (piece) {
	    var pieceMesh = new THREE.Mesh(pieceGeometry);
	    var pieceObjGroup = new THREE.Object3D();
	    //
	    if (piece.color === CHECKERS.WHITE) {
	        pieceObjGroup.color = CHECKERS.WHITE;
	        pieceMesh.material = materials.whitePieceMaterial;
	    } else {
	        pieceObjGroup.color = CHECKERS.BLACK;
	        pieceMesh.material = materials.blackPieceMaterial;
	    }
	 
	    // create shadow plane
	    var shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(squareSize, squareSize, 1, 1), materials.pieceShadowPlane);
	    shadowPlane.rotation.x = -90 * Math.PI / 180;
	 
	    pieceObjGroup.add(pieceMesh);
	    pieceObjGroup.add(shadowPlane);
	 
	    pieceObjGroup.position = boardToWorld(piece.pos);
	 
	    board[ piece.pos[0] ][ piece.pos[1] ] = pieceObjGroup;
	 
	    scene.add(pieceObjGroup);
	};

    /**
     * Removes a piece from the board.
     */
    this.removePiece = function (row, col) {
        if (board[row][col]) {
            scene.remove(board[row][col]);
        }
     
        board[row][col] = 0;
    };

    /**
     * Moves a piece using internal board array positions.
     * @param {Array} from
     * @param {Array} to
     */
    this.movePiece = function (from, to) {
        var piece = board[ from[0] ][ from[1] ];
        var capturedPiece = board[ to[0] ][ to[1] ];
        var toWorldPos = boardToWorld(to);
     
        // update internal board
        board[ from[0] ][ from[1] ] = 0;
        delete board[ to[0] ][ to[1] ];
        board[ to[0] ][ to[1] ] = piece;
     
        // capture piece
        if (capturedPiece !== 0) {
            scene.remove(capturedPiece);
        }
     
        // move piece
        piece.position.x = toWorldPos.x;
        piece.position.z = toWorldPos.z;
     
        piece.children[0].position.y = 0;
    };
    
    
    /**********************************************************************************************/
    /* Private methods ****************************************************************************/

    /**
     * Initialize some basic 3D engine elements. 
     */
    function initEngine() {
        var viewWidth = containerEl.offsetWidth;
        var viewHeight = containerEl.offsetHeight;
        
        // instantiate the WebGL Renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(viewWidth, viewHeight);

        projector = new THREE.Projector();
        
        // create the scene
        scene = new THREE.Scene();
        
        // create camera
		camera = new THREE.PerspectiveCamera(35, viewWidth / viewHeight, 1, 1000);
		camera.position.set(squareSize * 4, 120, 150);
		cameraController = new THREE.OrbitControls(camera, containerEl);
		cameraController.center = new THREE.Vector3(squareSize * 4, 0, squareSize * 4);
        //
        scene.add(camera);
        
        containerEl.appendChild(renderer.domElement);
    }
    
    /**
     * Initialize the lights.
     */
	function initLights() {
	    // top light
        lights.topLight = new THREE.PointLight();
        lights.topLight.position.set(squareSize * 4, 150, squareSize * 4);
        lights.topLight.intensity = 0.4;
        
        // white's side light
        lights.whiteSideLight = new THREE.SpotLight();
        lights.whiteSideLight.position.set( squareSize * 4, 100, squareSize * 4 + 200);
        lights.whiteSideLight.intensity = 0.8;
        lights.whiteSideLight.shadowCameraFov = 55;

        // black's side light
        lights.blackSideLight = new THREE.SpotLight();
        lights.blackSideLight.position.set( squareSize * 4, 100, squareSize * 4 - 200);
        lights.blackSideLight.intensity = 0.8;
        lights.blackSideLight.shadowCameraFov = 55;
        
        // light that will follow the camera position
        lights.movingLight = new THREE.PointLight(0xf9edc9);
        lights.movingLight.position.set(0, 10, 0);
        lights.movingLight.intensity = 0.5;
        lights.movingLight.distance = 500;
        
        // add the lights in the scene
        scene.add(lights.topLight);
        scene.add(lights.whiteSideLight);
        scene.add(lights.blackSideLight);
        scene.add(lights.movingLight);
	}
	
	/**
     * Initialize the materials.
     */
	function initMaterials() {
	    // board material
	    materials.boardMaterial = new THREE.MeshLambertMaterial({
	        map: THREE.ImageUtils.loadTexture(assetsUrl + 'board_texture.jpg')
	    });
	 
	    // ground material
	    materials.groundMaterial = new THREE.MeshBasicMaterial({
	        transparent: true,
	        map: THREE.ImageUtils.loadTexture(assetsUrl + 'ground.png')
	    });
	 
	    // dark square material
	    materials.darkSquareMaterial = new THREE.MeshLambertMaterial({
	        map: THREE.ImageUtils.loadTexture(assetsUrl + 'square_dark_texture.jpg')
	    });
	    //
	    // light square material
	    materials.lightSquareMaterial = new THREE.MeshLambertMaterial({
	        map: THREE.ImageUtils.loadTexture(assetsUrl + 'square_light_texture.jpg')
	    });
	 
	    // white piece material
	    materials.whitePieceMaterial = new THREE.MeshPhongMaterial({
	        color: 0xe9e4bd,
	        shininess: 20
	    });
	 
	    // black piece material
	    materials.blackPieceMaterial = new THREE.MeshPhongMaterial({
	        color: 0x9f2200,
	        shininess: 20
	    });
	 
	    // pieces shadow plane material
	    materials.pieceShadowPlane = new THREE.MeshBasicMaterial({
	        transparent: true,
	        map: THREE.ImageUtils.loadTexture(assetsUrl + 'piece_shadow.png')
	    });
	}
    
    /**
     * Initialize the objects.
     * @param {Object} callback Function to call when the objects have been loaded.
     */
	function initObjects(callback) {
	    var loader = new THREE.JSONLoader();
	    var totalObjectsToLoad = 2; // board + the piece
	    var loadedObjects = 0; // count the loaded pieces
	 
	    // checks if all the objects have been loaded
	    function checkLoad() {
	        loadedObjects++;
	 
	        if (loadedObjects === totalObjectsToLoad && callback) {
	            callback();
	        }
	    }
	 
	    // load board
	    loader.load(assetsUrl + 'board.js', function (geom) {
	        boardModel = new THREE.Mesh(geom, materials.boardMaterial);
	        boardModel.position.y = -0.02;
	 
	        scene.add(boardModel);
	 
	        checkLoad();
	    });
	 
	    // load piece
	    loader.load(assetsUrl + 'piece.js', function (geometry) {
	        pieceGeometry = geometry;
	 
	        checkLoad();
	    });
	    
	    // add ground
		groundModel = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), materials.groundMaterial);
		groundModel.position.set(squareSize * 4, -1.52, squareSize * 4);
		groundModel.rotation.x = -90 * Math.PI / 180;
		//
		scene.add(groundModel);
		 
		// create the board squares
		var squareMaterial;
		//
		for (var row = 0; row < 8; row++) {
		    for (var col = 0; col < 8; col++) {
		        if ((row + col) % 2 === 0) { // light square
		            squareMaterial = materials.lightSquareMaterial;
		        } else { // dark square
		            squareMaterial = materials.darkSquareMaterial;
		        }
		 
		        var square = new THREE.Mesh(new THREE.PlaneGeometry(squareSize, squareSize, 1, 1), squareMaterial);
		 
		        square.position.x = col * squareSize + squareSize / 2;
		        square.position.z = row * squareSize + squareSize / 2;
		        square.position.y = -0.01;
		 
		        square.rotation.x = -90 * Math.PI / 180;
		 
		        scene.add(square);
		    }
		}
	 
	    //scene.add(new THREE.AxisHelper(200));
	}

    /**
     * Initialize listeners.
     */
    function initListeners() {
        var domElement = renderer.domElement;
     
        domElement.addEventListener('mousedown', onMouseDown, false);
        domElement.addEventListener('mouseup', onMouseUp, false);
    }
    
    /**
     * The render loop.
     */
    function onAnimationFrame() {
        requestAnimationFrame(onAnimationFrame);
        
        cameraController.update();
        
        // update moving light position
        lights.movingLight.position.x = camera.position.x;
        lights.movingLight.position.z = camera.position.z;
        
        renderer.render(scene, camera);
    }

    /**
     * On mouse down.
     * @param {MouseEvent} event
     */
    function onMouseDown(event) {
        var mouse3D = getMouse3D(event);
     
        if (isMouseOnBoard(mouse3D)) {
            if (isPieceOnMousePosition(mouse3D)) {
                selectPiece(mouse3D);
                renderer.domElement.addEventListener('mousemove', onMouseMove, false);
            }
         
            cameraController.userRotate = false;
        }
    }
    
    /**
     * On mouse up.
     * @param {MouseEvent} event
     */
    function onMouseUp(event) {
        renderer.domElement.removeEventListener('mousemove', onMouseMove, false);
     
        var mouse3D = getMouse3D(event);
     
        if (isMouseOnBoard(mouse3D) && selectedPiece) {
            var toBoardPos = worldToBoard(mouse3D);
     
            if (toBoardPos[0] === selectedPiece.boardPos[0] && toBoardPos[1] === selectedPiece.boardPos[1]) {
                deselectPiece();
            } else {
                if (callbacks.pieceCanDrop && callbacks.pieceCanDrop(selectedPiece.boardPos, toBoardPos, selectedPiece.obj.color)) {
                    instance.movePiece(selectedPiece.boardPos, toBoardPos);
     
                    if (callbacks.pieceDropped) {
                        callbacks.pieceDropped(selectedPiece.boardPos, toBoardPos, selectedPiece.obj.color);
                    }
     
                    selectedPiece = null;
                } else {
                    deselectPiece();
                }
            }
        } else {
            deselectPiece();
        }
     
        cameraController.userRotate = true;
    }

    /**
     * On mouse move.
     * @param {MouseEvent} event
     */
    function onMouseMove(event) {
        var mouse3D = getMouse3D(event);
        
        // drag selected piece
        if (selectedPiece) {
            selectedPiece.obj.position.x = mouse3D.x;
            selectedPiece.obj.position.z = mouse3D.z;
            
            // lift piece
            selectedPiece.obj.children[0].position.y = 0.75;
        }
    }
    
    /**
     * Converts the board position to 3D world position.
     * @param {Array} pos The board position.
     * @returns {THREE.Vector3}
     */
    function boardToWorld (pos) {
	    var x = (1 + pos[1]) * squareSize - squareSize / 2;
	    var z = (1 + pos[0]) * squareSize - squareSize / 2;
	 
	    return new THREE.Vector3(x, 0, z);
	}

    /**
     * Converts the world position to board position array.
     * @param {THREE.Vector3} pos
     * @returns {Array|Boolean} False if position was outside the board.
     */
    function worldToBoard(pos) {
        var i = 8 - Math.ceil((squareSize * 8 - pos.z) / squareSize);
        var j = Math.ceil(pos.x / squareSize) - 1;
     
        if (i > 7 || i < 0 || j > 7 || j < 0 || isNaN(i) || isNaN(j)) {
            return false;
        }
     
        return [i, j];
    }

    /**
     * Gets the mouse point in 3D for the XZ plane (Y == 0).
     * @param {MouseEvent} mouseEvent
     * @returns {THREE.Vector3}
     */
    function getMouse3D(mouseEvent) {
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
            (x / renderer.domElement.width) * 2 - 1,
           -(y / renderer.domElement.height) * 2 + 1,
           1
        );
        //
        projector.unprojectVector(pMouse, camera);
     
        var cam = camera.position;
        var m = pMouse.y / ( pMouse.y - cam.y );
     
        pos.x = pMouse.x + ( cam.x - pMouse.x ) * m;
        pos.z = pMouse.z + ( cam.z - pMouse.z ) * m;
     
        return pos;
    }

    /**
     * Test if the mouse position is on the board.
     * @param {THREE.Vector3} pos Mouse position.
     * @returns {Boolean}
     */
    function isMouseOnBoard(pos) {
        if (pos.x >= 0 && pos.x <= squareSize * 8 &&
            pos.z >= 0 && pos.z <= squareSize * 8) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Test if there's a piece on mouse position.
     * @param {THREE.Vector3} pos Mouse position.
     * @returns {Boolean}
     */
    function isPieceOnMousePosition(pos) {
        var boardPos = worldToBoard(pos);
     
        if (boardPos && board[ boardPos[0] ][ boardPos[1] ] !== 0) {
            return true;
        }
     
        return false;
    }

    /**
     * Selects a piece on the board.
     * @param {THREE.Vector3} pos The projected mouse coordinates to 3D.
     * @returns {Boolean} False if there's no piece to select.
     */
    function selectPiece(pos) {
        var boardPos = worldToBoard(pos);
     
        // check for piece presence
        if (board[ boardPos[0] ][ boardPos[1] ] === 0) {
            selectedPiece = null;
            return false;
        }
     
        selectedPiece = {};
        selectedPiece.boardPos = boardPos;
        selectedPiece.obj = board[ boardPos[0] ][ boardPos[1] ];
        selectedPiece.origPos = selectedPiece.obj.position.clone();
     
        return true;
    }

    /**
     * Deselects the selected piece.
     */
    function deselectPiece() {
        if (!selectedPiece) {
            return;
        }
     
        selectedPiece.obj.position = selectedPiece.origPos;
        selectedPiece.obj.children[0].position.y = 0;
     
        selectedPiece = null;
    }
};

