var CubeMapMultisampleMaximumMaterial = require('./materials/MultisampleMaximum');
var BaseNodeOne = require('./BaseOne');

function CubeMapNodeMultisampleMaximum(renderer, input, blurStrength) {
	BaseNodeOne.call(this, renderer, input, CubeMapMultisampleMaximumMaterial, {blurStrength: blurStrength});
}

CubeMapNodeMultisampleMaximum.prototype = Object.create(BaseNodeOne.prototype);
module.exports = CubeMapNodeMultisampleMaximum;