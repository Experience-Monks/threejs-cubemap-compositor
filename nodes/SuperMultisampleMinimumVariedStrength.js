var CubeMapNodeMultisampleMinimumVariedStrength = require('./MultisampleMinimumVariedStrength');
var BaseTwoPingPong = require('./BaseTwoPingPong');

function CubeMapNodeSuperMultisampleMinimumVariedStrength(renderer, inputA, inputB, blurStrength, iterations) {
	iterations = iterations || 3;
	this.blurStrength = blurStrength || 0.3;
	this.onUpdate = this.onUpdate.bind(this);
	BaseTwoPingPong.call(this, renderer, inputA, inputB, CubeMapNodeMultisampleMinimumVariedStrength, iterations);
}

CubeMapNodeSuperMultisampleMinimumVariedStrength.prototype = Object.create(BaseTwoPingPong.prototype);

CubeMapNodeSuperMultisampleMinimumVariedStrength.prototype.onUpdate = function() {
	this.ping.material.uniforms.blurStrength.value = this.blurStrength * 0.5;
}

CubeMapNodeSuperMultisampleMinimumVariedStrength.prototype.onIterate = function(srcNode, dstNode) {
	dstNode.material.uniforms.blurStrength.value = srcNode.material.uniforms.blurStrength.value * 0.5;
}

module.exports = CubeMapNodeSuperMultisampleMinimumVariedStrength;