var CubeMapNodeSuperMultisampleMinimum = require('./SuperMultisampleMinimumVariedStrength');
var CubeMapNodeSuperMultisampleMaximum = require('./SuperMultisampleMaximumVariedStrength');
var BaseNodeOut = require('./BaseOut');

function CubeMapNodeSuperMultisampleMinimax(renderer, inputA, inputB, blurStrength) {
	var min = new CubeMapNodeSuperMultisampleMinimum(renderer, inputA, inputB, blurStrength);
	var max = new CubeMapNodeSuperMultisampleMaximum(renderer, min, inputB, blurStrength);
	BaseNodeOut.call(this, max);
}

CubeMapNodeSuperMultisampleMinimax.prototype = Object.create(BaseNodeOut.prototype);
module.exports = CubeMapNodeSuperMultisampleMinimax;