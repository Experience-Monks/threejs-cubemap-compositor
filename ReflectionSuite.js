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
var CubeMapNodeSuperMultisampleBlur = require('./nodes/SuperMultisampleBlur');
var CubeMapNodeMultisampleMinimaxVariedStrength = require('./nodes/SuperMultisampleMinimaxVariedStrength');
var config = require('./config');
// var FpsController = require('threejs-camera-controller-first-person-desktop');
config.textureType = THREE.FloatType;

function ReflectionSuite(renderer, camera, cubeMapNodeInput, pointers) {
	var displayCubeMapSignal = new Signal();
	this.displayCubeMapSignal = displayCubeMapSignal;

	var changeSignal = new Signal();
	this.changeSignal = changeSignal;


	var fullWidth = 100;
	var fullHeight = 100;

	// var cubeMapNodeInputFiles = new CubeMapNodeInputFiles(renderer, 'assets/file.png');
	// var cubeMapNodeInputFileRectilinearPano = new CubeMapNodeInputFileRectilinearPano(renderer, 'assets/tarmac.jpg');
	// var cubeMapNodeInput = cubeMapNodeInputFileRectilinearPano;

	var cubeMapNodePainterBaseline = new CubeMapNodePainter(renderer, pointers, camera);
	var cubeMapNodePainterPhysicalLight = new CubeMapNodePainter(renderer, pointers, camera);
	var cubeMapNodePainterExtraLight = new CubeMapNodePainter(renderer, pointers, camera);
	var cubeMapNodePainterLightMask = new CubeMapNodePainter(renderer, pointers, camera);

	var cubeMapNodeInputCameraCursorBaseline = new CubeMapNodeInputCamera(renderer, cubeMapNodePainterBaseline.brushScene);
	var cubeMapNodeCombineCursorBaseline = new CubeMapNodeCombine(renderer, cubeMapNodePainterBaseline, cubeMapNodeInputCameraCursorBaseline);

	var cubeMapNodeInputCameraCursorPhysicalLight = new CubeMapNodeInputCamera(renderer, cubeMapNodePainterPhysicalLight.brushScene);
	var cubeMapNodeCombineCursorPhysicalLight = new CubeMapNodeCombine(renderer, cubeMapNodePainterPhysicalLight, cubeMapNodeInputCameraCursorPhysicalLight);

	var cubeMapNodeInputCameraCursorExtraLight = new CubeMapNodeInputCamera(renderer, cubeMapNodePainterExtraLight.brushScene);
	var cubeMapNodeCombineCursorExtraLight = new CubeMapNodeCombine(renderer, cubeMapNodePainterExtraLight, cubeMapNodeInputCameraCursorExtraLight);

	var cubeMapNodeInputCameraCursorLightMask = new CubeMapNodeInputCamera(renderer, cubeMapNodePainterLightMask.brushScene);
	var cubeMapNodeCombineCursorLightMask = new CubeMapNodeCombine(renderer, cubeMapNodePainterLightMask, cubeMapNodeInputCameraCursorLightMask);

	var cubeMapBaseline = new CubeMapNodeMultisampleMinimaxVariedStrength(renderer, cubeMapNodeInput, cubeMapNodeCombineCursorBaseline, 0.5);
	var cubeMapNodeBaseLineSaturation = new CubeMapNodeSaturation(renderer, cubeMapBaseline, 0.5);
	var cubeMapNodeLightDetails = new CubeMapNodeSub(renderer, cubeMapNodeInput, cubeMapNodeBaseLineSaturation);
	
	var cubeMapNodePhysicalLight = new CubeMapNodeMultiply(renderer, cubeMapNodeLightDetails, cubeMapNodeCombineCursorPhysicalLight, 20);
	var cubeMapNodePhysicalLightSaturation = new CubeMapNodeSaturation(renderer, cubeMapNodePhysicalLight, 0.5);
	var cubeMapNodePhysicalLightComposite = new CubeMapNodeAdd(renderer, cubeMapNodeBaseLineSaturation, cubeMapNodePhysicalLightSaturation);

	var cubeMapNodeCombineCursorGlamourizedLight = new CubeMapNodeAdd(renderer, cubeMapNodeCombineCursorPhysicalLight, cubeMapNodeCombineCursorExtraLight);
	var cubeMapNodeGlamourizedLight = new CubeMapNodeMultiply(renderer, cubeMapNodeLightDetails, cubeMapNodeCombineCursorGlamourizedLight, 20);
	var cubeMapNodeGlamourizedLightSaturation = new CubeMapNodeSaturation(renderer, cubeMapNodeGlamourizedLight, 0.5);
	var cubeMapNodeGlamourizedLightComposite = new CubeMapNodeAdd(renderer, cubeMapNodeBaseLineSaturation, cubeMapNodeGlamourizedLightSaturation);

	var cubeMapNodeMaskedPhysicalLight = new CubeMapNodeMultiply(renderer, cubeMapNodePhysicalLightComposite, cubeMapNodeCombineCursorLightMask, 0.5, 0.1);
	var cubeMapNodeBlurredALittle = new CubeMapNodeSuperMultisampleBlur(renderer, cubeMapNodeMaskedPhysicalLight, 0.01, 2);
	var cubeMapNodeBlurred = new CubeMapNodeSuperMultisampleBlur(renderer, cubeMapNodeGlamourizedLightComposite, 0.5, 4);
	var cubeMapNodeBlurredALot = new CubeMapNodeSuperMultisampleBlur(renderer, cubeMapNodeGlamourizedLightComposite, 0.9, 5);

	var cubeMapNodeMaskedExposed = new CubeMapNodeMultiplyScalar(renderer, cubeMapNodeMaskedPhysicalLight, 0.5);
	var cubeMapNodeBlurredALittleExposed = new CubeMapNodeMultiplyScalar(renderer, cubeMapNodeBlurredALittle, 0.5);
	var cubeMapNodeBlurredExposed = new CubeMapNodeMultiplyScalar(renderer, cubeMapNodeBlurred, 0.5);
	var cubeMapNodeBlurredALotExposed = new CubeMapNodeMultiplyScalar(renderer, cubeMapNodeBlurredALot, 0.5);

	var inputPrerenderSignal = new Signal();
	var inputPostrenderSignal = new Signal();
	function updateInput() {
		addToQueue(function() {
			inputPrerenderSignal.dispatch();
			cubeMapNodeInput.update();
			inputPostrenderSignal.dispatch();
		})
	}

	var displayMaterials = [];

	var datGui = new DatGuiKeyboardHelper();
	datGui.gui.domElement.style.float = 'left';
	var editable = {
		brightness: 0.51,
		transparency: 0.51,
		exposure: 0.11,
		presaturation: 0.85,
		saturation: 0.51,
		fullness: 0.51,
		alphaGammaPower: 0.51
	}

	var lastX = 0;
	var lastY = 0;

	function updateColor() {
		var bright = Math.pow(editable.brightness, 3) * 40;
		cubeMapNodePainterBaseline.brushMesh.material.uniforms.color.value.setRGB(bright, bright, bright);
		cubeMapNodePainterPhysicalLight.brushMesh.material.uniforms.color.value.setRGB(bright, bright, bright);
		cubeMapNodePainterExtraLight.brushMesh.material.uniforms.color.value.setRGB(bright, bright, bright);
		cubeMapNodePainterLightMask.brushMesh.material.uniforms.color.value.setRGB(bright, bright, bright);
		// updateScreenDot(lastX, lastY);
	}

	function updateBrushSize() {
		cubeMapNodePainterBaseline.brushMesh.material.uniforms.fullness.value = editable.fullness;
		cubeMapNodePainterPhysicalLight.brushMesh.material.uniforms.fullness.value = editable.fullness;
		cubeMapNodePainterExtraLight.brushMesh.material.uniforms.fullness.value = editable.fullness;
		cubeMapNodePainterLightMask.brushMesh.material.uniforms.fullness.value = editable.fullness;
		// updateScreenDot(lastX, lastY);
	}

	function updateBrushFalloff() {
		cubeMapNodePainterBaseline.brushMesh.material.uniforms.alphaGammaPower.value = editable.alphaGammaPower;
		cubeMapNodePainterPhysicalLight.brushMesh.material.uniforms.alphaGammaPower.value = editable.alphaGammaPower;
		cubeMapNodePainterExtraLight.brushMesh.material.uniforms.alphaGammaPower.value = editable.alphaGammaPower;
		cubeMapNodePainterLightMask.brushMesh.material.uniforms.alphaGammaPower.value = editable.alphaGammaPower;
		// updateScreenDot(lastX, lastY);
	}

	function updateTransparency() {
		cubeMapNodePainterBaseline.brushMesh.material.uniforms.alphaCenter.value = editable.transparency;
		cubeMapNodePainterPhysicalLight.brushMesh.material.uniforms.alphaCenter.value = editable.transparency;
		cubeMapNodePainterExtraLight.brushMesh.material.uniforms.alphaCenter.value = editable.transparency;
		cubeMapNodePainterLightMask.brushMesh.material.uniforms.alphaCenter.value = editable.transparency;
		// updateScreenDot(lastX, lastY);
	}

	function updateExposure() {
		cubeMapNodeBlurredALittleExposed.material.uniforms.scalar.value = editable.exposure;
		cubeMapNodeBlurredExposed.material.uniforms.scalar.value = editable.exposure;
		cubeMapNodeBlurredALotExposed.material.uniforms.scalar.value = editable.exposure;
		addToQueue(cubeMapNodeBlurredALittleExposed.update);
		addToQueue(cubeMapNodeBlurredExposed.update);
		addToQueue(cubeMapNodeBlurredALotExposed.update);
	}

	function updatePresaturation() {
		cubeMapNodeBaseLineSaturation.material.uniforms.saturation.value = editable.presaturation;
		addToQueue(cubeMapNodeBaseLineSaturation.update);
	}

	function updateSaturation() {
		cubeMapNodePhysicalLightSaturation.material.uniforms.saturation.value = editable.saturation;
		addToQueue(cubeMapNodePhysicalLightSaturation.update);
	}

	function updateBlurALittle() {
		cubeMapNodeBlurred.material.uniforms.blurStrength.value = editable.blurStrength;
		addToQueue(cubeMapNodeBlurred.update);
	}

	function updateBlur() {
		cubeMapNodeBlurred.material.uniforms.blurStrength.value = editable.blurStrength;
		addToQueue(cubeMapNodeBlurred.update);
	}

	function updateBlurALot() {
		cubeMapNodeBlurred.material.uniforms.blurStrength.value = editable.blurStrength;
		addToQueue(cubeMapNodeBlurred.update);
	}

	function setDisplayCubeMap(texture) {
		displayMaterials.forEach(function(material) {
			material.envMap = texture;
		});
		displayCubeMapSignal.dispatch(texture);
	}

	var painters = [
		cubeMapNodePainterBaseline,
		cubeMapNodePainterPhysicalLight,
		cubeMapNodePainterExtraLight,
		cubeMapNodePainterLightMask
	];

	function setPainter(desiredPainter) {
		painters.forEach(function(painter) {
			painter.setState(painter === desiredPainter);
		});
		changeSignal.dispatch();
	}

	function isShiftDown() {
		return datGui.keyboard.isPressed('shift');
	}

	var controls = {
		previewOriginal: function() {
			setDisplayCubeMap(cubeMapNodeInput.texture);
			changeSignal.dispatch();
		},

		previewBaseline: function() {
			if(!isShiftDown()) setDisplayCubeMap(cubeMapBaseline.texture);
			controls.paintBaseline();
		},
		previewDataBaseLine: function() {
			if(!isShiftDown()) setDisplayCubeMap(cubeMapNodeCombineCursorBaseline.texture);
			controls.paintBaseline();
		},

		previewDataPhysicalLight: function() {
			if(!isShiftDown()) setDisplayCubeMap(cubeMapNodeCombineCursorPhysicalLight.texture);
			controls.paintPhysicalLight();
		},
		previewPhysicalLight: function() {
			if(!isShiftDown()) setDisplayCubeMap(cubeMapNodePhysicalLight.texture);
			controls.paintPhysicalLight();
		},

		previewDataGlamourizedLight: function() {
			if(!isShiftDown()) setDisplayCubeMap(cubeMapNodeCombineCursorGlamourizedLight.texture);
			controls.paintExtraLight();
		},
		previewGlamourizedLight: function() {
			if(!isShiftDown()) setDisplayCubeMap(cubeMapNodeGlamourizedLight.texture);
			controls.paintExtraLight();
		},

		previewDataLightMask: function() {
			if(!isShiftDown()) setDisplayCubeMap(cubeMapNodeCombineCursorLightMask.texture);
			controls.paintLightMask();
		},
		previewLightMask: function() {
			if(!isShiftDown()) setDisplayCubeMap(cubeMapNodeMaskedExposed.texture);
			controls.paintLightMask();
		},

		previewBlurALittle: function() {
			setDisplayCubeMap(cubeMapNodeBlurredALittleExposed.texture);
			changeSignal.dispatch();
		},
		previewBlur: function() {
			setDisplayCubeMap(cubeMapNodeBlurredExposed.texture);
			changeSignal.dispatch();
		},
		previewBlurALot: function() {
			setDisplayCubeMap(cubeMapNodeBlurredALotExposed.texture);
			changeSignal.dispatch();
		},

		paintBaseline: function() {
			setPainter(cubeMapNodePainterBaseline);
		},
		paintPhysicalLight: function() {
			setPainter(cubeMapNodePainterPhysicalLight);
		},
		paintExtraLight: function() {
			setPainter(cubeMapNodePainterExtraLight);
		},
		paintLightMask: function() {
			setPainter(cubeMapNodePainterLightMask);
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

	var previewData = {
		original: controls.previewOriginal,
		baseline: [controls.previewBaseline, controls.previewDataBaseLine],
		'p light': [controls.previewPhysicalLight, controls.previewDataPhysicalLight],
		'e light': [controls.previewGlamourizedLight, controls.previewDataGlamourizedLight],
		mask: [controls.previewLightMask, controls.previewDataLightMask],
		blur1: controls.previewBlurALittle,
		blur2: controls.previewBlur,
		blur3: controls.previewBlurALot,
	};

	var previewCallbacks = {};

	var lastCallbackName = '';

	var previewDataKeys = Object.keys(previewData);
	previewDataKeys.forEach(function(key, i) {
		if(i > 9) console.warn('Too many for number keys. No keyboard shortbut assigned!', key);
		var params = previewData[key];
		var type = typeof params;
		var buttonCallback;
		var icon;
		switch(type) {
			case 'function':
				buttonCallback = function(name) {
					params();
					lastCallbackName = name;
				}.bind(null, key)
				icon = '→';
				break;
			case 'object':
				if(params instanceof Array) {
					buttonCallback = function(name) {
						if(lastCallbackName === name) {
							whichCallbackIndex++;
						} else {
							whichCallbackIndex = 0;
						}
						previewData[name][whichCallbackIndex%previewData[name].length]();
						lastCallbackName = name;
					}.bind(null, key);
					icon = '⇉';
				}
				break;
		}
		if(buttonCallback === undefined) debugger;
		previewCallbacks[key] = buttonCallback;
		var num = (i + 1) % 10;
		datGui.addButton(previewCallbacks, key, num.toString(), icon+key);
	})

	datGui.addSlider(editable, 'fullness', updateBrushSize, 'R', 'F', 0.01, '✏︎ size', 0, 1 );
	datGui.addSlider(editable, 'transparency', updateTransparency, 'T', 'G', 0.01, '✏︎ opac', 0, 1 );
	datGui.addSlider(editable, 'brightness', updateColor, 'U', 'J', 0.01, '✏︎ brght', 0, 1 );
	datGui.addSlider(editable, 'alphaGammaPower', updateBrushFalloff, 'M', 'N', 0.01, '✏︎ fall', 0.01, 3.01 );
	datGui.addSlider(editable, 'presaturation', updatePresaturation, 'B', 'V', 0.01, '☼ presat', 0, 2 );
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
		cubeMapNodePainterPhysicalLight.processQueue();
		cubeMapNodePainterExtraLight.processQueue();
		cubeMapNodePainterLightMask.processQueue();
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
			cubeMapNodePainterPhysicalLight.brushMesh.visible = true;
			cubeMapNodePainterExtraLight.brushMesh.visible = true;
			cubeMapNodePainterLightMask.brushMesh.visible = true;
			if(cubeMapNodePainterBaseline.isActive()) addToQueue(cubeMapNodeInputCameraCursorBaseline.update);
			if(cubeMapNodePainterPhysicalLight.isActive()) addToQueue(cubeMapNodeInputCameraCursorPhysicalLight.update);
			if(cubeMapNodePainterExtraLight.isActive()) addToQueue(cubeMapNodeInputCameraCursorExtraLight.update);
			if(cubeMapNodePainterLightMask.isActive()) addToQueue(cubeMapNodeInputCameraCursorLightMask.update);
			changeSignal.dispatch();
		} else {
			if(cubeMapNodePainterBaseline.brushMesh.visible) {
				cubeMapNodePainterBaseline.brushMesh.visible = false;
				addToQueue(cubeMapNodeInputCameraCursorBaseline.update);
			}
			if(cubeMapNodePainterPhysicalLight.brushMesh.visible) {
				cubeMapNodePainterPhysicalLight.brushMesh.visible = false;
				addToQueue(cubeMapNodeInputCameraCursorPhysicalLight.update);
			}
			if(cubeMapNodePainterExtraLight.brushMesh.visible) {
				cubeMapNodePainterExtraLight.brushMesh.visible = false;
				addToQueue(cubeMapNodeInputCameraCursorExtraLight.update);
			}
			if(cubeMapNodePainterLightMask.brushMesh.visible) {
				cubeMapNodePainterLightMask.brushMesh.visible = false;
				addToQueue(cubeMapNodeInputCameraCursorLightMask.update);
			}
		}
	}

	pointers.onPointerMoveSignal.add(updateScreenDot);

	this.cubeMapNodePainterBaseline = cubeMapNodePainterBaseline;
	this.cubeMapNodePainterPhysicalLight = cubeMapNodePainterPhysicalLight;
	this.cubeMapNodePainterExtraLight = cubeMapNodePainterExtraLight;
	this.cubeMapNodePainterLightMask = cubeMapNodePainterLightMask;

	this.cubeMapNodeMaskedExposed = cubeMapNodeMaskedExposed;
	this.cubeMapNodeBlurredALittleExposed = cubeMapNodeBlurredALittleExposed;
	this.cubeMapNodeBlurredExposed = cubeMapNodeBlurredExposed;
	this.cubeMapNodeBlurredALotExposed = cubeMapNodeBlurredALotExposed;

	this.cubeMapNodeInput = cubeMapNodeInput;

	this.inputPrerenderSignal = inputPrerenderSignal;
	this.inputPostrenderSignal = inputPostrenderSignal;

	this.meshes = meshes;
	this.displayMaterials = displayMaterials;
	this.processQueue = processQueue;
	this.updateInput = updateInput;

	updateScreenSize(window.innerWidth, window.innerHeight);
	this.updateScreenSize = updateScreenSize.bind(this);

	this.datGui = datGui;

	controls.paintBaseline();

	updateColor();
	updateBrushSize();
	updateBrushFalloff();
	updateTransparency();
	updateExposure();
	updatePresaturation();
	updateSaturation();

	this.input = cubeMapNodeInput;
	this.mask = cubeMapNodeMaskedExposed;
	this.outputs = [
		cubeMapNodeBlurredALittleExposed,
		cubeMapNodeBlurredExposed,
		cubeMapNodeBlurredALotExposed
	];

}

ReflectionSuite.prototype.addMesh = function(mesh) {
	this.meshes.push(mesh);
	this.cubeMapNodePainterBaseline.addMesh(mesh);
	this.cubeMapNodePainterPhysicalLight.addMesh(mesh);
	this.cubeMapNodePainterExtraLight.addMesh(mesh);
	this.cubeMapNodePainterLightMask.addMesh(mesh);
};

ReflectionSuite.prototype.addMaterial = function(material) {
	this.displayMaterials.push(material);
};


module.exports = ReflectionSuite;