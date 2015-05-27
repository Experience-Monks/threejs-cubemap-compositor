var CubeMapNodeMultisampleMinimumVariedStrength = require('./MultisampleMinimumVariedStrength');
var BaseNodeOut = require('./BaseOut');

function CubeMapNodeSuperMultisampleMinimumVariedStrength(renderer, inputA, inputB, blurStrength, iterations) {
	iterations = iterations || 3;
	var last = inputA;
	while(iterations > 0) {
		blurStrength *= 0.5;
		iterations--;
		last = new CubeMapNodeMultisampleMinimumVariedStrength(renderer, last, inputB, blurStrength);
	}

	BaseNodeOut.call(this, last);
}

CubeMapNodeSuperMultisampleMinimumVariedStrength.prototype = Object.create(BaseNodeOut.prototype);
module.exports = CubeMapNodeSuperMultisampleMinimumVariedStrength;