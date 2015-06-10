var Signal = require('signals').Signal;
var config = require('../config');
var cameraNames = ['PX', 'NX', 'PY', 'NY', 'PZ', 'NZ'];

function CubeMapNodeFiles(renderer, filenameBase, onError) {
	this.renderer = renderer;
	var fileNames = cameraNames.map(function(cameraName){
		return filenameBase.split('.').join('.' + cameraName + '.');
	});
	
	this.update = this.update.bind(this);

	var _this = this;

	this.texture = THREE.ImageUtils.loadTextureCube(
		fileNames, 
		undefined, 
		function() {
			_this.update();
			setTimeout(function() {
				_this.update();
			}, 300);
		}, 
		undefined,
		onError
	);
	this.updateSignal = new Signal();
}

CubeMapNodeFiles.prototype.update = function() {
	this.updateSignal.dispatch();
}

module.exports = CubeMapNodeFiles;