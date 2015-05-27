var CubeMapNodeMultisampleMinimum = require('./MultisampleMinimum');
var BaseNodeOut = require('./BaseOut');

function CubeMapNodeSuperMultisampleMinimum(renderer, input, blurStrength, iterations) {
	iterations = iterations || 3;
	var last = input;
	while(iterations > 0) {
		blurStrength *= 0.5;
		iterations--;
		last = new CubeMapNodeMultisampleMinimum(renderer, last, blurStrength);
	}

	BaseNodeOut.call(this, last);
}

CubeMapNodeSuperMultisampleMinimum.prototype = Object.create(BaseNodeOut.prototype);
module.exports = CubeMapNodeSuperMultisampleMinimum;