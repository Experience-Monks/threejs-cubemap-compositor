var CubeMapNodeMultisampleMaximumVariedStrength = require('./MultisampleMaximumVariedStrength');
var BaseNodeOut = require('./BaseOut');

function CubeMapNodeSuperMultisampleMaximumVariedStrength(renderer, inputA, inputB, blurStrength, iterations) {
	iterations = iterations || 3;
	var last = inputA;
	while(iterations > 0) {
		blurStrength *= 0.5;
		iterations--;
		last = new CubeMapNodeMultisampleMaximumVariedStrength(renderer, last, inputB, blurStrength);
	}

	BaseNodeOut.call(this, last);
}

CubeMapNodeSuperMultisampleMaximumVariedStrength.prototype = Object.create(BaseNodeOut.prototype);
module.exports = CubeMapNodeSuperMultisampleMaximumVariedStrength;