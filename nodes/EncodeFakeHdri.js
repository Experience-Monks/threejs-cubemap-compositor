var CubeMapEncodeFakeHdriMaterial = require('./materials/EncodeFakeHdri');
var BaseNodeOne = require('./BaseOne');

function CubeMapNodeEncodeFakeHdri(renderer, input, scalar) {
	BaseNodeOne.call(this, renderer, input, CubeMapEncodeFakeHdriMaterial, {scalar: scalar});
}

CubeMapNodeEncodeFakeHdri.prototype = Object.create(BaseNodeOne.prototype);
module.exports = CubeMapNodeEncodeFakeHdri;