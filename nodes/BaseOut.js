var Signal = require('signals').Signal;

function CubeMapNodeBaseOut(input) {
	this.updateSignal = new Signal();

	this.update = this.update.bind(this);

	this.texture = input.texture;
	input.updateSignal.add(this.update);
}

CubeMapNodeBaseOut.prototype.update = function() {
	this.updateSignal.dispatch();
}

module.exports = CubeMapNodeBaseOut;