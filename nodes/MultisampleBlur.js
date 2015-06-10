var CubeMapMultisampleBlurMaterial = require('./materials/MultisampleBlur');
var BaseNodeOne = require('./BaseOne');

function CubeMapNodeMultisampleBlur(renderer, input, blurStrength) {
	BaseNodeOne.call(this, renderer, input, CubeMapMultisampleBlurMaterial, {blurStrength: blurStrength});
}

CubeMapNodeMultisampleBlur.prototype = Object.create(BaseNodeOne.prototype);
module.exports = CubeMapNodeMultisampleBlur;