var CubeMapDecodeFakeHdriMaterial = require('./materials/DecodeFakeHdri');
var BaseNodeOne = require('./BaseOne');
var config = require('../config');

function CubeMapNodeDecodeFakeHdri(renderer, input) {
	BaseNodeOne.call(this, renderer, input, CubeMapDecodeFakeHdriMaterial, {
		type: config.type,
		format: THREE.RGBAFormat
	});
}

CubeMapNodeDecodeFakeHdri.prototype = Object.create(BaseNodeOne.prototype);
module.exports = CubeMapNodeDecodeFakeHdri;