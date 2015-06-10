var Signal = require('signals').Signal;
var Painter = require('threejs-cubemap-painter');

function CubeMapNodePainter(renderer, pointers, painterCamera) {
	var updateSignal = new Signal();

	var painter = new Painter(pointers, painterCamera, renderer);
	var texture = painter.cubeMapCamera.renderTarget;

	var oldUpdate = painter.cubeMapCamera.updateCubeMap.bind(painter.cubeMapCamera);
	function newUpdate(renderer, scene) {
		// for (var i = 0; i < 6; i++) {
		// 	texture.activeCubeFace = i;
		// 	renderer.clearTarget(texture);
		// };
		var autoClear = renderer.autoClear;
		var autoClearColor = renderer.autoClearColor;
		var autoClearDepth = renderer.autoClearDepth;
		var autoClearStencil = renderer.autoClearStencil;
		renderer.autoClear = true;
		renderer.autoClearColor = false;
		renderer.autoClearDepth = true;
		renderer.autoClearStencil = false;
		oldUpdate(renderer, scene);
		renderer.autoClear = autoClear;
		renderer.autoClearColor = autoClearColor;
		renderer.autoClearDepth = autoClearDepth;
		renderer.autoClearStencil = autoClearStencil;
		updateSignal.dispatch();
	}
	painter.cubeMapCamera.updateCubeMap = newUpdate.bind(painter.cubeMapCamera);
	this.updateSignal = updateSignal;

	this.camera = painter.cubeMapCamera;
	this.texture = texture;
	this.addMesh = painter.addMesh.bind(painter);
	this.setState = painter.setState.bind(painter);
	this.isActive = painter.isActive.bind(painter);
	this.brushMesh = painter.brushMesh;
	this.brushScene = painter.brushScene;
	this.processQueue = painter.processQueue.bind(painter);
}

module.exports = CubeMapNodePainter;