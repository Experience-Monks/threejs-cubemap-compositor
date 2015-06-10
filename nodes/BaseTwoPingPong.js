var Signal = require('signals').Signal;
var BasePingPong = require('./BasePingPong');

function CubeMapNodeBaseTwoPingPong(renderer, input, inputB, NodeClass, iterations) {
	this.inputB = inputB;

	BasePingPong.call(this, renderer, input, NodeClass, iterations);
	inputB.updateSignal.add(this.update);
}

CubeMapNodeBaseTwoPingPong.prototype = Object.create(BasePingPong.prototype);

CubeMapNodeBaseTwoPingPong.prototype.initPingPong = function(renderer, NodeClass) {
	this.ping = new NodeClass(renderer, this.input, this.inputB);
	this.pong = new NodeClass(renderer, this.ping, this.inputB);
}


module.exports = CubeMapNodeBaseTwoPingPong;