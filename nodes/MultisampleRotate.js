var CubeMapMultisampleRotateMaterial = require('./materials/MultisampleRotate');
var BaseNodeOne = require('./BaseOne');

function CubeMapNodeMultisampleRotate(renderer, input) {
	BaseNodeOne.call(this, renderer, input, CubeMapMultisampleRotateMaterial);
}

CubeMapNodeMultisampleRotate.prototype = Object.create(BaseNodeOne.prototype);
module.exports = CubeMapNodeMultisampleRotate;