var CubeMapMultisampleMinimumMaterial = require('./materials/MultisampleMinimumVariedStrength');
var BaseNodeOne = require('./BaseOne');

function CubeMapNodeMultisampleMinimum(renderer, input, blurStrength) {
	BaseNodeOne.call(this, renderer, input, CubeMapMultisampleMinimumMaterial, {blurStrength: blurStrength});
}

CubeMapNodeMultisampleMinimum.prototype = Object.create(BaseNodeOne.prototype);
module.exports = CubeMapNodeMultisampleMinimum;