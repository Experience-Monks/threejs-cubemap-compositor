var CubeMapMultisampleMaximumVariedStrengthMaterial = require('./materials/MultisampleMaximumVariedStrength');
var BaseNodeTwo = require('./BaseTwo');

function CubeMapNodeMultisampleMaximumVariedStrength(renderer, inputA, inputB, blurStrength) {
	BaseNodeTwo.call(this, renderer, inputA, inputB, CubeMapMultisampleMaximumVariedStrengthMaterial, {blurStrength: blurStrength});
}

CubeMapNodeMultisampleMaximumVariedStrength.prototype = Object.create(BaseNodeTwo.prototype);
module.exports = CubeMapNodeMultisampleMaximumVariedStrength;