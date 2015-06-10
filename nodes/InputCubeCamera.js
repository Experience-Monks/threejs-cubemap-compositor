var Signal = require('signals').Signal;
var config = require('../config');
function CubeMapNodeCamera(renderer, cubeMap) {
	this.renderer = renderer;
	this.texture = cubeMap.texture ? cubeMap.texture : cubeMap;
	this.updateSignal = new Signal();
	this.update = this.update.bind(this);
}

CubeMapNodeCamera.prototype.update = function() {
	console.warn('this node is a simple input of a cubeMap, and no assumptions on how to update can be made. Update manually first and run this to signal updates downstream.');
	this.updateSignal.dispatch();
}

module.exports = CubeMapNodeCamera;