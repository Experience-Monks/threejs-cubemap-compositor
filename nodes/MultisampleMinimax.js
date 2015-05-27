var CubeMapNodeMultisampleMinimum = require('./MultisampleMinimum');
var CubeMapNodeMultisampleMaximum = require('./MultisampleMaximum');
var BaseNodeOut = require('./BaseOut');

function CubeMapNodeMultisampleMinimax(renderer, input, blurStrength) {
	var min = new CubeMapNodeMultisampleMinimum(renderer, input, blurStrength);
	var max = new CubeMapNodeMultisampleMaximum(renderer, min, blurStrength);
	BaseNodeOut.call(this, max);
}

CubeMapNodeMultisampleMinimax.prototype = Object.create(BaseNodeOut.prototype);
module.exports = CubeMapNodeMultisampleMinimax;