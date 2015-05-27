var CubeMapSaturationMaterial = require('./materials/Saturation');
var BaseNodeOne = require('./BaseOne');

function CubeMapNodeSaturation(renderer, input, saturation) {
	BaseNodeOne.call(this, renderer, input, CubeMapSaturationMaterial, {saturation: saturation});
}

CubeMapNodeSaturation.prototype = Object.create(BaseNodeOne.prototype);
module.exports = CubeMapNodeSaturation;