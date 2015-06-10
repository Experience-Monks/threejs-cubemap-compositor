var CubeMapNodeMultisampleMaximumVariedStrength = require('./MultisampleMaximumVariedStrength');
var BaseTwoPingPong = require('./BaseTwoPingPong');

function CubeMapNodeSuperMultisampleMaximumVariedStrength(renderer, inputA, inputB, blurStrength, iterations) {
	iterations = iterations || 3;
	this.blurStrength = blurStrength || 0.3;
	this.onUpdate = this.onUpdate.bind(this);
	BaseTwoPingPong.call(this, renderer, inputA, inputB, CubeMapNodeMultisampleMaximumVariedStrength, iterations);
}

CubeMapNodeSuperMultisampleMaximumVariedStrength.prototype = Object.create(BaseTwoPingPong.prototype);

CubeMapNodeSuperMultisampleMaximumVariedStrength.prototype.onUpdate = function() {
	this.ping.material.uniforms.blurStrength.value = this.blurStrength * 0.5;
}

CubeMapNodeSuperMultisampleMaximumVariedStrength.prototype.onIterate = function(srcNode, dstNode) {
	dstNode.material.uniforms.blurStrength.value = srcNode.material.uniforms.blurStrength.value * 0.5;
}

module.exports = CubeMapNodeSuperMultisampleMaximumVariedStrength;