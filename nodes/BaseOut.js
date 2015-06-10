var Signal = require('signals').Signal;

function CubeMapNodeBaseOut(input) {
	if(input === undefined) throw new Error("You must provide a valid input.");
	
	this.updateSignal = new Signal();

	this.update = this.update.bind(this);

	this.texture = input.texture;
	input.updateSignal.add(this.update);
}

CubeMapNodeBaseOut.prototype.update = function() {
	this.updateSignal.dispatch();
}

module.exports = CubeMapNodeBaseOut;