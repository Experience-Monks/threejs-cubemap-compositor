var Signal = require('signals').Signal;
var config = require('../config');
function CubeMapNodeCamera(renderer, scene) {
	this.renderer = renderer;
	this.scene = scene;
	this.camera = new THREE.CubeCamera(0.1, 1000, 256, config.textureType, THREE.RGBAFormat);
	scene.add(this.camera);
	this.texture = this.camera.renderTarget;
	this.updateSignal = new Signal();
	this.update = this.update.bind(this);
}

CubeMapNodeCamera.prototype.update = function() {
	// for (var i = 0; i < 6; i++) {
	// 	this.texture.activeCubeFace = i;
	// 	this.renderer.clearTarget(this.texture);
	// };
	var autoClear = this.renderer.autoClear;
	var autoClearColor = this.renderer.autoClearColor;
	var autoClearDepth = this.renderer.autoClearDepth;
	var autoClearStencil = this.renderer.autoClearStencil;
	var alpha = this.renderer.getClearAlpha();
	this.renderer.setClearColor(this.renderer.getClearColor(), 0);
	this.renderer.autoClear = true;
	this.renderer.autoClearColor = true;
	this.renderer.autoClearDepth = true;
	this.renderer.autoClearStencil = true;
	this.camera.updateCubeMap(this.renderer, this.scene);
	this.renderer.autoClear = autoClear;
	this.renderer.autoClearColor = autoClearColor;
	this.renderer.autoClearDepth = autoClearDepth;
	this.renderer.autoClearStencil = autoClearStencil;
	this.renderer.setClearColor(this.renderer.getClearColor(), alpha);
	this.updateSignal.dispatch();
}

module.exports = CubeMapNodeCamera;