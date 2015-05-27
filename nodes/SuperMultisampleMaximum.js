var CubeMapNodeMultisampleMaximum = require('./MultisampleMaximum');
var BaseNodeOut = require('./BaseOut');

function CubeMapNodeSuperMultisampleMaximum(renderer, input, blurStrength, iterations) {
	iterations = iterations || 3;
	var last = input;
	while(iterations > 0) {
		blurStrength *= 0.5;
		iterations--;
		last = new CubeMapNodeMultisampleMaximum(renderer, last, blurStrength);
	}

	BaseNodeOut.call(this, last);
}

CubeMapNodeSuperMultisampleMaximum.prototype = Object.create(BaseNodeOut.prototype);
module.exports = CubeMapNodeSuperMultisampleMaximum;