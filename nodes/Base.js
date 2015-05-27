var Signal = require('signals').Signal;
var config = require('../config');

function CubeMapNodeBase(renderer, material, format) {
	this.renderer = renderer;
	var camera = new THREE.CubeCamera(0.1, 2, 256, config.textureType, format);
	var scene = new THREE.Scene();
	var cubeGeomtry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
	var cube = new THREE.Mesh(cubeGeomtry, material);
	scene.add(cube);
	scene.add(camera);
	var texture = camera.renderTarget;

	this.camera = camera;
	this.scene = scene;
	this.material = material;
	this.texture = texture;
	this.updateSignal = new Signal();

	this.update = this.update.bind(this);
}
CubeMapNodeBase.prototype.update = function() {
	this.camera.updateCubeMap(this.renderer, this.scene);
	this.updateSignal.dispatch();
}

module.exports = CubeMapNodeBase;