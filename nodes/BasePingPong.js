var Signal = require('signals').Signal;

function CubeMapNodeBasePingPong(renderer, input, NodeClass, iterations) {
	if(input === undefined) throw new Error("You must provide a valid input.");
	
	this.updateSignal = new Signal();

	this.update = this.update.bind(this);

	this.input = input;
	this.initPingPong(renderer, NodeClass);
	this.ping.automaticUpdate = false;
	this.pong.automaticUpdate = false;

	this.texture = this.pong.texture;
	this.iterations = iterations;

	input.updateSignal.add(this.update);
}

CubeMapNodeBasePingPong.prototype.initPingPong = function(renderer, NodeClass) {
	this.ping = new NodeClass(renderer, this.input);
	this.pong = new NodeClass(renderer, this.ping);
}

CubeMapNodeBasePingPong.prototype.update = function() {
	var iterations = this.iterations;
	var first = true;
	this.onUpdate();
	while(iterations > 0) {
		iterations--;
		this.ping.setInput(first ? this.input : this.pong);
		first = false;
		this.ping.update(true);
		this.onIterate(this.ping, this.pong);
		this.pong.update(true);
		this.onIterate(this.pong, this.ping);
	}
	this.updateSignal.dispatch();
}

CubeMapNodeBasePingPong.prototype.onUpdate = function() {
	debugger;
}

CubeMapNodeBasePingPong.prototype.onIterate = function(srcNode, dstNode) {
	debugger;
}

module.exports = CubeMapNodeBasePingPong;