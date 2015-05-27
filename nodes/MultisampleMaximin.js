var CubeMapNodeMultisampleMinimum = require('./MultisampleMinimum');
var CubeMapNodeMultisampleMaximum = require('./MultisampleMaximum');
var BaseNodeOut = require('./BaseOut');

function CubeMapNodeMultisampleMaximin(renderer, input, blurStrength) {
	var max = new CubeMapNodeMultisampleMaximum(renderer, input, blurStrength);
	var min = new CubeMapNodeMultisampleMinimum(renderer, max, blurStrength);
	BaseNodeOut.call(this, min);
}

CubeMapNodeMultisampleMaximin.prototype = Object.create(BaseNodeOut.prototype);
module.exports = CubeMapNodeMultisampleMaximin;