var CubeMapMultisampleMinimumVariedStrengthMaterial = require('./materials/MultisampleMinimumVariedStrength');
var BaseNodeTwo = require('./BaseTwo');

function CubeMapNodeMultisampleMinimumVariedStrength(renderer, inputA, inputB, blurStrength) {
	BaseNodeTwo.call(this, renderer, inputA, inputB, CubeMapMultisampleMinimumVariedStrengthMaterial, {blurStrength: blurStrength});
}

CubeMapNodeMultisampleMinimumVariedStrength.prototype = Object.create(BaseNodeTwo.prototype);
module.exports = CubeMapNodeMultisampleMinimumVariedStrength;