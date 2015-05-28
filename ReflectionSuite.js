var hitTest = require('threejs-hittest');
var Signal = require('signals').Signal;
function noop() {}
var DatGuiKeyboardHelper = require('dat-gui-keyboard-helper');
var CubeMapNodeInputCamera = require('./nodes/InputCamera');
var CubeMapNodeInputFiles = require('./nodes/InputFiles');
var CubeMapNodeInputFileRectilinearPano = require('./nodes/InputFileRectilinearPano');
var CubeMapNodePainter = require('./nodes/Painter');
var CubeMapNodeAdd = require('./nodes/Add');
var CubeMapNodeCombine = require('./nodes/Combine');
var CubeMapNodeSub = require('./nodes/Sub');
var CubeMapNodeMultiply = require('./nodes/Multiply');
var CubeMapNodeMultiplyScalar = require('./nodes/MultiplyScalar');
var CubeMapNodeSaturation = require('./nodes/Saturation');
var CubeMapNodeMultisampleMinimaxVariedStrength = require('./nodes/SuperMultisampleMinimumVariedStrength');
var config = require('./config');
// var FpsController = require('threejs-camera-controller-first-person-desktop');
config.textureType = THREE.FloatType;

function ReflectionSuite(renderer, camera, scene, pointers) {
	var displayCubeMapSignal = new Signal();
	this.displayCubeMapSignal = displayCubeMapSignal;

	var changeSignal = new Signal();
	this.changeSignal = changeSignal;


	var fullWidth = 100;
	var fullHeight = 100;

	var cubeMapNodeInputCamera = new CubeMapNodeInputCamera(renderer, scene);
	// var cubeMapNodeInputFiles = new CubeMapNodeInputFiles(renderer, 'assets/file.png');
	// var cubeMapNodeInputFileRectilinearPano = new CubeMapNodeInputFileRectilinearPano(renderer, 'assets/tarmac.jpg');
	// var cubeMapNodeInput = cubeMapNodeInputFileRectilinearPano;
	var cubeMapNodeInput = cubeMapNodeInputCamera;

	var cubeMapNodePainterBaseline = new CubeMapNodePainter(renderer, pointers, camera);
	var cubeMapNodePainterLight = new CubeMapNodePainter(renderer, pointers, camera);

	var cubeMapNodeInputCameraCursorBaseline = new CubeMapNodeInputCamera(renderer, cubeMapNodePainterBaseline.brushScene);
	var cubeMapNodeCombineCursorBaseline = new CubeMapNodeCombine(renderer, cubeMapNodePainterBaseline, cubeMapNodeInputCameraCursorBaseline);

	var cubeMapNodeInputCameraCursorLight = new CubeMapNodeInputCamera(renderer, cubeMapNodePainterLight.brushScene);
	var cubeMapNodeCombineCursorLight = new CubeMapNodeCombine(renderer, cubeMapNodePainterLight, cubeMapNodeInputCameraCursorLight);

	scene.add(cubeMapNodeInputCamera.camera);
	cubeMapNodeInputCamera.camera.position.y = 1;

	var cubeMapBaseline = new CubeMapNodeMultisampleMinimaxVariedStrength(renderer, cubeMapNodeInput, cubeMapNodeCombineCursorBaseline, 0.5);
	var cubeMapNodeSub = new CubeMapNodeSub(renderer, cubeMapNodeInput, cubeMapBaseline);
	var cubeMapNodeMultiply = new CubeMapNodeMultiply(renderer, cubeMapNodeSub, cubeMapNodeCombineCursorLight, 20);
	var cubeMapNodeSaturation = new CubeMapNodeSaturation(renderer, cubeMapNodeMultiply, 0.5);
	var cubeMapNodeAdd = new CubeMapNodeAdd(renderer, cubeMapBaseline, cubeMapNodeSaturation);
	var cubeMapNodeFinalExposure = new CubeMapNodeMultiplyScalar(renderer, cubeMapNodeAdd, 0.5);

	cubeMapNodeInputCamera.update();

	var displayMaterials = [];

	var datGui = new DatGuiKeyboardHelper();
	datGui.gui.domElement.style.float = 'left';
	var editable = {
		brightness: 0.51,
		transparency: 0.51,
		exposure: 0.11,
		saturation: 0.51,
		fullness: 0.51,
		alphaGammaPower: 0.51
	}

	var lastX = 0;
	var lastY = 0;

	function updateColor() {
		var bright = Math.pow(editable.brightness, 3) * 40;
		cubeMapNodePainterBaseline.brushMesh.material.uniforms.color.value.setRGB(bright, bright, bright);
		cubeMapNodePainterLight.brushMesh.material.uniforms.color.value.setRGB(bright, bright, bright);
		// updateScreenDot(lastX, lastY);
	}

	function updateBrushSize() {
		cubeMapNodePainterBaseline.brushMesh.material.uniforms.fullness.value = editable.fullness;
		cubeMapNodePainterLight.brushMesh.material.uniforms.fullness.value = editable.fullness;
		// updateScreenDot(lastX, lastY);
	}

	function updateBrushFalloff() {
		cubeMapNodePainterBaseline.brushMesh.material.uniforms.alphaGammaPower.value = editable.alphaGammaPower;
		cubeMapNodePainterLight.brushMesh.material.uniforms.alphaGammaPower.value = editable.alphaGammaPower;
		// updateScreenDot(lastX, lastY);
	}

	function updateExposure() {
		cubeMapNodeFinalExposure.material.uniforms.scalar.value = editable.exposure;
		addToQueue(cubeMapNodeFinalExposure.update);
	}

	function updateSaturation() {
		cubeMapNodeSaturation.material.uniforms.saturation.value = editable.saturation;
		addToQueue(cubeMapNodeSaturation.update);
	}

	function updateTransparency() {
		cubeMapNodePainterBaseline.brushMesh.material.uniforms.alphaCenter.value = editable.transparency;
		cubeMapNodePainterLight.brushMesh.material.uniforms.alphaCenter.value = editable.transparency;
		// updateScreenDot(lastX, lastY);
	}

	function setDisplayCubeMap(texture) {
		displayMaterials.forEach(function(material) {
			material.envMap = texture;
		});
		displayCubeMapSignal.dispatch(texture);
	}

	var controls = {
		previewFinal: function() {
			setDisplayCubeMap(cubeMapNodeFinalExposure.texture);
			controls.paintLight();
		},
		previewOriginal: function() {
			setDisplayCubeMap(cubeMapNodeInput.texture);
			changeSignal.dispatch();
		},
		previewBaseline: function() {
			setDisplayCubeMap(cubeMapBaseline.texture);
			controls.paintBaseline();
		},
		previewDataBaseLine: function() {
			setDisplayCubeMap(cubeMapNodeCombineCursorBaseline.texture);
			controls.paintBaseline();
		},
		previewCursorBaseLine: function() {
			setDisplayCubeMap(cubeMapNodePainterBaseline.texture);
			controls.paintBaseline();
		},
		previewDataLight: function() {
			setDisplayCubeMap(cubeMapNodeCombineCursorLight.texture);
			controls.paintLight();
		},
		previewLight: function() {
			setDisplayCubeMap(cubeMapNodeMultiply.texture);
			controls.paintLight();
		},
		paintBaseline: function() {
			cubeMapNodePainterBaseline.setState(true);
			cubeMapNodePainterLight.setState(false);
			changeSignal.dispatch();
		},
		paintLight: function() {
			cubeMapNodePainterBaseline.setState(false);
			cubeMapNodePainterLight.setState(true);
			changeSignal.dispatch();
		},
		toggleMeshVisibility: function() {
			if(meshes.length == 0) return;
			var vis = !meshes[0].visible;
			for (var i = 0; i < meshes.length; i++) {
				meshes[i].visible = vis;
			};
			changeSignal.dispatch();
		}

	}

	datGui.addButton(controls, 'paintBaseline', 'Z', '✍ baseline');
	datGui.addButton(controls, 'paintLight', 'X', '✍ light');
	datGui.addSlider(editable, 'fullness', updateBrushSize, 'R', 'F', 0.01, '✏︎ size', 0, 1 );
	datGui.addSlider(editable, 'transparency', updateTransparency, 'T', 'G', 0.01, '✏︎ opac', 0, 1 );
	datGui.addSlider(editable, 'brightness', updateColor, 'U', 'J', 0.01, '✏︎ brght', 0, 1 );
	datGui.addSlider(editable, 'alphaGammaPower', updateBrushFalloff, 'M', 'N', 0.01, '✏︎ fall', 0.01, 3.01 );
	datGui.addButton(controls, 'previewOriginal', '1', '☉ original');
	datGui.addButton(controls, 'previewDataBaseLine', '2', '☉ basedat');
	datGui.addButton(controls, 'previewBaseline', '3', '☉ baseline');
	datGui.addButton(controls, 'previewDataLight', '4', '☉ lightdat');
	datGui.addButton(controls, 'previewLight', '5', '☉ light');
	datGui.addButton(controls, 'previewFinal', '6', '☉ final');
	datGui.addButton(controls, 'previewCursorBaseLine', '7', '☉ cursor');
	datGui.addSlider(editable, 'saturation', updateSaturation, 'I', 'K', 0.01, '☼ sat', 0, 2 );
	datGui.addSlider(editable, 'exposure', updateExposure, 'O', 'L', 0.01, '☼ expos', 0, 1 );
	datGui.addButton(controls, 'toggleMeshVisibility', '0', '☯ toggl');

	var meshes = [];
	var queue = [];

	function addToQueue(callback) {
		if(queue.indexOf(callback) == -1) queue.push(callback);
	}

	function processQueue() {
		cubeMapNodePainterBaseline.processQueue();
		cubeMapNodePainterLight.processQueue();
		for (var i = 0; i < queue.length; i++) {
			queue[i]();
		}
		for (var i = queue.length - 1; i >= 0; i--) {
			queue.splice(i, 1);
		};
	}

	function updateScreenSize(w, h) {
		fullWidth = w;
		fullHeight = h;
	}

	function updateScreenDot(x, y, id) {
		lastX = x;
		lastY = y;
		x = (x / fullWidth) * 2 - 1;
		y = (y / fullHeight) * 2 - 1;
		var hits = hitTest(x, y, camera, meshes);
		if (hits.length > 0)
		{
			cubeMapNodePainterBaseline.brushMesh.visible = true;
			cubeMapNodePainterLight.brushMesh.visible = true;
			if(cubeMapNodePainterBaseline.isActive()) addToQueue(cubeMapNodeInputCameraCursorBaseline.update);
			if(cubeMapNodePainterLight.isActive()) addToQueue(cubeMapNodeInputCameraCursorLight.update);
			changeSignal.dispatch();
		} else {
			if(cubeMapNodePainterBaseline.brushMesh.visible) {
				cubeMapNodePainterBaseline.brushMesh.visible = false;
				addToQueue(cubeMapNodeInputCameraCursorBaseline.update);
			}
			if(cubeMapNodePainterLight.brushMesh.visible) {
				cubeMapNodePainterLight.brushMesh.visible = false;
				addToQueue(cubeMapNodeInputCameraCursorLight.update);
			}
		}
	}

	pointers.onPointerMoveSignal.add(updateScreenDot);

	this.cubeMapNodePainterBaseline = cubeMapNodePainterBaseline;
	this.cubeMapNodePainterLight = cubeMapNodePainterLight;

	this.cubeMapNodeInput = cubeMapNodeInput;
	this.cubeMapNodeFinalExposure = cubeMapNodeFinalExposure;

	this.meshes = meshes;
	this.displayMaterials = displayMaterials;
	this.processQueue = processQueue;

	updateScreenSize(window.innerWidth, window.innerHeight);
	this.updateScreenSize = updateScreenSize.bind(this);

	this.datGui = datGui;

	controls.paintBaseline();

	updateColor();
	updateBrushSize();
	updateBrushFalloff();
	updateTransparency();
	updateExposure();
	updateSaturation();

}

ReflectionSuite.prototype.addMesh = function(mesh) {
	this.meshes.push(mesh);
	this.cubeMapNodePainterBaseline.addMesh(mesh);
	this.cubeMapNodePainterLight.addMesh(mesh);
};

ReflectionSuite.prototype.addMaterial = function(material) {
	this.displayMaterials.push(material);
};


module.exports = ReflectionSuite;