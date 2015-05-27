var CubeMapNodeSuperMultisampleMinimum = require('./SuperMultisampleMinimum');
var CubeMapNodeSuperMultisampleMaximum = require('./SuperMultisampleMaximum');
var BaseNodeOut = require('./BaseOut');

function CubeMapNodeSuperMultisampleMaximin(renderer, input, blurStrength, iterations) {
	iterations = iterations || 3;
	var max = new CubeMapNodeSuperMultisampleMaximum(renderer, input, blurStrength, iterations);
	var min = new CubeMapNodeSuperMultisampleMinimum(renderer, max, blurStrength, iterations);
	BaseNodeOut.call(this, min);
}

CubeMapNodeSuperMultisampleMaximin.prototype = Object.create(BaseNodeOut.prototype);
module.exports = CubeMapNodeSuperMultisampleMaximin;