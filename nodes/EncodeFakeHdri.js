var CubeMapEncodeFakeHdriMaterial = require('./materials/EncodeFakeHdri');
var BaseNodeOne = require('./BaseOne');

function CubeMapNodeEncodeFakeHdri(renderer, input) {
	BaseNodeOne.call(this, renderer, input, CubeMapEncodeFakeHdriMaterial, {
		type: THREE.UnsignedByteType,
		format: THREE.RGBAFormat
	});
}

CubeMapNodeEncodeFakeHdri.prototype = Object.create(BaseNodeOne.prototype);
module.exports = CubeMapNodeEncodeFakeHdri;