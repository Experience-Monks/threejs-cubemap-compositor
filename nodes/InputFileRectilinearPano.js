var Signal = require('signals').Signal;
var config = require('../config');

function CubeMapNodeFiles(renderer, filename) {
	this.renderer = renderer;
	this.update = this.update.bind(this);

	var panoTexture = THREE.ImageUtils.loadTexture(filename, undefined, this.update);

	var scene = new THREE.Scene();
	var camera = new THREE.CubeCamera(0.1, 1000, 256, config.textureType);
	scene.add(camera);
	var updateSignal = new Signal();

	var sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
	var sphereMaterial = new THREE.MeshBasicMaterial({
		map: panoTexture,
		side: THREE.DoubleSide
	});
	var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	scene.add(sphere)

	this.updateSignal = updateSignal;
	this.camera = camera;
	this.scene = scene;
	this.texture = camera.renderTarget;
}

CubeMapNodeFiles.prototype.update = function() {
	this.camera.updateCubeMap(this.renderer, this.scene);
	this.updateSignal.dispatch();
}

module.exports = CubeMapNodeFiles;