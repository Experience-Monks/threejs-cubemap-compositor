var CubeMapNodeMultisampleMaximum = require('./MultisampleMaximum');
var BasePingPong = require('./BasePingPong');

function CubeMapNodeSuperMultisampleMaximum(renderer, input, iterations) {
	iterations = iterations || 2;
	BasePingPong.call(this, renderer, input, CubeMapNodeMultisampleMaximum, iterations);
}

CubeMapNodeSuperMultisampleMaximum.prototype = Object.create(BasePingPong.prototype);
CubeMapNodeSuperMultisampleMaximum.prototype.onUpdate = function() {
	this.ping.material.uniforms.blurStrength.value = this.blurStrength * 0.5;
}

CubeMapNodeSuperMultisampleMaximum.prototype.onIterate = function(srcNode, dstNode) {
	dstNode.material.uniforms.blurStrength.value = srcNode.material.uniforms.blurStrength.value * 0.5;
}

module.exports = CubeMapNodeSuperMultisampleMaximum;