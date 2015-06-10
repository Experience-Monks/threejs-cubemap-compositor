var CubeMapNodeMultisampleBlur = require('./MultisampleBlur');
var BasePingPong = require('./BasePingPong');

function CubeMapNodeSuperMultisampleBlur(renderer, input, blurStrength, iterations) {
	iterations = iterations || 3;
	this.blurStrength = blurStrength || 0.6;
	this.onUpdate = this.onUpdate.bind(this);
	BasePingPong.call(this, renderer, input, CubeMapNodeMultisampleBlur, iterations);
}

CubeMapNodeSuperMultisampleBlur.prototype = Object.create(BasePingPong.prototype);

CubeMapNodeSuperMultisampleBlur.prototype.onUpdate = function() {
	this.ping.material.uniforms.blurStrength.value = this.blurStrength;
}

CubeMapNodeSuperMultisampleBlur.prototype.onIterate = function(srcNode, dstNode) {
	dstNode.material.uniforms.blurStrength.value = srcNode.material.uniforms.blurStrength.value * 0.666667;
}

module.exports = CubeMapNodeSuperMultisampleBlur;