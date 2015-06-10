var Signal = require('signals').Signal;
var config = require('../config');

function CubeMapNodeOther(renderer, material, outputNode, format, type) {
	type = type || config.textureType;
	this.renderer = renderer;
	var camera = outputNode.camera;
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
CubeMapNodeOther.prototype.update = function() {
	this.camera.updateCubeMap(this.renderer, this.scene);
	this.updateSignal.dispatch();
}

module.exports = CubeMapNodeOther;