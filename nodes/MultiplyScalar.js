var CubeMapMultiplyScalarMaterial = require('./materials/MultiplyScalar');
var BaseNodeOne = require('./BaseOne');

function CubeMapNodeMultiplyScalar(renderer, input, scalar) {
	BaseNodeOne.call(this, renderer, input, CubeMapMultiplyScalarMaterial, {scalar: scalar});
}

CubeMapNodeMultiplyScalar.prototype = Object.create(BaseNodeOne.prototype);
module.exports = CubeMapNodeMultiplyScalar;