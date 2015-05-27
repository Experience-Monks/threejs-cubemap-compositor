var CubeMapNodeSuperMultisampleMinimum = require('./SuperMultisampleMinimum');
var CubeMapNodeSuperMultisampleMaximum = require('./SuperMultisampleMaximum');
var BaseNodeOut = require('./BaseOut');

function CubeMapNodeSuperMultisampleMinimax(renderer, input, blurStrength) {
	var min = new CubeMapNodeSuperMultisampleMinimum(renderer, input, blurStrength);
	var max = new CubeMapNodeSuperMultisampleMaximum(renderer, min, blurStrength);
	BaseNodeOut.call(this, max);
}

CubeMapNodeSuperMultisampleMinimax.prototype = Object.create(BaseNodeOut.prototype);
module.exports = CubeMapNodeSuperMultisampleMinimax;