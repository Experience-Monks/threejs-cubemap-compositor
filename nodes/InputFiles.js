var Signal = require('signals').Signal;
var config = require('../config');
var cameraNames = ['PX', 'NX', 'PY', 'NY', 'PZ', 'NZ'];

function CubeMapNodeFiles(renderer, filenameBase) {
	this.renderer = renderer;
	var fileNames = cameraNames.map(function(cameraName){
		return filenameBase.split('.').join('.' + cameraName + '.');
	});
	
	this.update = this.update.bind(this);

	this.texture = THREE.ImageUtils.loadTextureCube(fileNames, undefined, this.update);
	this.updateSignal = new Signal();
}

CubeMapNodeFiles.prototype.update = function() {
	this.updateSignal.dispatch();
}

module.exports = CubeMapNodeFiles;